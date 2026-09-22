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

// Le build pré-rend le contenu dans #root (cf. scripts/prerender.mjs) pour le
// rendre lisible par les robots qui n'exécutent pas le JavaScript. Dans ce cas
// on hydrate le HTML existant au lieu de le recréer, ce qui évite un
// remplacement du DOM au chargement. En développement, #root est vide.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
