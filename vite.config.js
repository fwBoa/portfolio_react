import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
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
      //
      // `input` est réservé au build navigateur : le build SSR (compilé par
      // prerender.mjs) a son propre point d'entrée, `src/entry-server.jsx`,
      // passé par `build.ssr`. Déclarer les deux HTML ici l'aurait fait entrer
      // en conflit avec lui.
      input: isSsrBuild
        ? undefined
        : {
            main: resolve(import.meta.dirname, 'index.html'),
            abyss: resolve(import.meta.dirname, 'abyss/index.html'),
          },
      // Séparation des dépendances : elles changent rarement, contrairement au
      // code du site. Le navigateur les garde en cache d'une version à l'autre.
      // C'est aussi ce qui rend le poids de chacune lisible dans le rapport de
      // build, au lieu d'un seul bloc indistinct.
      //
      // Uniquement pour le build navigateur : en SSR, React et framer-motion
      // sont des modules externes, et `manualChunks` refuse de les assigner à
      // un morceau — le build échouait avec « "react" cannot be included in
      // manualChunks because it is resolved as an external module ».
      output: isSsrBuild
        ? undefined
        : {
            manualChunks: {
              react: ['react', 'react-dom'],
              motion: ['framer-motion'],
            },
          },
    },
  },
}))
