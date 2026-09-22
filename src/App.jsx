import { Router, Switch, Route } from 'wouter';
import Home from './pages/Home';
import { Analytics } from '@vercel/analytics/react';

/**
 * Routes publiques du site.
 *
 * Le portfolio reste sur `/` — la page unique existante, inchangée.
 * Le blog arrive ensuite : `/blog` pour la liste, `/blog/:slug` pour un article.
 * Ces routes sont déclarées dès maintenant pour que le pré-rendu sache quelles
 * pages produire ; leur contenu sera écrit en phase 2 et 3.
 *
 * `ssrPath` est fourni au build par le point d'entrée SSR : le routeur rend
 * alors la page correspondant à cette URL, ce qui permet de figer chaque route
 * en HTML. Dans le navigateur, `ssrPath` est indéfini et le routeur lit l'URL
 * courante.
 */
const App = ({ ssrPath }) => (
  <Router ssrPath={ssrPath}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog">
        <Placeholder title="Blog" />
      </Route>
      <Route path="/blog/:slug">
        {(params) => <Placeholder title={`Article — ${params.slug}`} />}
      </Route>
      <Route>
        <Placeholder title="Page introuvable" />
      </Route>
    </Switch>
    <Analytics />
  </Router>
);

/**
 * Gabarit provisoire, le temps que les pages réelles du blog soient écrites.
 * Il vérifie dès maintenant que le routing fonctionne et que chaque route est
 * figée en HTML au build — condition pour que les articles restent lisibles par
 * les robots qui n'exécutent pas le JavaScript.
 */
const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-os-bg text-os-text pt-20">
    <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 py-16 sm:py-24">
      <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-os-body font-medium font-display block mb-6">
        Phase 1 — fondations
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.05] mb-8">
        {title}
      </h1>
      <p className="text-os-reading text-base lg:text-lg max-w-[60ch] leading-[1.75]">
        Cette page est un gabarit temporaire. Elle confirme que le routing
        fonctionne et que chaque route est bien figée en HTML au moment du
        build — condition nécessaire pour que les articles restent lisibles
        par les robots qui n&apos;exécutent pas le JavaScript.
      </p>
    </div>
  </div>
);

export default App;
