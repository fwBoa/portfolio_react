import { renderToString } from 'react-dom/server';
import App from './App.jsx';

/**
 * Point d'entrée SSR — utilisé uniquement au build par scripts/prerender.mjs.
 *
 * Le rendu produit le HTML dans son état initial (les animations Framer Motion
 * étant à leur valeur d'entrée). Le texte est donc présent dans le HTML servi,
 * ce qui le rend lisible par les robots qui n'exécutent pas le JavaScript
 * (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot...).
 *
 * Côté navigateur, React prend ensuite le relais via hydrateRoot : le DOM
 * pré-rendu est réutilisé, le comportement visuel reste inchangé.
 */
export function render() {
  return renderToString(<App />);
}
