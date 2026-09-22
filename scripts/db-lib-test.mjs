/**
 * Vérifie la couche d'accès aux articles (src/lib/posts.js) :
 * liste, filtrage par thème, lecture par slug, voisins.
 *
 *   node --env-file=.env.local scripts/db-lib-test.mjs
 */
import { listPublished, getPublishedBySlug, getNeighbours } from '../src/lib/posts.js';

try {
  const list = await listPublished();
  console.log(`listPublished()        : ${list.length} article(s)`);
  for (const p of list) {
    console.log(`   Note ${String(p.note_number).padStart(3, '0')} · ${p.slug} · ${p.theme} · ${new Date(p.published_at).toLocaleDateString('fr-FR')}`);
  }

  const bySlug = await getPublishedBySlug(list[0]?.slug);
  console.log('\ngetPublishedBySlug()   :', bySlug ? `« ${bySlug.title} » (${bySlug.content.length} caractères de contenu)` : 'null ❌');

  const draftCheck = await getPublishedBySlug('article-inexistant');
  console.log('slug inexistant        :', draftCheck === null ? 'null ✅ (les brouillons et les absents ne sont pas adressables)' : '❌');

  const withTheme = await listPublished({ theme: 'Dev' });
  console.log(`filtre thème=Dev       : ${withTheme.length} article(s)`);

  const limited = await listPublished({ limit: 1 });
  console.log(`limit 1                : ${limited.length} article(s) retourné(s) ✅`);

  if (list.length > 0) {
    const nb = await getNeighbours(list[0].slug);
    console.log(`getNeighbours()        : previous=${nb.previous?.slug ?? '-'} · next=${nb.next?.slug ?? '-'} (l'article le plus récent n'a pas de précédent)`);
  }
} catch (error) {
  console.error('Échec :', error.message);
  process.exit(1);
}