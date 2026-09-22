import { renderToString } from 'react-dom/server';
import App from './App.jsx';

/**
 * Point d'entrée SSR — utilisé uniquement au build par scripts/prerender.mjs.
 *
 * `location` est transmise à l'application pour que le routeur rende la bonne
 * page. C'est ce qui permet de figer chaque route en HTML indépendamment :
 * /, /blog, /blog/<slug>.
 *
 * Le texte est donc présent dans le HTML servi, ce qui le rend lisible par les
 * robots qui n'exécutent pas le JavaScript (GPTBot, OAI-SearchBot,
 * PerplexityBot, ClaudeBot).
 *
 * Côté navigateur, React prend ensuite le relais via hydrateRoot : le DOM
 * pré-rendu est réutilisé, le comportement visuel reste inchangé.
 */
export function render(location = '/') {
  return renderToString(<App ssrPath={location} />);
}
