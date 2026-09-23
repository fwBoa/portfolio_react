/**
 * Publication — déclenche la reconstruction du site.
 *
 * POST /api/posts/publish?id=
 *
 * Pourquoi cette route existe
 * ---------------------------
 * Les articles sont figés en HTML au moment du build : c'est ce qui les rend
 * lisibles par les robots qui n'exécutent pas le JavaScript. Conséquence :
 * publier en base ne suffit pas, il faut relancer un build.
 *
 * Cette route appelle donc le Deploy Hook Vercel. Si `DEPLOY_HOOK_URL` n'est
 * pas configurée, elle le dit clairement plutôt que de laisser croire à une
 * publication réussie : l'article serait en base mais absent du site.
 */
import { getById, updatePost, slugExists } from '../_lib/posts-admin.js';
import { route, fail, queryId } from '../_lib/handler.js';

/**
 * Appelle le Deploy Hook, avec un délai borné : sans limite, la fonction
 * attendrait jusqu'au timeout de la plateforme et l'auteur resterait sans
 * réponse.
 */
async function triggerDeploy() {
  const url = process.env.DEPLOY_HOOK_URL;
  if (!url) return { triggered: false, reason: 'DEPLOY_HOOK_URL absente.' };

  try {
    const response = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(8000) });
    return response.ok
      ? { triggered: true }
      : { triggered: false, reason: `Le hook a répondu ${response.status}.` };
  } catch (error) {
    return { triggered: false, reason: error.message };
  }
}

export default route(
  async (req, res) => {
    const id = queryId(req);
    if (id === null) return fail(res, 400, 'Identifiant invalide.');

    const existing = await getById(id);
    if (!existing) return fail(res, 404, 'Article introuvable.');

    // Une note ne se publie pas à moitié : résumé et contenu alimentent la page
    // et les métadonnées.
    if (!existing.summary || !existing.content) {
      return fail(res, 400, 'Renseignez le résumé et le contenu avant de publier.');
    }

    if (await slugExists(existing.slug, id)) {
      return fail(res, 409, 'Le lien permanent de cet article est déjà utilisé.');
    }

    // Le passage en publié fait attribuer par la base le numéro de note et la
    // date de publication (déclencheur posts_note_number) : l'application n'a
    // pas à décider de ces valeurs. Une note déjà publiée n'est pas réécrite.
    const post =
      existing.status === 'published'
        ? existing
        : await updatePost(id, { status: 'published' });

    const deploy = await triggerDeploy();

    return res.status(200).json({
      post,
      deploy,
      // Message prêt à afficher : l'auteur n'a pas à interpréter des booléens.
      message: deploy.triggered
        ? 'Article publié. Le site se reconstruit, comptez une à deux minutes.'
        : `Article publié en base, mais le site n'a pas été relancé (${deploy.reason}) ` +
          'Il faut relancer un déploiement pour que la note apparaisse.',
    });
  },
  { auth: true, method: 'POST' }
);
