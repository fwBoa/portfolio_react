import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import BlogList from '../components/blog/BlogList';

/**
 * Page du blog : la liste des notes de veille.
 *
 * Elle passe par le même Layout que l'accueil — en-tête, pied de page,
 * accès aux mentions légales. C'est ce qui fait du blog une partie du site
 * et non une annexe à part.
 *
 * Aucun pied de page local : le Layout en fournit déjà un, et en dupliquer
 * un donnerait deux pieds de page sur la page. Le retour au portfolio est
 * porté par le logo de l'en-tête et par l'entrée « À propos » de la nav.
 */

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const Blog = ({ posts }) => (
  <Layout activeSection="notes">
    <main id="main" className="flex-1 bg-os-bg text-os-text pt-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 py-16 sm:py-24">
      {/* En-tête du blog */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="mb-16 sm:mb-20 lg:mb-24"
      >
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-os-body font-medium font-display block mb-6">
          Notes de veille
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.02] mb-8">
          Notes.
        </h1>
        <p className="text-os-reading text-base sm:text-lg lg:text-xl max-w-[60ch] leading-[1.75]">
          Ce que je vois dans mon métier : l&apos;automatisation IA, le
          développement web, et les constats tirés de projets réels.
          Une note à la fois, quand le sujet mérite d&apos;être écrit.
        </p>
      </motion.div>

      {/* Liste des notes */}
      {posts.length === 0 ? (
        <p className="text-os-reading text-base leading-[1.75]">
          Aucune note pour l&apos;instant. Les premières arrivent bientôt.
        </p>
      ) : (
        <BlogList posts={posts} />
      )}
      </div>
    </main>
  </Layout>
);

export default Blog;