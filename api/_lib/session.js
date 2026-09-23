/**
 * Session administrateur : un JWT signé, dans un cookie httpOnly.
 *
 * Pourquoi un JWT signé et pas un identifiant de session en base
 * -------------------------------------------------------------
 * Il n'y a qu'un administrateur. Un JWT signé porte sa propre validité : la
 * fonction serverless n'a rien à interroger pour savoir si la session tient,
 * ce qui évite une requête à la base sur chaque appel d'API. La contrepartie
 * assumée est qu'une révocation immédiate n'existe pas — la session expire
 * d'elle-même. Avec un seul utilisateur et une durée de vie courte, c'est un
 * compromis raisonnable ; le changement de secret invalide tout d'un coup.
 *
 * Choix de sécurité
 * -----------------
 * - HS256 avec un secret d'au moins 32 octets.
 * - `iss` et `aud` vérifiés : un jeton signé pour un autre usage ne passe pas.
 * - Cookie `httpOnly` : inaccessible au JavaScript, donc hors de portée d'une
 *   injection de script.
 * - `sameSite: 'strict'` : le navigateur n'envoie pas le cookie depuis un
 *   autre site, ce qui coupe les requêtes forgées inter-sites (CSRF).
 * - `secure` en production : jamais transmis en clair. Désactivé en
 *   développement, sinon le cookie ne s'installe pas sur http://localhost.
 * - Cookie posé sur `/api` uniquement : il n'est envoyé qu'aux routes qui en
 *   ont besoin, pas au site public.
 */
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'admin_session';

const ISSUER = 'portfolio-admin';
const AUDIENCE = 'portfolio-admin-session';
const ALGORITHM = 'HS256';

/** Durée de vie de la session : 8 heures, le temps d'une session de travail. */
const TTL_SECONDS = 8 * 60 * 60;

/**
 * Lit le secret depuis l'environnement.
 *
 * Le secret n'est jamais généré à la volée : un secret tiré au démarrage
 * changerait à chaque instance serverless, ce qui invaliderait toutes les
 * sessions sans prévenir.
 */
function getSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error(
      'ADMIN_SESSION_SECRET absente. Générer avec : openssl rand -base64 32'
    );
  }
  const bytes = Buffer.from(value, 'base64');
  if (bytes.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET doit faire au moins 32 octets (base64).');
  }
  return bytes;
}

/** Crée un jeton de session signé. */
export async function createSessionToken() {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject('admin')
    .setIssuedAt(now)
    .setExpirationTime(now + TTL_SECONDS)
    .sign(getSecret());
}

/**
 * Vérifie un jeton. Renvoie la charge utile si valide, null sinon.
 *
 * On ne propage pas l'erreur de `jwtVerify` : distinguer « expiré » de
 * « malformé » ou « mauvaise signature » dans la réponse renseignerait un
 * attaquant sur ce qui a échoué. L'appelant traite tout comme « non
 * authentifié ».
 */
export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: [ALGORITHM],
    });
    return payload;
  } catch {
    return null;
  }
}

/** Options du cookie de session, ajustées selon l'environnement. */
export function sessionCookieOptions() {
  const isProduction = process.env.VERCEL_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api',
    maxAge: TTL_SECONDS,
  };
}

/**
 * Lit le cookie de session dans une requête, sans dépendre du type de
 * handler. `req.headers.cookie` est une chaîne « clé=valeur; clé=valeur ».
 */
export function readSessionCookie(req) {
  const header = req.headers?.cookie;
  if (!header) return null;

  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === SESSION_COOKIE) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}

/**
 * Contrôle d'accès à utiliser en tête de chaque route d'administration.
 *
 * Renvoie true si la requête porte une session valide. Le refus est décidé
 * ici, côté serveur : masquer le bouton dans l'interface ne protège rien, une
 * requête peut toujours être forgée à la main.
 */
export async function isAuthenticated(req) {
  return (await verifySessionToken(readSessionCookie(req))) !== null;
}
