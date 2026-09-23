/**
 * Ouverture de session administrateur.
 *
 * POST /api/auth/login  { password }
 *
 * Le message d'erreur est le même pour un mot de passe faux et pour une
 * configuration serveur absente : la réponse ne doit pas révéler à un visiteur
 * ce qui manque.
 */
import { verifyPassword } from '../_lib/password.js';
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from '../_lib/session.js';
import { route, fail, parseBody } from '../_lib/handler.js';

/**
 * Limitation de débit, en mémoire de l'instance.
 *
 * Elle ne survit pas à un redéploiement et chaque instance a la sienne : c'est
 * une gêne contre le bourrage de mot de passe, pas une protection forte. Elle
 * coûte zéro infrastructure et empêche un script d'enchaîner les essais à la
 * vitesse de la fonction.
 *
 * Le calibrage compte : trop stricte, elle exclut l'unique utilisateur légitime
 * de son propre outil. Il faut qu'un administrateur qui se trompe puisse
 * réessayer aussitôt, et qu'un script qui insiste soit arrêté. D'où : seuls les
 * échecs comptent, ils sont oubliés au bout d'une demi-heure, le blocage est
 * court, et il repart à zéro dès une réussite.
 */
const MAX_FAILURES = 8;
const LOCKOUT_MS = 2 * 60 * 1000;
const FAILURE_WINDOW_MS = 30 * 60 * 1000;
const MAX_TRACKED = 500;

const attempts = new Map();

/**
 * Millisecondes restantes avant la fin d'un blocage, ou 0.
 *
 * Supprime au passage les entrées devenues inutiles : sans ce ménage, la
 * mémoire de l'instance ne redescendrait jamais.
 */
function lockRemainingMs(key) {
  const entry = attempts.get(key);
  if (!entry) return 0;

  const remaining = entry.lockedUntil - Date.now();
  if (remaining > 0) return remaining;

  if (entry.lockedUntil > 0 || Date.now() - entry.lastFailureAt > FAILURE_WINDOW_MS) {
    attempts.delete(key);
  }
  return 0;
}

function registerFailure(key) {
  const now = Date.now();
  // Purge opportuniste : la mémoire d'une instance serverless est limitée.
  if (attempts.size >= MAX_TRACKED && !attempts.has(key)) attempts.clear();

  const entry = attempts.get(key) ?? { failures: 0, lockedUntil: 0, lastFailureAt: now };
  entry.failures += 1;
  entry.lastFailureAt = now;

  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = now + LOCKOUT_MS;
    entry.failures = 0; // le blocage prend le relais
  }
  attempts.set(key, entry);
}

/** Message de blocage, avec le temps d'attente réel. */
function lockoutMessage(remainingMs) {
  const minutes = Math.ceil(remainingMs / 60000);
  const delay =
    minutes >= 2
      ? `environ ${minutes} minutes`
      : `environ ${Math.ceil(remainingMs / 1000)} secondes`;
  return `Trop de tentatives. Réessayez dans ${delay}.`;
}

/**
 * Hash factice, utilisé quand aucun mot de passe n'est configuré.
 *
 * On compare contre lui pour que le temps de réponse ne trahisse pas la
 * différence entre « serveur mal configuré » et « mauvais mot de passe ».
 * Aucun mot de passe ne peut lui correspondre : le sel et l'empreinte sont des
 * zéros, ce que scrypt ne produit jamais.
 */
const DUMMY_HASH =
  'scrypt$N=16384,r=8,p=1$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(88);

export default route(
  async (req, res) => {
    const ip =
      (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'inconnu';

    const remaining = lockRemainingMs(ip);
    if (remaining > 0) {
      // Le délai annoncé est le temps restant, pas la durée totale du blocage.
      res.setHeader('Retry-After', String(Math.ceil(remaining / 1000)));
      return fail(res, 429, lockoutMessage(remaining));
    }

    const password = parseBody(req)?.password;

    if (typeof password !== 'string' || password.length === 0) {
      registerFailure(ip);
      return fail(res, 401, 'Mot de passe incorrect.');
    }

    const configured = process.env.ADMIN_PASSWORD_HASH;
    // Le hash factice couvre le cas où la variable manque : la vérification a
    // lieu dans tous les cas, seul son résultat diffère.
    const valid = await verifyPassword(password, configured || DUMMY_HASH);

    if (!configured || !valid) {
      registerFailure(ip);
      if (!configured) {
        console.error('[auth] ADMIN_PASSWORD_HASH absente — connexion impossible.');
      }
      return fail(res, 401, 'Mot de passe incorrect.');
    }

    let token;
    try {
      token = await createSessionToken();
    } catch (error) {
      console.error(`[auth] ${error.message}`);
      return fail(res, 500, 'Configuration serveur incomplète.');
    }

    attempts.delete(ip); // une réussite efface les échecs

    const { maxAge, path, httpOnly, secure, sameSite } = sessionCookieOptions();
    const cookie = [
      `${SESSION_COOKIE}=${token}`,
      `Path=${path}`,
      `Max-Age=${maxAge}`,
      httpOnly ? 'HttpOnly' : '',
      secure ? 'Secure' : '',
      `SameSite=${sameSite}`,
    ]
      .filter(Boolean)
      .join('; ');

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ ok: true });
  },
  { method: 'POST' }
);
