/**
 * Thèmes des notes — source unique de vérité.
 *
 * Ce fichier existe parce que la liste était en dur dans l'éditeur seulement :
 * `api/_lib/posts-admin.js` acceptait n'importe quelle chaîne. Rien n'empêchait
 * « ia », « IA » et « Intelligence Artificielle » d'entrer en base et de créer
 * trois catégories distinctes pour un même sujet — un défaut déjà présent, qui
 * n'attendait qu'une faute de frappe.
 *
 * La liste est donc partagée : l'éditeur s'en sert pour proposer les choix,
 * l'API pour refuser le reste, et le pré-rendu pour valider ce qu'il lit.
 *
 * Chaque thème porte un `slug` distinct du `label`. C'est ce qui permettra des
 * URL stables (`/blog/theme/ia`) sans que le libellé affiché soit figé dans une
 * adresse — renommer « IA » en « Intelligence artificielle » ne cassera alors
 * aucun lien. Le slug est donc une donnée, pas une transformation à la volée.
 *
 * `description` sert aux métadonnées des futures pages de thème.
 */

export const THEMES = [
  {
    slug: 'ia',
    label: 'IA',
    description:
      "Notes sur l'intelligence artificielle appliquée : modèles, agents, RAG et leurs limites en production.",
  },
  {
    slug: 'dev',
    label: 'Dev',
    description:
      'Notes de développement web : React, outillage, architecture et choix techniques.',
  },
  {
    slug: 'infra',
    label: 'Infra',
    description:
      "Notes d'infrastructure : déploiement, bases de données, performance et coût d'exploitation.",
  },
  {
    slug: 'projets',
    label: 'Projets',
    description: 'Constats tirés de projets réels, du cadrage à la mise en ligne.',
  },
  {
    slug: 'constats',
    label: 'Constats',
    description: "Ce qui s'est vérifié, ce qui a surpris, ce qui ne se reproduira pas.",
  },
  {
    slug: 'veille',
    label: 'Veille',
    description: "Suivi de ce qui bouge, sans prétendre à l'exhaustivité.",
  },
  {
    slug: 'carriere',
    label: 'Carrière',
    description:
      "Notes sur le parcours : alternance, freelance, entretiens et choix d'orientation.",
  },
];

/** Slugs valides, dans l'ordre de déclaration. */
export const THEME_SLUGS = THEMES.map((theme) => theme.slug);

/** Index slug → thème, pour retrouver un libellé ou une description. */
export const THEME_BY_SLUG = new Map(THEMES.map((theme) => [theme.slug, theme]));

/**
 * Normalise une liste de thèmes venant d'un formulaire ou de la base.
 *
 * Trois choses, dans cet ordre :
 * - accepte une chaîne unique ou un tableau (la valeur a été une chaîne
 *   unique : les clients existants et les données déjà en base continuent de
 *   fonctionner sans conversion préalable) ;
 * - ne garde que les slugs connus, en minuscules ;
 * - déduplique SANS réordonner selon l'entrée : le résultat suit toujours
 *   l'ordre de déclaration de THEMES, donc l'affichage est stable d'une note à
 *   l'autre, quel que soit l'ordre de saisie.
 *
 * @param {string|string[]|null|undefined} value
 * @returns {string[]} slugs valides, uniques, dans l'ordre de déclaration
 */
export function normalizeThemes(value) {
  if (value === null || value === undefined) return [];

  const demandes = (Array.isArray(value) ? value : [value])
    .map((item) => String(item ?? '').trim().toLowerCase())
    .filter(Boolean);

  if (demandes.length === 0) return [];

  const retenus = new Set(demandes);
  return THEME_SLUGS.filter((slug) => retenus.has(slug));
}

/**
 * Thèmes inconnus parmi ceux demandés — vide si tout est valide.
 *
 * Sert à REFUSER une écriture plutôt qu'à la nettoyer en silence : un thème
 * fautif vient presque toujours d'une faute de frappe ou d'un client
 * désynchronisé, et l'ignorer priverait l'auteur de l'information.
 *
 * @param {string|string[]|null|undefined} value
 * @returns {string[]}
 */
export function unknownThemes(value) {
  if (value === null || value === undefined) return [];

  return (Array.isArray(value) ? value : [value])
    .map((item) => String(item ?? '').trim().toLowerCase())
    .filter(Boolean)
    .filter((slug) => !THEME_SLUGS.includes(slug));
}

/** Libellés d'une liste de slugs, dans l'ordre de déclaration. */
export function themeLabels(value) {
  return normalizeThemes(value).map((slug) => THEME_BY_SLUG.get(slug).label);
}
