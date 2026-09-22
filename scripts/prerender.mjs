/**
 * Pré-rendu du site dans dist/.
 *
 * Contexte : le site est une SPA React. Sans pré-rendu, le HTML servi ne
 * contient qu'un <div id="root"></div> vide. Googlebot exécute le JavaScript
 * et voit le contenu, mais les robots des IA (GPTBot, OAI-SearchBot,
 * PerplexityBot, ClaudeBot) ne le font pas : ils voient une page vide.
 *
 * Ce script rend chaque route en HTML au moment du build, puis écrit un fichier
 * par route. Le contenu devient ainsi lisible par tous les robots, sans
 * exécuter de JavaScript — y compris les articles du blog.
 *
 * Chaque route peut aussi porter ses propres métadonnées (titre, description,
 * canonical). Sans elles, toutes les pages partageraient celles de l'accueil,
 * ce que les moteurs interprètent comme du contenu dupliqué.
 *
 * En cas d'échec, le build n'est pas interrompu : le site reste fonctionnel,
 * simplement sans pré-rendu.
 */
import { build } from 'vite';
import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const log = (msg) => console.log(`[prerender] ${msg}`);

/**
 * Routes à figer. Chaque entrée produit un fichier :
 *   '/'          -> dist/index.html
 *   '/blog'      -> dist/blog/index.html
 *   '/blog/<slug>' -> dist/blog/<slug>/index.html
 *
 * Les routes du blog sont lues depuis la base : si la base est injoignable, on
 * retombe sur les routes statiques et le site reste déployable.
 */
import { listPublished, getPublishedBySlug } from '../src/lib/posts.js';

const resolveRoutes = async () => {
  const routes = ['/', '/blog'];
  try {
    const posts = await listPublished();
    for (const post of posts) routes.push(`/blog/${post.slug}`);
    log(`${routes.length - 2} article(s) publié(s) lu(s) depuis la base.`);
    return routes;
  } catch (error) {
    log(`base injoignable (${error.message.split('\n')[0]}) — pré-rendu du portfolio et de la liste du blog.`);
    return routes;
  }
};

/**
 * Échappe une valeur destinée à un attribut HTML.
 */
const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Applique les métadonnées propres à une route sur le template de base.
 * Sans cela, chaque page hériterait du titre et de la description de l'accueil.
 */
const applyMeta = (html, meta) => {
  if (!meta) return html;
  let out = html;
  if (meta.title) {
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`);
    out = out.replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${escapeAttr(meta.title)}"`
    );
    out = out.replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${escapeAttr(meta.title)}"`
    );
  }
  if (meta.description) {
    out = out.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeAttr(meta.description)}"`
    );
    out = out.replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}"`
    );
  }
  if (meta.canonical) {
    out = out.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${escapeAttr(meta.canonical)}"`
    );
    out = out.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${escapeAttr(meta.canonical)}"`
    );
  }
  return out;
};

/**
 * Métadonnées par route. L'accueil garde celles du template ; les pages du
 * blog les surchargent. Les articles utilisent leurs métadonnées d'auteur,
 * avec le titre de l'article en repli.
 */
const siteName = 'Jean-David Zamblezie';
const metaFor = (route, postByRoute) => {
  if (route === '/blog') {
    return {
      title: 'Notes — Jean-David Zamblezie',
      description:
        "Notes de veille sur l'automatisation IA, le développement web et les constats tirés de projets réels.",
      canonical: 'https://zamblezie.fr/blog',
    };
  }
  if (route.startsWith('/blog/')) {
    const slug = route.slice('/blog/'.length);
    const post = postByRoute.get(slug);
    if (!post) {
      return {
        title: `${slug} — Notes de ${siteName}`,
        description: 'Note de veille de Jean-David Zamblezie.',
        canonical: `https://zamblezie.fr${route}`,
      };
    }
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.summary || '',
      canonical: `https://zamblezie.fr${route}`,
      ogImage: post.og_image,
    };
  }
  return null;
};

/** Chemin du fichier HTML correspondant à une route. */
const fileFor = (route) =>
  route === '/' ? join(distDir, 'index.html') : join(distDir, route.replace(/^\//, ''), 'index.html');

try {
  if (!existsSync(join(distDir, 'index.html'))) {
    throw new Error('dist/index.html introuvable — lancez `vite build` avant.');
  }

  const routes = await resolveRoutes();
  const postByRoute = new Map();

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

  const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
  const template = readFileSync(join(distDir, 'index.html'), 'utf8');
  const marker = '<div id="root"></div>';

  if (!template.includes(marker)) {
    throw new Error('Marqueur <div id="root"></div> introuvable dans dist/index.html.');
  }

  let total = 0;
  for (const route of routes) {
    const appHtml = render(route);

    // Récupérer les données de l'article pour cette route, si c'en est une.
    if (route.startsWith('/blog/')) {
      const slug = route.slice('/blog/'.length);
      const post = await getPublishedBySlug(slug);
      if (post) postByRoute.set(slug, post);
    }

    const meta = metaFor(route, postByRoute);
    const html = applyMeta(template, meta).replace(
      marker,
      `<div id="root">${appHtml}</div>`
    );

    const file = fileFor(route);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html, 'utf8');

    total += appHtml.length;
    log(`${route.padEnd(30)} → ${Math.round(appHtml.length / 1024)} Ko`);
  }

  log(`${routes.length} page(s) pré-rendue(s), ${Math.round(total / 1024)} Ko de contenu au total.`);
  rmSync(ssrDir, { recursive: true, force: true });
} catch (error) {
  console.warn(`[prerender] ignoré — ${error.message}`);
  console.warn('[prerender] le site est déployé sans pré-rendu.');
  rmSync(ssrDir, { recursive: true, force: true });
}
