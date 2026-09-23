import Layout from '../components/layout/Layout';
import ShareNote from '../components/blog/ShareNote';

/**
 * Rendu d'une note.
 *
 * Le corps est du markdown déjà converti et assaini au build (cf.
 * scripts/prerender.mjs) : dangerouslySetInnerHTML est sûr ici par
 * construction, et le HTML reçu est exactement celui qui a été figé dans la
 * page. Les styles viennent de .article-body (global.css) — typographie de
 * lecture longue, distincte des styles d'interface.
 *
 * La page passe par le Layout partagé : en-tête, pied de page et mentions
 * légales sont ceux de tout le site.
 *
 * Les entrées utilisent l'animation CSS `.note-enter` plutôt que Framer
 * Motion. Ce n'est pas un détail de style : Framer écrit `opacity: 0` dans le
 * HTML figé au build, et le contenu ne réapparaît que si le JavaScript
 * s'exécute. Une note dont le titre et le corps resteraient invisibles pour un
 * lecteur sans JS — ou pour un robot qui n'exécute pas les scripts — manquerait
 * exactement son objectif.
 */

const fmtDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const Article = ({ post, neighbours }) => {
  const previous = neighbours?.previous ?? null;
  const next = neighbours?.next ?? null;

  return (
    <Layout activeSection="notes">
      <main id="main" className="flex-1 bg-os-bg text-os-text pt-20 overflow-x-hidden">
        <article className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 py-16 sm:py-24">
        {/* 1. Barre de retour */}
        <div className="note-enter mb-14 sm:mb-16">
          {/* `py-1.5` porte la cible à ~25px : le libellé en text-[11px] ne
              fait que 13px de haut, sous le minimum de 24px (WCAG 2.2). */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 py-1.5 text-[11px] uppercase tracking-[0.15em] font-medium text-os-body hover:text-os-text transition-colors duration-300"
          >
            ← Toutes les notes
          </a>
        </div>

        <div className="max-w-[68ch] mx-auto">
          {/* 2. En-tête de la note */}
          <header className="note-enter mb-12 sm:mb-16" style={{ animationDelay: '0.08s' }}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-8">
              <time
                dateTime={new Date(post.published_at).toISOString()}
                className="text-[11px] uppercase tracking-[0.15em] text-os-body font-medium"
              >
                {fmtDate(post.published_at)}
              </time>
              {post.theme && (
                <span className="text-[11px] uppercase tracking-[0.15em] text-os-body font-medium">
                  {post.theme}
                </span>
              )}
              {post.reading_minutes && (
                <span className="text-[11px] text-os-body ml-auto">
                  {post.reading_minutes} min de lecture
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-[-0.03em] leading-[1.08] mb-8">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-lg sm:text-xl lg:text-2xl leading-[1.6] text-os-body font-light border-l-2 border-os-text pl-5 sm:pl-6">
                {post.summary}
              </p>
            )}
          </header>

          {/* 4. Corps — la lecture longue, sans métaphore ni décoration.
              Pas d'animation d'entrée ici, contrairement au reste de la page :
              le corps est figé en HTML avec `opacity: 0` par Framer Motion, et
              il ne redevient visible que si le JavaScript s'exécute. Un lecteur
              sans JS verrait un article vide. Le texte est ce qui doit rester
              accessible dans tous les cas — il s'affiche donc d'emblée. */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>

        {/* 5. Partage — placé à la fin de la lecture, là où l'intention de
            transmettre apparaît. */}
        <div className="max-w-[68ch] mx-auto mt-16">
          <ShareNote post={post} />
        </div>

        {/* 6. Pied — navigation entre notes */}
        <nav
          aria-label="Navigation entre notes"
          className="max-w-[68ch] mx-auto mt-12 pt-10 border-t border-os-border grid grid-cols-1 sm:grid-cols-2 gap-8"
        >
          <div>
            {previous && (
              <a href={`/blog/${previous.slug}`} className="group block">
                <span className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-body mb-2">
                  Note précédente
                </span>
                <span className="text-lg font-display font-bold text-os-text group-hover:text-os-body transition-colors duration-300">
                  {previous.title}
                </span>
              </a>
            )}
          </div>
          <div className="sm:text-right">
            {next && (
              <a href={`/blog/${next.slug}`} className="group block">
                <span className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-body mb-2">
                  Note suivante
                </span>
                <span className="text-lg font-display font-bold text-os-text group-hover:text-os-body transition-colors duration-300">
                  {next.title}
                </span>
              </a>
            )}
          </div>
        </nav>
        </article>
      </main>
    </Layout>
  );
};

export default Article;