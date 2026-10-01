#!/usr/bin/env node
/**
 * Test de bout en bout de l'authentification administrateur.
 *
 *   node scripts/admin-test.mjs
 *
 * Ce que ce script vérifie, et pourquoi
 * -------------------------------------
 * Une authentification qui « a l'air de marcher » ne prouve rien : ce qui
 * compte est qu'un mauvais mot de passe soit refusé, qu'un jeton falsifié soit
 * rejeté, et qu'un jeton signé avec un autre secret ne passe pas. Ce sont ces
 * cas-là qui se cassent silencieusement lors d'un refactor.
 *
 * Le script travaille sur des valeurs jetables générées à la volée : il ne
 * touche ni à `.env.local` ni à la production.
 */
import { hashPassword, verifyPassword, MIN_PASSWORD_LENGTH } from '../api/_lib/password.js';

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${label}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n1. Dérivation du mot de passe (scrypt)\n');

const password = 'MotDePasseDeTest2026!';
const hash = await hashPassword(password);

console.log(`  hash produit : ${hash.slice(0, 46)}…`);

check('le hash a le format attendu', hash.startsWith('scrypt$N=16384,r=8,p=1$'));
check('le mot de passe n\'apparaît pas dans le hash', !hash.includes(password));
check('deux appels donnent des hash différents (sel aléatoire)', hash !== (await hashPassword(password)));
check('le bon mot de passe est accepté', await verifyPassword(password, hash));
check('un mot de passe voisin est refusé', !(await verifyPassword(password + 'x', hash)));
check('un mot de passe vide est refusé', !(await verifyPassword('', hash)));
check('la casse compte', !(await verifyPassword(password.toUpperCase(), hash)));
check(
  'un mot de passe plus court est refusé',
  !(await verifyPassword(password.slice(0, MIN_PASSWORD_LENGTH - 1), hash))
);

console.log('\n2. Robustesse face à un hash corrompu\n');

check('hash vide → refus', !(await verifyPassword(password, '')));
check('hash non-scrypt → refus', !(await verifyPassword(password, 'bcrypt$xxxx')));
check('hash tronqué → refus', !(await verifyPassword(password, 'scrypt$N=16384,r=8,p=1$abc')));
check('hash null → refus', !(await verifyPassword(password, null)));
check(
  'paramètres absurdes (N gigantesque) → refus sans blocage',
  !(await verifyPassword(password, 'scrypt$N=99999999,r=8,p=1$YWJj$YWJj'))
);
check(
  'paramètres invalides (N négatif) → refus',
  !(await verifyPassword(password, 'scrypt$N=-1,r=8,p=1$YWJj$YWJj'))
);

console.log('\n3. Session (JWT signé)\n');

// Le secret est fourni avant l'import du module, qui le lit à l'appel.
process.env.ADMIN_SESSION_SECRET = Buffer.from(
  'secret-de-test-suffisamment-long-pour-32-octets'
).toString('base64');

const { createSessionToken, verifySessionToken, SESSION_COOKIE, readSessionCookie } =
  await import('../api/_lib/session.js');

const token = await createSessionToken();
console.log(`  jeton : ${token.slice(0, 34)}… (${token.split('.').length} segments)`);

check('le jeton a trois segments (JWT)', token.split('.').length === 3);

const payload = await verifySessionToken(token);
check('le jeton est vérifié', payload !== null);
check('le rôle est admin', payload?.role === 'admin');
check("l'émetteur est attendu", payload?.iss === 'portfolio-admin');
check("l'audience est attendue", payload?.aud === 'portfolio-admin-session');
check("l'expiration est dans le futur", payload?.exp > Math.floor(Date.now() / 1000));

// Falsification : on modifie la charge utile sans resigner.
const [header, , signature] = token.split('.');
const forgedPayload = Buffer.from(
  JSON.stringify({ role: 'admin', iss: 'portfolio-admin', aud: 'portfolio-admin-session' })
).toString('base64url');
const forged = `${header}.${forgedPayload}.${signature}`;
check('une charge utile falsifiée est rejetée', (await verifySessionToken(forged)) === null);

check('un jeton vide est rejeté', (await verifySessionToken('')) === null);
check('un jeton arbitraire est rejeté', (await verifySessionToken('nimporte.quoi.ici')) === null);
check('un jeton null est rejeté', (await verifySessionToken(null)) === null);

