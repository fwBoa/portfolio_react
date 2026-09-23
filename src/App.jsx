import { Router, Switch, Route } from 'wouter';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Article from './pages/Article';
import { Analytics } from '@vercel/analytics/react';

/**
 * Routes publiques du site.
 *
 * Le portfolio reste sur `/` — la page unique existante, inchangée.
 * Le blog vit sur `/blog` (liste des notes) et `/blog/:slug` (une note).
 *
 * Les données de chaque page ne sont pas lues ici : elles sont résolues au
 * build (cf. scripts/prerender.mjs) puis injectées dans le HTML via
 * window.__POST_DATA__. L'application reçoit `data` en prop — au build par
 * le point d'entrée SSR, dans le navigateur via main.jsx. C'est ce qui
 * permet à l'hydratation de reproduire exactement le rendu initial, et au
 * bundle navigateur de ne jamais embarquer ni driver de base ni rendu
 * markdown.
 *
 * `ssrPath` est fourni au build : le routeur rend alors la page
 * correspondant à cette URL. Dans le navigateur, il est indéfini et le
 * routeur lit l'URL courante.
 *
 * Les liens entre pages sont des <a> classiques : chaque note est un
 * fichier statique distinct, la navigation recharge une page complète —
 * simple, sans état client à synchroniser.
 */
const App = ({ ssrPath, data = null }) => (
  <Router ssrPath={ssrPath}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog">
        <Blog posts={data?.posts ?? []} />
      </Route>
      <Route path="/blog/:slug">
        {(params) => {
          if (!data?.post || data.post.slug !== params.slug) return <NotFound />;
          return <Article post={data.post} neighbours={data.neighbours} />;
        }}
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
    <Analytics />
  </Router>
);

/**
 * Page 404 du site, dans la charte. Le fichier public/404.html reste servi par
 * le hébergeur pour les chemins hors du domaine applicatif ; cette route
 * attrape les URL inconnues du routeur.
 */
const NotFound = () => (
  <div className="min-h-screen bg-os-bg text-os-text pt-20">
    <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 py-16 sm:py-24">
      <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-os-body font-medium font-display block mb-6">
        Erreur 404
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.05] mb-8">
        Cette page n&apos;existe pas.
      </h1>
      <p className="text-os-reading text-base lg:text-lg max-w-[60ch] leading-[1.75] mb-10">
        Le lien est peut-être obsolète, ou l&apos;adresse mal saisie. Le
        portfolio, lui, est toujours en ligne.
      </p>
      <a
        href="/"
        className="text-[11px] uppercase tracking-[0.15em] font-medium text-os-body hover:text-os-text transition-colors duration-300"
      >
        ← Retour à l&apos;accueil
      </a>
    </div>
  </div>
);

export default App;
