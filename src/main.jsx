import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

const container = document.getElementById('root')

const app = (
  <StrictMode>
    <App />
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
