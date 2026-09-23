import { FaArrowRight } from 'react-icons/fa';

/**
 * Liste du blog : une frise chronologique, du plus récent au plus ancien.
 *
 * Le vocabulaire est volontairement universel — « note », date, thème,
 * temps de lecture — pour que recruteurs, clients et proches lisent sans
 * décoder. Ce qui restait de l'idée Git est la ligne verticale, qui est
 * un motif de journal plutôt qu'un graphique de dépôt.
 *
 * L'entrée en cascade est faite en CSS (`.note-enter`, global.css) plutôt
 * qu'avec Framer Motion. La raison n'est pas esthétique : Framer écrit
 * `opacity: 0` dans le HTML figé au build, et le contenu ne redevient visible
 * que si le JavaScript s'exécute. Une liste de notes dont la raison d'être est
 * d'être lue par les moteurs et les agents ne peut pas dépendre de ça. En CSS,
 * l'animation part avec les images, sans JS.
 */

const fmtDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const BlogList = ({ posts }) => {
  return (
    <ol className="relative">
      {/* La frise traverse chaque entrée. Elle part du premier point et
          s'étire jusqu'au dernier, plutôt que d'être un trait décoratif
          de haut en bas de la page. */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-3 bottom-3 w-px bg-os-border sm:left-[9px]"
      />
      {posts.map((post, index) => (
        <li
          key={post.slug}
          className="note-enter relative pl-8 sm:pl-12 pb-12 last:pb-0"
          // Le décalage est calculé depuis la position : l'entrée en cascade
          // est ainsi portée par la donnée, pas par un ordre déclaré à la main.
          style={{ animationDelay: `${0.06 * index + 0.05}s` }}
        >
          {/* Point de la frise */}
          <span
            aria-hidden="true"
            className="absolute left-[3px] sm:left-[5px] top-[7px] w-[9px] h-[9px] rounded-full border-2 border-os-text bg-os-bg"
          />

          <a href={`/blog/${post.slug}`} className="group block">
            {/* Métadonnées de la note */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
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
                  {post.reading_minutes} min
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold tracking-tight leading-[1.15] text-os-text group-hover:text-os-body transition-colors duration-300 mb-2">
              {post.title}
            </h2>

            {post.summary && (
              <p className="text-os-reading text-sm sm:text-base leading-[1.75] max-w-[62ch] mb-3">
                {post.summary}
              </p>
            )}

            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-medium text-os-body group-hover:text-os-text transition-colors duration-300">
              Lire la note
              <FaArrowRight
                size={10}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
};

export default BlogList;