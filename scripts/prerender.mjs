/**
 * Pré-rendu du portfolio dans dist/index.html.
 *
 * Contexte : le site est une SPA React. Sans pré-rendu, le HTML servi ne
 * contient qu'un <div id="root"></div> vide. Googlebot exécute le JavaScript
 * et voit le contenu, mais les robots des IA (GPTBot, OAI-SearchBot,
 * PerplexityBot, ClaudeBot) ne le font pas : ils voient une page vide.
 *
 * Ce script rend l'application en HTML au moment du build, puis l'injecte
 * dans le <div id="root"> de la page. Le contenu devient ainsi lisible par
 * tous les robots, sans exécuter de JavaScript.
 *
 * En cas d'échec, le build n'est pas interrompu : le site reste fonctionnel,
 * simplement sans pré-rendu.
 */
import { build } from 'vite';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const log = (msg) => console.log(`[prerender] ${msg}`);

try {
  if (!existsSync(join(distDir, 'index.html'))) {
    throw new Error('dist/index.html introuvable — lancez `vite build` avant.');
  }

  rmSync(ssrDir, { recursive: true, force: true });

  log('compilation du bundle SSR…');
  await build({
    root,
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: 'dist-ssr',
      emptyOutDir: true,
    },
  });

  log('rendu de l\'application…');
  const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
  const appHtml = render();

  const indexPath = join(distDir, 'index.html');
  const html = readFileSync(indexPath, 'utf8');
  const marker = '<div id="root"></div>';

  if (!html.includes(marker)) {
    throw new Error('Marqueur <div id="root"></div> introuvable dans dist/index.html.');
  }

  writeFileSync(indexPath, html.replace(marker, `<div id="root">${appHtml}</div>`), 'utf8');
  log(`HTML pré-rendu injecté (${Math.round(appHtml.length / 1024)} Ko de contenu).`);

  rmSync(ssrDir, { recursive: true, force: true });
} catch (error) {
  console.warn(`[prerender] ignoré — ${error.message}`);
  console.warn('[prerender] le site est déployé sans pré-rendu.');
  rmSync(ssrDir, { recursive: true, force: true });
}
