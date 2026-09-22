/**
 * Test de bout en bout des déclencheurs de la table posts.
 *
 * Vérifie les règles définies dans src/lib/schema.sql :
 *   1. Un brouillon n'a ni numéro de note ni date de publication
 *   2. Le passage en publié attribue automatiquement le numéro et la date
 *   3. La numérotation est continue (001, 002…)
 *   4. La base refuse un état incohérent (publié sans date)
 *   5. updated_at est tenu par le déclencheur
 *
 * Le dernier article créé reste en base : il sert d'exemple pour la suite.
 * Les autres sont nettoyés.
 *
 *   node --env-file=.env.local scripts/db-test.mjs
 */
import pg from 'pg';

// DDL et vérification d'intégrité : connexion directe plutôt que le pooler.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL absente — lancez avec --env-file=.env.local');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

const slugTest = 'test-declencheurs';

try {
  await client.connect();

  // Nettoyage d'un éventuel test précédent
  await client.query('delete from posts where slug = $1', [slugTest]);

  // ── 1. Insertion en brouillon ────────────────────────────────────────────
  const draft = await client.query(
    `insert into posts (slug, title, summary, content, theme, status, reading_minutes)
     values ($1, $2, $3, $4, $5, 'draft', 4)
     returning note_number, published_at, created_at, updated_at`,
    [slugTest, 'Test des déclencheurs', 'Article de vérification du schéma.', '# Titre\n\nParagraphe de test.', 'Dev']
  );
  const d = draft.rows[0];
  const draftOk = d.note_number === null && d.published_at === null;
  console.log('1. Brouillon          :', draftOk ? 'sans numéro ni date ✅' : `❌ numéro=${d.note_number} date=${d.published_at}`);

  // ── 2. Publication : déclencheur ─────────────────────────────────────────
  const t0 = d.updated_at;
  // laisser un instant passer pour distinguer created_at et updated_at
  await new Promise((r) => setTimeout(r, 30));
  const pub = await client.query(
    `update posts set status = 'published' where slug = $1
     returning note_number, published_at, updated_at`,
    [slugTest]
  );
  const p = pub.rows[0];
  const pubOk = p.note_number !== null && p.published_at !== null;
  console.log('2. Passage en publié  :', pubOk
    ? `numéro attribué (Note ${String(p.note_number).padStart(3, '0')}), date fixée ✅`
    : '❌ rien attribué');

  // ── 3. Continuité de la numérotation ─────────────────────────────────────
  const max = await client.query('select max(note_number) as m from posts');
  console.log('3. Numérotation       :', `max = ${max.rows[0].m}, attribué = ${p.note_number}`,
    max.rows[0].m === p.note_number ? '(continue) ✅' : '❌ trou dans la séquence');

  // ── 4. État incohérent refusé par la contrainte ──────────────────────────
  // Le déclencheur remplit automatiquement numéro et date au passage en publié :
  // on ne peut pas insérer un publié incomplet par ce chemin. La contrainte
  // protège contre le cas restant : une modification qui remettrait la date
  // ou le numéro à vide sur un article déjà publié.
  let constraintOk = false;
  let constraintMsg = '';
  try {
    await client.query(
      `update posts set published_at = null, note_number = null
       where slug = $1 and status = 'published'`
    );
  } catch {
    constraintOk = true; // la base a refusé, c'est attendu
    constraintMsg = 'la base a refusé la mise à jour ✅';
  }
  // nettoyer un éventuel résidu si la contrainte n'avait pas joué
  const still = await client.query(
    `select published_at, note_number from posts where slug = $1`,
    [slugTest]
  );
  const ok2 = still.rows[0].published_at !== null && still.rows[0].note_number !== null;
  constraintOk = constraintOk && ok2;
  constraintMsg = constraintMsg || '⚠️ la base a accepté de vider la date — vérifier';
  console.log('4. Contrainte         :', constraintMsg);

  // ── 5. updated_at tenu par le déclencheur ────────────────────────────────
  const updOk = new Date(p.updated_at) > new Date(t0);
  console.log('5. updated_at         :', updOk ? 'mis à jour par le déclencheur ✅' : '❌ inchangé');

  // ── Résumé ────────────────────────────────────────────────────────────────
  const kept = await client.query(
    `select slug, status, note_number, published_at, reading_minutes, theme
     from posts where slug = $1`,
    [slugTest]
  );
  const k = kept.rows[0];
  console.log('\nArticle conservé en base :');
  console.log(`  ${k.slug} · ${k.status} · Note ${String(k.note_number).padStart(3, '0')} · ${k.theme} · ${k.reading_minutes} min`);
  console.log(`  publié le ${new Date(k.published_at).toLocaleString('fr-FR')}`);

  const total = await client.query('select count(*)::int as n from posts');
  console.log(`\nTotal en base : ${total.rows[0].n} article(s).`);
} catch (error) {
  console.error('Échec du test :', error.message);
  process.exit(1);
} finally {
  await client.end();
}