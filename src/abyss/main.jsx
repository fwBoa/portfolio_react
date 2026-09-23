import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
import AdminApp from './AdminApp.jsx'

// L'espace d'administration est une application à part : il n'est pas pré-rendu
// et n'a rien à voir avec le site public. Il est donc monté par son propre
// point d'entrée, dans sa propre page HTML (abyss/index.html), plutôt que par
// le routeur du site — ce qui évite d'embarquer tout le back-office dans le
// bundle que téléchargent les visiteurs.
const container = document.getElementById('admin-root')

if (!container) {
  throw new Error('Élément #admin-root introuvable.')
}

createRoot(container).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
)
