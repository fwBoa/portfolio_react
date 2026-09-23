import { useState, useMemo } from 'react';
import { marked } from 'marked';
import {
  createPost,
  updatePost,
  publishPost,
  deletePost,
  slugify,
} from './api-helpers';

/**
 * Éditeur d'une note.
 *
 * Trois partis pris
 * -----------------
 * 1. Aperçu côte à côte plutôt qu'un onglet. Écrire du markdown sans voir le
 *    résultat oblige à alterner, ce qui casse le fil. L'aperçu est rendu avec
 *    le même moteur `marked` que le build, donc ce qui s'affiche ici est ce
 *    qui sera publié.
 *
 * 2. L'aperçu n'est PAS assaini ici. Il est injecté dans la page courante, et
 *    son contenu est celui de l'auteur lui-même : le risque est nul. L'étape
 *    qui compte est le build, où le HTML est assaini avant d'être figé — c'est
 *    là que le contenu quitte la confiance de l'auteur.
 *
 * 3. Le slug se dérive du titre tant qu'on n'y a pas touché à la main. Dès
 *    qu'il est modifié manuellement, il n'est plus écrasé : un slug se
 *    choisit, il ne doit pas changer sous les doigts de l'auteur.
 *
 * Une note publiée ne peut pas redevenir brouillon (contrainte de la base) :
 * le bouton correspondant est donc absent, et le serveur refuse de toute façon.
 */

const THEMES = ['IA', 'Dev', 'Projets', 'Constats', 'Veille'];

const fmtDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

