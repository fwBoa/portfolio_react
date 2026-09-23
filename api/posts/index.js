/**
 * Articles — administration.
 *
 *   GET    /api/posts       liste (brouillons compris)
 *   POST   /api/posts       création
 *   PATCH  /api/posts?id=   mise à jour
 *   DELETE /api/posts?id=   suppression
 *
 * Une seule fonction pour les quatre opérations : sur Vercel, chaque fichier
 * est une fonction, et les multiplier multiplierait les démarrages à froid. La
 * méthode HTTP porte l'intention.
 *
 * Le contrôle de session est posé par `route({ auth: true })`, avant tout accès
 * aux données. C'est la seule protection : l'interface peut masquer ses
 * boutons, une requête forgée à la main ne s'en soucie pas.
 *
 * Aucun brouillon ne sort par une autre route : `/api/posts` est le seul point
 * d'entrée vers les articles non publiés, et il est fermé.
 */
import {
  listAll,
  getById,
  createPost,
  updatePost,
  deletePost,
  slugExists,
  validatePostInput,
} from '../_lib/posts-admin.js';
import { route, fail, parseBody, queryId } from '../_lib/handler.js';

export default route(
  async (req, res) => {
    const id = queryId(req);
    if (req.query?.id !== undefined && id === null) {
      return fail(res, 400, 'Identifiant invalide.');
    }

    if (req.method === 'GET') {
      if (!id) return res.status(200).json({ posts: await listAll() });
      const post = await getById(id);
      return post ? res.status(200).json({ post }) : fail(res, 404, 'Article introuvable.');
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      if (!body) return fail(res, 400, 'Corps de requête illisible.');

      // Le slug découle du titre s'il n'est pas fourni : l'auteur n'a pas à le
      // saisir à la main.
      const { errors, values } = validatePostInput(body);
      if (errors.length > 0) return res.status(400).json({ error: errors[0], errors });

      if (await slugExists(values.slug)) {
        return fail(res, 409, 'Ce lien permanent est déjà utilisé par un autre article.');
      }

      return res.status(201).json({ post: await createPost(values) });
    }

    if (req.method === 'PATCH') {
      if (!id) return fail(res, 400, 'Identifiant manquant.');

      const body = parseBody(req);
      if (!body) return fail(res, 400, 'Corps de requête illisible.');

      const existing = await getById(id);
      if (!existing) return fail(res, 404, 'Article introuvable.');

      const { errors, values } = validatePostInput(body, { partial: true });
      if (errors.length > 0) return res.status(400).json({ error: errors[0], errors });

      if (Object.keys(values).length === 0) {
        return fail(res, 400, 'Aucun champ à mettre à jour.');
      }

      if (values.slug && (await slugExists(values.slug, id))) {
        return fail(res, 409, 'Ce lien permanent est déjà utilisé par un autre article.');
      }

      // Un article publié ne peut pas redevenir brouillon : la contrainte de la
      // base exige qu'un brouillon n'ait ni date ni numéro. On refuse le retour
      // en arrière plutôt que de laisser une erreur de contrainte remonter.
      if (existing.status === 'published' && values.status === 'draft') {
        return fail(
          res,
          400,
          'Un article publié ne peut pas redevenir brouillon. Modifiez-le, il restera en ligne.'
        );
      }

      return res.status(200).json({ post: await updatePost(id, values) });
    }

    if (req.method === 'DELETE') {
      if (!id) return fail(res, 400, 'Identifiant manquant.');
      const removed = await deletePost(id);
      return removed
        ? res.status(200).json({ ok: true })
        : fail(res, 404, 'Article introuvable.');
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return fail(res, 405, 'Méthode non autorisée.');
  },
  { auth: true }
);
