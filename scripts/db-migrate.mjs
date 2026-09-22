/**
 * Applique le schéma du blog sur la base Neon.
 *
 * Lit src/lib/schema.sql et l'exécute intégralement. Le fichier est écrit pour
 * être idempotent (create if not exists, drop if exists) : le relancer ne casse
 * rien et ne duplique rien.
 *
 * La migration utilise la connexion DIRECTE (DATABASE_URL_UNPOOLED), comme le
 * recommande la documentation Neon pour les opérations de schéma : elles
 * peuvent utiliser des instructions et un état de session que le pooler ne
 * garantit pas.
 *
 *   node --env-file=.env.local scripts/db-migrate.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = join(root, 'src', 'lib', 'schema.sql');

// Migration : connexion directe, pas le pooler.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL absente — lancez avec --env-file=.env.local');
  process.exit(1);
}

const sql = readFileSync(schemaPath, 'utf8');

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log('Connecté. Application du schéma…');

  await client.query(sql);

  // Vérification : lister ce qui existe maintenant
  const { rows } = await client.query(`
    select
      (select count(*)::int from information_schema.tables
        where table_schema = 'public' and table_name = 'posts') as table_ok,
      (select count(*)::int from pg_proc
        where proname in ('set_updated_at', 'assign_note_number')) as fonctions,
      (select count(*)::int from pg_trigger
        where tgrelid = 'posts'::regclass and not tgisinternal) as triggers,
      (select count(*)::int from pg_indexes
        where tablename = 'posts') as index
  `);

  const r = rows[0];
  console.log('  table posts          :', r.table_ok === 1 ? 'créée' : '❌ manquante');
  console.log('  fonctions            :', r.fonctions === 2 ? '2/2' : `❌ ${r.fonctions}/2`);
  console.log('  triggers             :', r.triggers === 2 ? '2/2' : `❌ ${r.triggers}/2`);
  console.log('  index                :', r.index);

  // Rapport final sur la structure de la table
  const cols = await client.query(`
    select column_name, data_type, is_nullable
    from information_schema.columns
    where table_schema = 'public' and table_name = 'posts'
    order by ordinal_position
  `);
  console.log('\nColonnes de posts :');
  for (const c of cols.rows) {
    console.log(`  ${c.column_name.padEnd(18)} ${c.data_type.padEnd(12)} ${c.is_nullable === 'YES' ? 'nullable' : 'not null'}`);
  }

  console.log('\nSchéma appliqué avec succès.');
} catch (error) {
  console.error('Échec de la migration :', error.message);
  process.exit(1);
} finally {
  await client.end();
}