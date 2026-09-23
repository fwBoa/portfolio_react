import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

const container = document.getElementById('root')

// Les données de la page (liste des notes, ou l'article affiché et ses
// voisins) sont sérialisées au build dans window.__POST_DATA__ par
// scripts/prerender.mjs. Elles n'existent que sur les pages du blog
// pré-rendues ; l'accueil et le dev n'en ont pas besoin.
const data = window.__POST_DATA__ ?? null

const app = (
  <StrictMode>
    <App data={data} />
  </StrictMode>
)

// Le build pré-rend chaque route dans le #root du fichier HTML correspondant
// (cf. scripts/prerender.mjs) : /, /blog, /blog/<slug>. Dans ce cas on hydrate
// le HTML existant au lieu de le recréer, ce qui évite un remplacement du DOM
// au chargement et conserve l'avantage acquis auprès des robots qui
// n'exécutent pas le JavaScript.
//
// En développement, #root est vide : le rendu client classique prend le relais.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
