import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Deux pages distinctes, deux points d'entrée.
      //
      // `index.html` est le site public : il est pré-rendu ensuite par
      // scripts/prerender.mjs (/, /blog, /blog/<slug>).
      //
      // `abyss/index.html` est l'espace d'administration. Il n'est pas
      // pré-rendu et n'est pas indexé (noindex dans la page, X-Robots-Tag dans
      // vercel.json, Disallow dans robots.txt). Un point d'entrée séparé évite
      // que le code du back-office (éditeur, appels d'API) soit téléchargé par
      // les visiteurs du site.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        abyss: resolve(import.meta.dirname, 'abyss/index.html'),
      },
    },
  },
})
