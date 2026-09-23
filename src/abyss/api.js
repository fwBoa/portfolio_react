/**
 * Appels à l'API d'administration.
 *
 * Point unique de passage vers le serveur, pour trois raisons :
 *
 * 1. `credentials: 'same-origin'` est nécessaire pour que le cookie de
 *    session soit envoyé. L'oublier sur un seul appel donnerait une erreur
 *    401 incompréhensible.
 * 2. Une session expirée doit ramener à l'écran de connexion sans que chaque
 *    appelant ait à y penser. C'est centralisé ici.
 * 3. Les erreurs serveur sont converties en `Error` avec un message lisible,
 *    afin que l'interface n'ait jamais à interpréter un statut HTTP.
 */

/**
 * Erreur portant le statut HTTP, pour distinguer les cas que l'interface
 * traite différemment (401 → reconnexion, 409 → conflit de slug, 400 → saisie).
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  });

  // Une réponse 204 n'a pas de corps : la lire ferait échouer le parse.
  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    // 401 : la session a expiré côté serveur. On prévient le reste de
    // l'application par un événement, pour qu'elle réaffiche la connexion.
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('admin:unauthorized'));
    }
    throw new ApiError(payload?.error ?? 'Erreur inattendue.', response.status);
  }

  return payload;
}

/** Session courante. `authenticated` est un booléen, jamais une erreur. */
export const getSession = () => request('/api/auth/session');

/** Connexion. Lève une ApiError si le mot de passe est refusé. */
export const login = (password) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });

/** Déconnexion. */
export const logout = () => request('/api/auth/logout', { method: 'POST' });

/** Liste de tous les articles, brouillons compris. */
export const listPosts = () => request('/api/posts');

/** Un article complet, contenu markdown inclus. */
export const getPost = (id) => request(`/api/posts?id=${encodeURIComponent(id)}`);

/** Crée un article. */
export const createPost = (values) =>
  request('/api/posts', { method: 'POST', body: JSON.stringify(values) });

/** Met à jour les champs fournis. */
export const updatePost = (id, values) =>
  request(`/api/posts?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });

/** Supprime un article. */
export const deletePost = (id) =>
  request(`/api/posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });

/** Publie un article et déclenche la reconstruction du site. */
export const publishPost = (id) =>
  request(`/api/posts/publish?id=${encodeURIComponent(id)}`, { method: 'POST' });
