/**
 * Test de connexion à la base Neon.
 *
 * Vérifie que les identifiants récupérés depuis .env.local fonctionnent
 * réellement, et affiche la version du serveur ainsi que les droits du rôle.
 *
 * Script ponctuel, à lancer avec :
 *   node --env-file=.env.local scripts/db-check.mjs
 */
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL absente — lancez avec --env-file=.env.local');
  process.exit(1);
}

const sql = neon(url);

try {
  const version = await sql`select version() as v`;
  const current = await sql`select current_database() as db, current_user as usr`;
  const tables = await sql`
    select count(*)::int as n
    from information_schema.tables
    where table_schema = 'public'
  `;

  console.log('Connexion établie.');
  console.log('  base      :', current[0].db);
  console.log('  rôle      :', current[0].usr);
  console.log('  tables    :', tables[0].n, 'dans le schéma public');
  console.log('  serveur   :', version[0].v.split(',')[0]);
} catch (error) {
  console.error('Échec de connexion :', error.message);
  process.exit(1);
}