// Signature avec un autre secret : le cas le plus important, c'est celui qui
// se produirait si deux environnements partageaient des jetons.
const otherSecret = Buffer.from('un-autre-secret-de-32-octets-minimum-ok').toString('base64');
const { SignJWT } = await import('jose');
const foreignToken = await new SignJWT({ role: 'admin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuer('portfolio-admin')
  .setAudience('portfolio-admin-session')
  .setExpirationTime('1h')
  .sign(Buffer.from(otherSecret, 'base64'));
check(
  'un jeton signé avec un autre secret est rejeté',
  (await verifySessionToken(foreignToken)) === null
);

console.log('\n4. Lecture du cookie\n');

check(
  'le cookie est trouvé parmi d\'autres',
  readSessionCookie({ headers: { cookie: `autre=valeur; ${SESSION_COOKIE}=${token}; x=y` } }) === token
);
check('cookie absent → null', readSessionCookie({ headers: {} }) === null);
check(
  'en-tête cookie vide → null',
  readSessionCookie({ headers: { cookie: '' } }) === null
);

console.log('\n5. Estimation du temps de lecture\n');

const { estimateReadingMinutes, slugify } = await import('../api/_lib/posts-admin.js');

check('texte vide → 1 minute minimum', estimateReadingMinutes('') === 1);
check(
  '200 mots → 1 minute',
  estimateReadingMinutes(Array(200).fill('mot').join(' ')) === 1
);
check(
  '400 mots → 2 minutes',
  estimateReadingMinutes(Array(400).fill('mot').join(' ')) === 2
);
check(
  'les blocs de code ne sont pas comptés comme du texte',
  estimateReadingMinutes('```\n' + Array(400).fill('code').join(' ') + '\n```') === 1
);
check(
  'les accents sont translittérés, pas supprimés',
  slugify('Déclencheurs & Automatisation') === 'declencheurs-automatisation',
  slugify('Déclencheurs & Automatisation')
);
check('pas de tiret en début ni en fin', !slugify('  --Test--  ').startsWith('-'));

console.log('\n6. Thèmes : validation et normalisation\n');

const { validatePostInput } = await import('../api/_lib/posts-admin.js');
const { normalizeThemes, unknownThemes, THEME_SLUGS } = await import('../src/lib/themes.js');

const base = { title: 'Titre', content: 'Contenu' };
const themesDe = (entree) => validatePostInput({ ...base, theme_slugs: entree }).values.theme_slugs;
const erreursDe = (entree) => validatePostInput({ ...base, theme_slugs: entree }).errors;

// La liste est partagée entre l'éditeur et l'API : sa taille est un fait, pas
// une supposition. Si un thème est ajouté, ce test le signale — c'est voulu,
// pour que la décision soit consciente.
check('sept thèmes déclarés', THEME_SLUGS.length === 7, THEME_SLUGS.join(', '));
check(
  'les slugs sont en minuscules et sans accent',
  THEME_SLUGS.every((slug) => slug === slug.toLowerCase() && /^[a-z]+$/.test(slug)),
  THEME_SLUGS.join(', ')
);
// Un slug présent deux fois fausserait normalizeThemes, qui filtre sur la liste.
check('aucun slug en double', new Set(THEME_SLUGS).size === THEME_SLUGS.length);

check('un thème valide passe', JSON.stringify(themesDe(['ia'])) === '["ia"]');
check(
  'deux thèmes passent',
  JSON.stringify(themesDe(['ia', 'projets'])) === '["ia","projets"]'
);

// Le point le plus important de ce bloc : avant, n'importe quelle chaîne
// entrait en base et créait une catégorie fantôme, sans que rien ne le dise.
check('un thème inconnu est refusé', erreursDe(['quantique']).length === 1);
check(
  'un mélange valide + inconnu est refusé',
  erreursDe(['ia', 'blabla']).length === 1,
  erreursDe(['ia', 'blabla'])[0]
);
check(
  'le message nomme le thème fautif',
  erreursDe(['blabla'])[0]?.includes('blabla'),
  erreursDe(['blabla'])[0]
);

check('sans thème, la clé est absente', themesDe(undefined) === undefined);
check('une liste vide est acceptée', JSON.stringify(themesDe([])) === '[]');

// L'ordre suit la déclaration, pas la saisie : sans cela, deux notes portant
// les mêmes thèmes pourraient les afficher dans deux ordres différents.
check(
  "l'ordre suit la liste, pas la saisie",
  JSON.stringify(themesDe(['veille', 'ia'])) === '["ia","veille"]',
  JSON.stringify(themesDe(['veille', 'ia']))
);
check(
  'les doublons sont écartés',
  JSON.stringify(themesDe(['ia', 'ia', 'dev'])) === '["ia","dev"]'
);
check(
  'la casse est normalisée',
  JSON.stringify(themesDe(['IA'])) === '["ia"]'
);
check(
  "les espaces autour sont ignorés",
  JSON.stringify(themesDe([' ia '])) === '["ia"]'
);

// Rétrocompatibilité : la colonne a été une chaîne unique, une valeur seule
// peut donc encore arriver d'un client non mis à jour.
check('une chaîne unique est tolérée', JSON.stringify(themesDe('IA')) === '["ia"]');
check(
  'normalizeThemes accepte null',
  JSON.stringify(normalizeThemes(null)) === '[]'
);
check(
  'unknownThemes ne retient que les inconnus',
  JSON.stringify(unknownThemes(['ia', 'xyz', 'dev'])) === '["xyz"]',
  JSON.stringify(unknownThemes(['ia', 'xyz', 'dev']))
);

console.log(`\n${'─'.repeat(60)}`);
console.log(`${passed} réussi(s), ${failed} échoué(s)`);
console.log(`${'─'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
