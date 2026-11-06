import { motion } from 'framer-motion';

/**
 * Notes — l'accueil montre les trois dernières notes publiées.
 *
 * Tant que la base n'en contient aucune, la section reste présente avec un
 * état vide assumé : le carnet existe, il n'a simplement rien publié encore.
 * Aucun faux contenu n'est injecté.
 */

const fmtDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const NotesSection = ({ posts = [] }) => (
  <section id="notes" className="bg-os-bg text-os-text">
    <div className="px-5 py-[72px] sm:px-10 sm:py-24 lg:px-12 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8 grid gap-[22px] lg:mb-14"
        >
          <h2 className="font-display text-[clamp(2.6rem,7.5vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em] text-os-text">
            Notes.
          </h2>
          <p className="max-w-[44ch] text-[15px] leading-[1.75] text-os-body sm:text-[16px] sm:leading-[1.75] lg:justify-self-end">
            Ce que j&apos;apprends en construisant. Une note quand le sujet tient
            debout, pas un flux.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
        >
        {posts.length === 0 ? (
          <div className="grid gap-5 border-t border-os-border py-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] sm:items-end sm:gap-10">
            <p className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.05] tracking-[-0.04em] text-os-text">
              Le carnet est encore vide.
            </p>
            <p className="max-w-[42ch] text-sm leading-[1.75] text-os-body sm:justify-self-end sm:text-right">
              Les premières notes arrivent bientôt. Une note paraît quand le
              sujet tient debout, pas avant.
            </p>
          </div>
        ) : (
          <>
            <ol className="border-t border-os-border">
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-os-border">
                  <a
                    href={`/blog/${post.slug}`}
                    className="group grid gap-3 py-6 sm:grid-cols-[150px_minmax(0,1fr)_22px] sm:items-baseline sm:gap-6"
                  >
                    <time
                      dateTime={new Date(post.published_at).toISOString()}
                      className="text-[12px] font-medium uppercase tracking-[0.1em] text-os-body"
                    >
                      {fmtDate(post.published_at)}
                    </time>

                    <span className="min-w-0">
                      <span className="block font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-bold leading-[1.1] tracking-[-0.03em] text-os-text transition-colors duration-300 group-hover:text-os-body">
                        {post.title}
                      </span>
                      {post.summary && (
                        <span className="mt-2 block max-w-[68ch] text-[14px] leading-[1.7] text-os-body">
                          {post.summary}
                        </span>
                      )}
                    </span>

                    <span
                      aria-hidden="true"
                      className="hidden text-lg text-os-text transition-transform duration-300 group-hover:translate-x-1 sm:block"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </>
        )}

        <a
          href="/blog"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-os-text transition-colors duration-300 hover:text-os-body active:opacity-70"
        >
          Toutes les notes
          <span aria-hidden="true">↗</span>
        </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default NotesSection;
