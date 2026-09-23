/**
 * Réexports des fonctions d'appel à l'API, et des aides de saisie.
 *
 * L'éditeur a besoin de deux choses : appeler l'API (défini dans `api.js`) et
 * dériver un slug depuis un titre au fil de la frappe. La normalisation d'un
 * slug doit donner exactement le même résultat que celle appliquée par le
 * serveur — sinon le champ afficherait `mon-titre` et l'article serait
 * enregistré sous `mon-titre-2`, ou pire, dans un autre format.
 *
 * La fonction est donc dupliquée à l'identique plutôt que réimportée : le
 * module serveur (`api/_lib/posts-admin.js`) importe `pg`, ce qui n'a rien à
 * faire dans un bundle navigateur. La règle est de garder les deux
 * implémentations alignées, testées par `scripts/admin-test.mjs`.
 */
export {
  createPost,
  updatePost,
  deletePost,
  publishPost,
  getPost,
  listPosts,
  logout,
} from './api';

/**
 * Normalise un titre en lien permanent : minuscules, sans accent, séparateurs
 * simples, longueur bornée.
 *
 * NFD sépare les lettres de leurs diacritiques, que l'on retire ensuite :
 * « déclencheurs » devient « declencheurs » et non « dclencheurs ».
 */
export function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
