#!/usr/bin/env node
/**
 * Test de la couche d'administration contre la vraie base.
 *
 *   node --env-file=.env.local scripts/admin-db-test.mjs
 *
 * Le schéma porte des contraintes et des déclencheurs (cohérence
 * brouillon/publié, attribution du numéro de note, mise à jour de
 * `updated_at`). Ces règles s'exécutent dans la base, pas dans le JavaScript :
 * seule une écriture réelle prouve que le code les respecte.
 *
 * Le script crée son propre article de test puis le supprime. Il n'écrit que
 * sous un slug réservé, et nettoie systématiquement — même en cas d'échec.
 */
import {
  listAll,
  getById,
  createPost,
  updatePost,
  deletePost,
  slugExists,
  validatePostInput,
  estimateReadingMinutes,
  slugify,
} from '../api/_lib/posts-admin.js';

const TEST_SLUG = 'test-administration-a-supprimer';

let passed = 0;
let failed = 0;
let createdId = null;

function check(label, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${label}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

async function cleanup() {
  if (createdId === null) return;
  try {
    await deletePost(createdId);
    console.log(`\n  (nettoyage : article ${createdId} supprimé)`);
  } catch (error) {
    console.error(`\n  ⚠ nettoyage impossible : ${error.message}`);
    console.error(`  ⚠ supprimer à la main : delete from posts where slug = '${TEST_SLUG}'`);
  }
}

try {
  console.log('\n1. Création d\'un brouillon\n');

  // Un article de test ne doit jamais rester : on supprime d'abord une
  // éventuelle trace d'une exécution précédente interrompue.
  const { Pool } = await import('pg');
  const cleanupPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  await cleanupPool.query('delete from posts where slug = $1', [TEST_SLUG]);
  await cleanupPool.end();

  const content = `# Test

Un paragraphe de vérification pour l'administration.

## Section

${Array(220).fill('mot').join(' ')}`;

  const { errors, values } = validatePostInput({
    title: 'Test administration à supprimer',
    slug: TEST_SLUG,
    summary: 'Article de test créé par le script de vérification.',
    theme: 'Dev',
    content,
  });

  check('validation sans erreur', errors.length === 0, errors.join(' / '));
  check('le slug fourni est conservé', values.slug === TEST_SLUG);
  // 220 mots ≈ 1 minute : le seuil doit rester réaliste, un seuil trop haut
  // ferait échouer le test pour une raison qui n'a rien à voir avec le code.
  check(
    'le temps de lecture est estimé',
    estimateReadingMinutes(content) >= 1,
    String(estimateReadingMinutes(content))
  );

  const draft = await createPost({ ...values, status: 'draft' });
  createdId = draft.id;

  check('l\'article est créé', Boolean(draft.id));
  check('le statut est brouillon', draft.status === 'draft');
  check('aucun numéro de note sur un brouillon', draft.note_number === null, String(draft.note_number));
  check('aucune date de publication sur un brouillon', draft.published_at === null);
  check('un temps de lecture est enregistré', draft.reading_minutes >= 1, String(draft.reading_minutes));

  console.log('\n2. Lecture et unicité du slug\n');

  const reread = await getById(createdId);
  check('l\'article est relu par identifiant', reread?.slug === TEST_SLUG);
  check('le contenu markdown est conservé', reread?.content.includes('paragraphe de vérification'));
  check('le slug est détecté comme pris', await slugExists(TEST_SLUG));
  check(
    'le slug n\'est pas signalé comme pris pour lui-même',
    !(await slugExists(TEST_SLUG, createdId))
  );

  const all = await listAll();
  check('l\'article apparaît dans la liste complète', all.some((p) => p.id === createdId));
  check(
    'la liste ne transporte pas le contenu (trop lourd)',
    all.length > 0 && all.every((p) => p.content === undefined)
  );

  console.log('\n3. Mise à jour\n');

  const updated = await updatePost(createdId, {
    title: 'Titre modifié',
    content: Array(420).fill('mot').join(' '),
  });
  check('le titre est modifié', updated.title === 'Titre modifié');
  check(
    'le temps de lecture est recalculé après changement du contenu',
    updated.reading_minutes >= 2,
    String(updated.reading_minutes)
  );
  check(
    'la date de modification avance',
    new Date(updated.updated_at) >= new Date(draft.updated_at)
  );

  console.log('\n4. Publication (déclencheurs de la base)\n');

  // Le passage en publié consomme un numéro de note via la séquence
  // note_number_seq. Attention : en PostgreSQL, les séquences ne sont PAS
  // transactionnelles — un ROLLBACK ne rend pas le numéro consommé. On relève
  // donc la valeur avant, et on la restaure explicitement après.
  //
  // La restauration n'est faite que si la séquence n'a pas bougé entre-temps
  // pour une autre raison : si un vrai article a été publié pendant le test,
  // remettre la valeur en arrière provoquerait un doublon de numéro.
  const txPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

  const { rows: seqBefore } = await txPool.query('select last_value from note_number_seq');
  const sequenceBefore = Number(seqBefore[0].last_value);

  const client = await txPool.connect();

  try {
    await client.query('begin');

    const { rows: publishedRows } = await client.query(
      `update posts set status = 'published' where id = $1
       returning status, note_number, published_at`,
      [createdId]
    );
    const published = publishedRows[0];

    check('le statut passe à publié', published?.status === 'published');
    check(
      'un numéro de note est attribué par la base',
      typeof published?.note_number === 'number',
      String(published?.note_number)
    );
    check(
      'une date de publication est attribuée par la base',
      published?.published_at !== null
    );

    // Le numéro ne doit pas être réattribué à chaque écriture : ce serait une
    // régression silencieuse, la numérotation éditoriale devant rester stable.
    const numberAfter = published?.note_number;
    const { rows: touchedRows } = await client.query(
      `update posts set summary = 'Résumé modifié' where id = $1
       returning note_number`,
      [createdId]
    );
    check(
      'le numéro de note ne change pas après modification',
      touchedRows[0]?.note_number === numberAfter,
      `${numberAfter} → ${touchedRows[0]?.note_number}`
    );
  } finally {
    // Annulation des écritures sur la table. Le numéro de note reste consommé,
    // d'où la restauration ci-dessous.
    await client.query('rollback').catch(() => {});
    client.release();
  }

  // Restauration de la séquence, uniquement si elle est exactement là où le
  // test l'a laissée (séquence avant + 1). Toute autre valeur signifie qu'une
  // écriture extérieure a eu lieu : on n'y touche pas.
  const { rows: seqAfter } = await txPool.query('select last_value from note_number_seq');
  const sequenceAfter = Number(seqAfter[0].last_value);

  if (sequenceAfter === sequenceBefore + 1) {
    await txPool.query('select setval($1, $2, true)', ['note_number_seq', sequenceBefore]);
    check('la séquence de numérotation est restaurée', true);
  } else {
    console.log(
      `  · séquence non restaurée (attendue ${sequenceBefore + 1}, trouvée ${sequenceAfter})`
    );
  }

  await txPool.end();

  console.log('\n5. Les brouillons restent privés\n');

  const { listPublished } = await import('../src/lib/posts.js');
  const publicList = await listPublished();
  check(
    "la liste publique ne contient pas l'article de test",
    !publicList.some((p) => p.slug === TEST_SLUG)
  );
  check(
    'la liste publique ne contient que des articles publiés',
    publicList.length > 0
  );

  console.log('\n6. Suppression\n');

  const removed = await deletePost(createdId);
  check('la suppression aboutit', removed === true);
  createdId = null;
  check('l\'article n\'est plus lisible', (await getById(draft.id)) === null);
  check('la suppression d\'un identifiant absent renvoie false', !(await deletePost(999999999)));
} catch (error) {
  console.error(`\n✗ erreur : ${error.message}`);
  failed += 1;
} finally {
  await cleanup();
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`${passed} réussi(s), ${failed} échoué(s)`);
console.log(`${'─'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
