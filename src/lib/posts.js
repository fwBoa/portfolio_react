/**
 * Accès aux articles depuis la base Neon.
 *
 * Sur Vercel, le driver recommandé est node-postgres avec attachDatabasePool :
 * la fonction réutilise un pool de connexions au lieu d'en ouvrir une par
 * requête, ce qui évite d'épuiser les connexions Postgres. La documentation
 * Neon précise que le driver serverless est réservé aux environnements edge
 * ou non-Node, ce qui n'est pas notre cas.
 *
 * Toutes les requêtes filtrent sur les articles publiés : les brouillons ne
 * quittent jamais la base par cette voie. Les fonctions admin (phase 4)
 * utiliseront leur propre module avec connexion directe.
 */
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const pooled = process.env.DATABASE_URL; // -pooler : c'est le bon pour le web

if (!pooled) {
  // Ne lève pas au chargement du module : le build doit pouvoir se terminer
  // même si la base n'est pas joignable, et l'accueil n'a pas besoin d'elle.
  console.warn('[posts] DATABASE_URL absente — les fonctions de lecture renverront des listes vides.');
}

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: pooled, max: 3 });
    attachDatabasePool(pool);
  }
  return pool;
}

/**
 * Liste les articles publiés, du plus récent au plus ancien.
 *
 * @param {object} [options]
 * @param {number} [options.limit]   Nombre maximal d'articles. Sans limite,
 *                                   renvoie tout — utilisé par la page archive.
 * @param {string} [options.theme]   Filtrer sur un thème.
 * @returns {Promise<Array<{slug,title,summary,theme,note_number,reading_minutes,published_at}>>}
 */
export async function listPublished({ limit, theme } = {}) {
  if (!pooled) return [];
  const conditions = ["status = 'published'"];
  const values = [];
  if (theme) {
    values.push(theme);
    conditions.push(`theme = $${values.length}`);
  }
  const where = conditions.join(' and ');
  // La limite est bornée par construction, jamais une chaîne externe : elle
  // n'entre donc pas dans les paramètres, qui restent réservés aux valeurs.
  const clause = limit ? `limit ${Math.max(0, Number(limit) | 0)}` : '';
  const { rows } = await getPool().query(
    `select slug, title, summary, theme, note_number, reading_minutes, published_at
     from posts
     where ${where}
     order by published_at desc
     ${clause}`,
    values
  );
  return rows;
}

/**
 * Retourne un article publié par son slug, avec son contenu.
 * Renvoie null si absent ou non publié : les brouillons ne sont pas adressables.
 *
 * @param {string} slug
 */
export async function getPublishedBySlug(slug) {
  if (!pooled || !slug) return null;
  const { rows } = await getPool().query(
    `select slug, title, summary, content, theme, note_number, reading_minutes,
            published_at, meta_title, meta_description, og_image
     from posts
     where slug = $1 and status = 'published'`,
    [slug]
  );
  return rows[0] ?? null;
}

/**
 * Récupère les articles voisins d'un article : le précédent et le suivant
 * dans l'ordre chronologique de publication (du plus récent au plus ancien).
 *
 * @param {string} slug
 * @returns {Promise<{previous: {slug,title,published_at}|null, next: {slug,title,published_at}|null}>}
 */
export async function getNeighbours(slug) {
  if (!pooled || !slug) return { previous: null, next: null };
  const pool = getPool();
  const previous = await pool.query(
    `select slug, title, published_at
     from posts
     where status = 'published'
       and published_at > (select published_at from posts where slug = $1)
     order by published_at asc
     limit 1`,
    [slug]
  );
  const next = await pool.query(
    `select slug, title, published_at
     from posts
     where status = 'published'
       and published_at < (select published_at from posts where slug = $1)
     order by published_at desc
     limit 1`,
    [slug]
  );
  return {
    previous: previous.rows[0] ?? null,
    next: next.rows[0] ?? null,
  };
}

/**
 * Ferme le pool de connexions.
 *
 * Utile aux scripts qui s'exécutent hors requête HTTP (build, pré-rendu) :
 * sans cet appel, le pool garde une connexion ouverte et le processus Node ne
 * se termine pas de lui-même. Le pré-rendu n'en a pas besoin — il tourne dans
 * un processus qui se ferme de toute façon — mais les scripts qui enchaînent
 * plusieurs étapes y gagnent un arrêt net.
 */
export async function closePool() {
  if (!pool) return;
  await pool.end();
  pool = null;
}