/**
 * Inspecte les contraintes et déclencheurs réellement présents sur la table
 * posts, pour diagnostiquer un comportement inattendu.
 *
 *   node --env-file=.env.local scripts/db-inspect.mjs
 */
import pg from 'pg';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL absente — lancez avec --env-file=.env.local');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const constraints = await client.query(`
    select conname, pg_get_constraintdef(oid) as def
    from pg_constraint
    where conrelid = 'posts'::regclass
    order by conname
  `);
  console.log('Contraintes de posts :');
  for (const r of constraints.rows) console.log(`  • ${r.conname}\n    ${r.def}\n`);

  const triggers = await client.query(`
    select tgname, pg_get_triggerdef(oid) as def
    from pg_trigger
    where tgrelid = 'posts'::regclass and not tgisinternal
    order by tgname
  `);
  console.log('Déclencheurs de posts :');
  for (const r of triggers.rows) console.log(`  • ${r.tgname}\n    ${r.def}\n`);
} catch (error) {
  console.error('Échec :', error.message);
  process.exit(1);
} finally {
  await client.end();
}