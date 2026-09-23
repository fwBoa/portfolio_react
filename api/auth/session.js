/**
 * État de la session courante.
 *
 * GET /api/auth/session → { authenticated: boolean }
 *
 * Cette route ne refuse rien : elle permet à l'interface de savoir quoi
 * afficher. La protection réelle est portée par chaque route de données, qui
 * vérifie la session pour son propre compte — se reposer sur cette route pour
 * la sécurité serait une erreur.
 */
import { isAuthenticated } from '../_lib/session.js';
import { route } from '../_lib/handler.js';

export default route(
  async (req, res) => res.status(200).json({ authenticated: await isAuthenticated(req) }),
  { method: 'GET' }
);
