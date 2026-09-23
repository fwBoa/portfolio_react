/**
 * Authentification de l'administrateur.
 *
 * Un seul administrateur, un mot de passe, une session signée. Pas de base
 * d'utilisateurs : elle n'apporterait rien pour une personne et ajouterait une
 * surface d'attaque.
 *
 * Ce qui protège réellement
 * -------------------------
 * Le mot de passe n'est jamais stocké en clair : la variable d'environnement
 * contient un hash scrypt. Une fuite de l'environnement Vercel ne donne donc
 * pas le mot de passe lui-même.
 *
 * scrypt (RFC 7914) plutôt que bcrypt : il est dans la bibliothèque standard
 * de Node, ce qui évite une dépendance native à compiler sur Vercel. Il est
 * délibérément coûteux en mémoire et en calcul, ce qui rend une attaque par
 * force brute hors ligne nettement plus chère. Le coût est réglé par les
 * paramètres N/r/p, stockés dans le hash lui-même pour rester vérifiable
 * même si ces réglages changent plus tard.
 *
 * Le format du hash est celui de `scrypt-kdf`, avec des paramètres explicites
 * pour ne dépendre d'aucune convention implicite :
 *
 *   scrypt$N=16384,r=8,p=1$<sel base64>$<hash base64>
 *
 * Comparaison en temps constant : `timingSafeEqual` empêche de déduire le mot
 * de passe en mesurant le temps de réponse, octet par octet.
 */
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

/**
 * Paramètres de dérivation. N=16384 est le réglage par défaut de scrypt et
 * reste tenable sur une fonction serverless ; monter N augmente la résistance
 * mais aussi le temps de réponse.
 */
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEY_LENGTH = 64;

/** Longueur minimale du mot de passe, appliquée à la création du hash. */
export const MIN_PASSWORD_LENGTH = 12;

/**
 * Produit un hash scrypt à partir d'un mot de passe.
 * Sert au script de génération, jamais au runtime de vérification.
 */
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, KEY_LENGTH, {
    N: PARAMS.N,
    r: PARAMS.r,
    p: PARAMS.p,
    // scrypt réclame de la mémoire : sans cette marge, Node refuse les
    // paramètres forts avec un « memory limit exceeded ».
    maxmem: 128 * PARAMS.N * PARAMS.r * 2,
  });

  return [
    'scrypt',
    `N=${PARAMS.N},r=${PARAMS.r},p=${PARAMS.p}`,
    salt.toString('base64'),
    derived.toString('base64'),
  ].join('$');
}

/**
 * Vérifie un mot de passe contre un hash au format décrit plus haut.
 *
 * Renvoie false plutôt que de lever : un hash illisible (variable mal collée,
 * format inattendu) doit fermer l'accès, pas faire tomber la fonction avec une
 * trace qui indiquerait au passage que le secret existe.
 */
export async function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false;

  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== 'scrypt') return false;

  const [, paramString, saltB64, hashB64] = parts;

  const params = Object.fromEntries(
    paramString.split(',').map((pair) => {
      const [key, value] = pair.split('=');
      return [key, Number(value)];
    })
  );

  // Les paramètres viennent du hash stocké : on refuse ceux qui seraient
  // absurdes, sinon un hash forgé pourrait demander N gigantesque et faire
  // tomber la fonction (déni de service).
  const { N, r, p } = params;
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  if (N < 1024 || N > 1 << 20 || r < 1 || r > 32 || p < 1 || p > 16) return false;

  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  if (salt.length === 0 || expected.length === 0) return false;

  let derived;
  try {
    derived = await scryptAsync(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem: 128 * N * r * 2,
    });
  } catch {
    return false;
  }

  // timingSafeEqual exige des longueurs égales : on les a alignées ci-dessus
  // en dérivant exactement la longueur attendue.
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
