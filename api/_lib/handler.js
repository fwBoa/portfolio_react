/**
 * Plomberie commune aux routes d'API.
 *
 * Chaque route répétait les mêmes quatre gestes : interdire la mise en cache,
 * vérifier la session, limiter la méthode, capturer les erreurs. Un oubli dans
 * l'une d'elles est silencieux — une route sans contrôle de session reste
 * ouverte. Centraliser rend l'oubli impossible : on déclare ce qu'on veut, pas
 * ce qu'on fait.
 *
 * `route(handler, options)` renvoie un handler au format Vercel.
 */
import { isAuthenticated } from './session.js';

/** Réponse d'erreur homogène. */
export const fail = (res, status, message) => res.status(status).json({ error: message });

/**
 * @param {(req, res) => any} handler
 * @param {object} [options]
 * @param {boolean} [options.auth]   Exiger une session valide.
 * @param {string} [options.method]  Seule méthode acceptée.
 */
export const route = (handler, { auth = false, method } = {}) => async (req, res) => {
  // Aucune réponse d'administration ne doit être mise en cache.
  res.setHeader('Cache-Control', 'no-store');

  if (method && req.method !== method) {
    res.setHeader('Allow', method);
    return fail(res, 405, 'Méthode non autorisée.');
  }

  if (auth && !(await isAuthenticated(req))) {
    return fail(res, 401, 'Session expirée. Reconnectez-vous.');
  }

  try {
    return await handler(req, res);
  } catch (error) {
    // Journalisé côté serveur, jamais renvoyé au client : un message de base
    // de données peut révéler le schéma.
    console.error(`[api] ${req.method} ${req.url} — ${error.message}`);
    return fail(res, 500, 'Erreur serveur.');
  }
};

/** Corps de requête analysé, ou null s'il est illisible. */
export function parseBody(req) {
  try {
    if (req.body === undefined || req.body === null) return {};
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return null;
  }
}

/** Identifiant de requête validé, ou null. */
export function queryId(req) {
  if (req.query?.id === undefined) return null;
  const id = Number(req.query.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}
