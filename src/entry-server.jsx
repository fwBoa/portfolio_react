import { renderToString } from 'react-dom/server';
import App from './App.jsx';

/**
 * Point d'entrée SSR — utilisé uniquement au build par scripts/prerender.mjs.
 *
 * `location` est transmise à l'application pour que le routeur rende la bonne
 * page. C'est ce qui permet de figer chaque route en HTML indépendamment :
 * /, /blog, /blog/<slug>.
 *
 * `data` est ce que la page affichera : la liste des notes pour /blog,
 * l'article et ses voisins pour /blog/<slug>. Le même objet est sérialisé
 * dans le HTML (window.__POST_DATA__) puis rendu à l'hydratation — rendu
 * initial et hydratation ne peuvent pas diverger.
 *
 * Le texte est donc présent dans le HTML servi, ce qui le rend lisible par les
 * robots qui n'exécutent pas le JavaScript (GPTBot, OAI-SearchBot,
 * PerplexityBot, ClaudeBot).
 */
export function render(location = '/', data = null) {
  return renderToString(<App ssrPath={location} data={data} />);
}
