/**
 * Accès aux articles pour l'administration : lecture, création, mise à jour,
 * suppression.
 *
 * Ce module vit sous `api/` et non sous `src/lib/` pour une raison précise :
 * `src/lib/posts.js` est importé par le pré-rendu et ne connaît que les
 * articles publiés. Ici, les brouillons sont visibles — c'est le point de vue
 * de l'auteur, pas celui du public. Garder les deux séparés évite qu'une
 * requête publique hérite par erreur de la portée élargie.
 *
 * Connexion : `DATABASE_URL` (pooled) convient aux écritures ponctuelles d'un
 * back-office. La connexion directe est réservée aux migrations, qui prennent
 * des verrous et n'aiment pas passer par un pooler.
 */
import { Pool } from 'pg';

let pool = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL absente.');
    }
    // max 2 : un back-office à un seul utilisateur n'a pas besoin de plus, et
    // chaque instance serverless ouvre son propre pool.
    pool = new Pool({ connectionString, max: 2 });
  }
  return pool;
}

/** Colonnes renvoyées par les listes — le contenu complet est exclu, il est lourd. */
const LIST_COLUMNS = `
  id, slug, title, summary, theme, status, note_number,
  reading_minutes, published_at, created_at, updated_at,
  meta_title, meta_description, og_image
`;

/**
 * Tous les articles, brouillons compris, du plus récent au plus ancien.
 * Tri par date de dernière modification : c'est l'ordre utile pour travailler,
 * un brouillon qu'on vient d'éditer remonte en tête.
 */
export async function listAll() {
  const { rows } = await getPool().query(
    `select ${LIST_COLUMNS}
     from posts
     order by coalesce(updated_at, created_at) desc`
  );
  return rows;
}

/** Un article par son identifiant, contenu markdown inclus. */
export async function getById(id) {
  const { rows } = await getPool().query(
    `select ${LIST_COLUMNS}, content
     from posts
     where id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Vérifie si un slug est déjà pris, en excluant éventuellement un article.
 *
 * L'unicité est garantie par la base (contrainte `unique`) : ce test sert à
 * renvoyer un message clair plutôt qu'une erreur de contrainte, pas à
 * remplacer la garantie.
 */
export async function slugExists(slug, excludeId = null) {
  const { rows } = await getPool().query(
    `select 1 from posts where slug = $1 and ($2::bigint is null or id <> $2) limit 1`,
    [slug, excludeId]
  );
  return rows.length > 0;
}

/**
 * Estime le temps de lecture en minutes.
 *
 * 200 mots par minute est la vitesse de lecture silencieuse couramment
 * retenue pour un texte technique en français. Le résultat n'est jamais
 * inférieur à 1 : « 0 min de lecture » n'a pas de sens.
 *
 * Le markdown est dégraissé avant comptage — sans cela, les liens, les
 * balises de code et les symboles de mise en forme gonflent le total.
 */
export function estimateReadingMinutes(markdown) {
  const plain = (markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')      // blocs de code
    .replace(/`[^`]*`/g, ' ')             // code en ligne
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // liens et images → leur texte
    .replace(/[#>*_~-]+/g, ' ')           // symboles de mise en forme
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return 1;
  const words = plain.split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Normalise un slug : minuscules, sans accent, séparateurs simples.
 *
 * Un slug doit rester une URL lisible et stable. Les accents sont translittérés
 * plutôt que supprimés, sinon « déclencheurs » deviendrait « dclencheurs ».
 */
export function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // diacritiques
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Champs qu'un client peut fournir, avec leur validation. */
export function validatePostInput(input, { partial = false } = {}) {
  const errors = [];
  const clean = {};

  const required = (field) => !partial && (input[field] === undefined || input[field] === '');

  if (required('title')) errors.push('Le titre est obligatoire.');
  else if (input.title !== undefined) {
    const title = String(input.title).trim();
    if (title.length === 0) errors.push('Le titre est obligatoire.');
    else if (title.length > 200) errors.push('Le titre ne doit pas dépasser 200 caractères.');
    else clean.title = title;
  }

  if (required('content')) errors.push('Le contenu est obligatoire.');
  else if (input.content !== undefined) {
    const content = String(input.content);
    if (content.trim().length === 0) errors.push('Le contenu est obligatoire.');
    else clean.content = content;
  }

  // Le slug est facultatif : s'il est absent, il est dérivé du titre par
  // l'appelant. S'il est fourni, il est normalisé et doit rester valide.
  if (input.slug !== undefined && input.slug !== null) {
    const slug = slugify(input.slug);
    if (slug.length === 0) errors.push('Le lien permanent (slug) est invalide.');
    else clean.slug = slug;
  }

  for (const field of ['summary', 'theme', 'meta_title', 'meta_description', 'og_image']) {
    if (input[field] !== undefined) {
      const value = input[field] === null ? null : String(input[field]).trim();
      clean[field] = value === '' ? null : value;
    }
  }

  if (input.status !== undefined) {
    if (!['draft', 'published'].includes(input.status)) {
      errors.push('Statut inconnu.');
    } else {
      clean.status = input.status;
    }
  }

  // Les limites des métadonnées de référencement : au-delà, les moteurs
  // tronquent. Autant le signaler à l'écriture plutôt qu'après indexation.
  if (clean.meta_title && clean.meta_title.length > 70) {
    errors.push('Le titre de référencement ne doit pas dépasser 70 caractères.');
  }
  if (clean.meta_description && clean.meta_description.length > 200) {
    errors.push('La description de référencement ne doit pas dépasser 200 caractères.');
  }

  return { errors, values: clean };
}

/** Crée un article. Renvoie la ligne créée. */
export async function createPost(values) {
  const slug = values.slug ?? slugify(values.title);
  const readingMinutes = values.reading_minutes ?? estimateReadingMinutes(values.content);

  const { rows } = await getPool().query(
    `insert into posts (slug, title, summary, content, theme, status,
                        reading_minutes, meta_title, meta_description, og_image)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning ${LIST_COLUMNS}`,
    [
      slug,
      values.title,
      values.summary ?? null,
      values.content,
      values.theme ?? null,
      values.status ?? 'draft',
      readingMinutes,
      values.meta_title ?? null,
      values.meta_description ?? null,
      values.og_image ?? null,
    ]
  );
  return rows[0];
}

/**
 * Met à jour un article.
 *
 * Le temps de lecture est recalculé dès que le contenu change : le laisser
 * figé donnerait une estimation fausse après réécriture.
 */
export async function updatePost(id, values) {
  const sets = [];
  const params = [];

  const push = (column, value) => {
    params.push(value);
    sets.push(`${column} = $${params.length}`);
  };

  for (const [key, value] of Object.entries(values)) {
    if (key === 'reading_minutes') continue; // toujours dérivé du contenu
    push(key, value);
  }

  if (values.content !== undefined) {
    push('reading_minutes', estimateReadingMinutes(values.content));
  }

  if (sets.length === 0) return getById(id);

  params.push(id);
  const { rows } = await getPool().query(
    `update posts set ${sets.join(', ')}
     where id = $${params.length}
     returning ${LIST_COLUMNS}`,
    params
  );
  return rows[0] ?? null;
}

/** Supprime un article. Renvoie true si une ligne a été supprimée. */
export async function deletePost(id) {
  const { rowCount } = await getPool().query('delete from posts where id = $1', [id]);
  return rowCount > 0;
}