const Editor = ({ post, onSaved, onCancel, onDeleted }) => {
  const isNew = !post?.id;

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [summary, setSummary] = useState(post?.summary ?? '');
  const [theme, setTheme] = useState(post?.theme ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? '');
  const [ogImage, setOgImage] = useState(post?.og_image ?? '');

  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [pending, setPending] = useState(false);

  const status = post?.status ?? 'draft';
  const isPublished = status === 'published';

  // Le slug suit le titre jusqu'à la première modification manuelle.
  const effectiveSlug = slugTouched ? slug : slugify(title);

  // Rendu de l'aperçu. Le calcul est refait à chaque frappe : sur un article
  // de quelques milliers de mots, `marked` reste négligeable, et le résultat
  // est toujours synchrone avec le champ.
  //
  // Le `# titre` en tête est rétrogradé en `##`, exactement comme le fait
  // scripts/prerender.mjs au build. Sans cela, l'aperçu montrerait deux titres
  // de niveau 1 et ne représenterait pas ce qui sera réellement publié — la
  // page publique n'a qu'un seul h1, le sien.
  const previewHtml = useMemo(() => {
    try {
      const source = (content || '').replace(/^\s*#\s+(.+)$/m, '## $1');
      return marked.parse(source || '_Rien à prévisualiser pour l\'instant._');
    } catch {
      return '<p>Aperçu indisponible.</p>';
    }
  }, [content]);

  /** Enregistre sans publier. */
  const save = async () => {
    setError(null);
    setNotice(null);
    setPending(true);

    const values = {
      title,
      slug: effectiveSlug,
      summary,
      theme: theme || null,
      content,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image: ogImage || null,
    };

    try {
      const saved = isNew
        ? await createPost(values)
        : await updatePost(post.id, values);
      setNotice(isNew ? 'Note créée.' : 'Modifications enregistrées.');
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  /** Enregistre puis publie, en déclenchant la reconstruction du site. */
  const publish = async () => {
    setError(null);
    setNotice(null);
    setPending(true);

    try {
      // On enregistre d'abord : publier une version antérieure à ce qui est
      // affiché serait déroutant.
      const values = {
        title,
        slug: effectiveSlug,
        summary,
        theme: theme || null,
        content,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        og_image: ogImage || null,
      };

      const saved = isNew ? await createPost(values) : await updatePost(post.id, values);

      if (!saved.summary || !saved.content) {
        setError('Renseignez le résumé et le contenu avant de publier.');
        onSaved(saved);
        return;
      }

      const result = await publishPost(saved.id);
      setNotice(result.message);
      onSaved(result.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    if (!post?.id) return;
    // Suppression définitive : elle mérite une confirmation explicite.
    const confirmed = window.confirm(
      `Supprimer « ${post.title} » définitivement ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    setError(null);
    setPending(true);
    try {
      await deletePost(post.id);
      onDeleted();
    } catch (err) {
      setError(err.message);
      setPending(false);
    }
  };

  const fieldClass =
    'w-full px-4 py-2.5 bg-white border border-os-border rounded-lg text-os-text text-sm outline-none focus:border-os-text transition-colors duration-300 disabled:opacity-50';

  return (
    <div className="min-h-screen bg-os-bg text-os-text">
      {/* Barre d'action — reste visible en haut pendant l'édition */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-os-border">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center gap-3">
          <button
            onClick={onCancel}
            className="text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted hover:text-os-text transition-colors duration-300"
          >
            ← Retour
          </button>

          <span className="flex-1 text-xs text-os-muted truncate">
            {isPublished ? (
              <>Publiée le {fmtDate(post.published_at)}</>
            ) : (
              'Brouillon — invisible sur le site'
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={remove}
              disabled={pending}
              className="px-3 py-2 text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted hover:text-red-700 transition-colors duration-300 disabled:opacity-40"
            >
              Supprimer
            </button>
            <button
              onClick={save}
              disabled={pending || !title || !content}
              className="px-4 py-2 border border-os-border rounded-lg text-[11px] uppercase tracking-[0.15em] font-medium text-os-text hover:border-os-text transition-colors duration-300 disabled:opacity-40"
            >
              {pending ? '…' : 'Enregistrer'}
            </button>
            {!isPublished && (
              <button
                onClick={publish}
                disabled={pending || !title || !content || !summary}
                className="px-4 py-2 bg-os-text text-white rounded-lg text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-os-reading transition-colors duration-300 disabled:opacity-40"
              >
                Publier
              </button>
            )}
          </div>
        </div>

        {error && (
          <div role="alert" className="max-w-[1600px] mx-auto px-5 sm:px-8 pb-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {notice && (
          <div role="status" className="max-w-[1600px] mx-auto px-5 sm:px-8 pb-3">
            <p className="text-sm text-os-body">{notice}</p>
          </div>
        )}
      </header>

      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---------------- Colonne de saisie ---------------- */}
        <div className="space-y-6">
          <div>
            <label htmlFor="f-title" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
              Titre
            </label>
            <input
              id="f-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ce que j'ai compris du RAG en production"
              className={`${fieldClass} text-base`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-slug" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
                Lien permanent
              </label>
              <input
                id="f-slug"
                value={effectiveSlug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                placeholder="derive-du-titre"
                className={`${fieldClass} text-xs`}
              />
              <p className="mt-1.5 text-[11px] text-os-muted truncate">
                zamblezie.fr/blog/{effectiveSlug || '…'}
              </p>
            </div>

            <div>
              <label htmlFor="f-theme" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
                Thème
              </label>
              <select
                id="f-theme"
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className={fieldClass}
              >
                <option value="">Aucun</option>
                {THEMES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="f-summary" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
              Résumé — affiché dans la liste et sous le titre
            </label>
            <textarea
              id="f-summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              placeholder="Une ou deux phrases qui disent de quoi parle la note."
              className={`${fieldClass} resize-y leading-relaxed`}
            />
          </div>

          <div>
            <label htmlFor="f-content" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
              Contenu — markdown
            </label>
            <textarea
              id="f-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={26}
              placeholder={'## Une section\n\nUn paragraphe.\n\n- un point\n- un autre\n\n`du code en ligne`\n\n```js\nconsole.log("bloc de code");\n```'}
              className={`${fieldClass} font-mono text-[13px] leading-relaxed resize-y`}
            />
          </div>

          <details className="border border-os-border rounded-lg">
            <summary className="px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted cursor-pointer hover:text-os-text transition-colors duration-300">
              Référencement (facultatif)
            </summary>
            <div className="px-4 pb-4 space-y-4">
              <div>
                <label htmlFor="f-meta-title" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
                  Titre dans les résultats — {metaTitle.length}/70
                </label>
                <input
                  id="f-meta-title"
                  value={metaTitle}
                  onChange={(event) => setMetaTitle(event.target.value)}
                  placeholder={title || 'Par défaut, le titre de la note'}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="f-meta-desc" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
                  Description dans les résultats — {metaDescription.length}/200
                </label>
                <textarea
                  id="f-meta-desc"
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  rows={3}
                  placeholder={summary || 'Par défaut, le résumé'}
                  className={`${fieldClass} resize-y`}
                />
              </div>
              <div>
                <label htmlFor="f-og-image" className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-2">
                  Image de partage — URL complète
                </label>
                <input
                  id="f-og-image"
                  value={ogImage}
                  onChange={(event) => setOgImage(event.target.value)}
                  placeholder="https://zamblezie.fr/og-image.png"
                  className={fieldClass}
                />
                <p className="mt-1.5 text-[11px] text-os-muted leading-relaxed">
                  Format attendu : 1200 × 630. Laissée vide, l'image du site est
                  utilisée — ce qui convient à la plupart des notes.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* ---------------- Colonne d'aperçu ---------------- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted mb-4">
            Aperçu
          </span>
          {/* L'aperçu reprend la typographie de lecture de la page publique
              (.article-body) : ce qu'on voit ici est ce qui sera publié. */}
          <div className="border border-os-border rounded-lg p-6 sm:p-8 bg-white max-h-[70vh] overflow-y-auto">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight leading-tight mb-4">
              {title || 'Sans titre'}
            </h1>
            {summary && (
              <p className="text-base leading-relaxed text-os-body border-l-2 border-os-text pl-4 mb-8">
                {summary}
              </p>
            )}
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
