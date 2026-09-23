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
import { listPublished, getPublishedBySlug, getNeighbours } from '../src/lib/posts.js';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Rendu markdown → HTML assaini, exécuté uniquement au build.
 *
 * Un article est écrit par l'auteur mais transite par une base et, à terme,
 * par un back-office : il ne peut pas être inséré tel quel. DOMPurify
 * supprime scripts, gestionnaires d'événements et attributs dangereux.
 *
 * En Node, DOMPurify a besoin d'un DOM : jsdom le fournit. Le HTML produit
 * ici est injecté tel quel dans la page (et dans window.__POST_DATA__) —
 * le navigateur ne refait jamais ce travail, marked et DOMPurify ne
 * quittent donc pas le build.
 */
const domPurify = createDOMPurify(new JSDOM('').window);
const renderMarkdown = (markdown) => {
  // Un `h1` au début d'un article est presque toujours la reprise du titre :
  // la page en a déjà un (le sien). On le rétrograde en h2 pour garder un seul
  // h1 par page — sémantique HTML et référencement.
  const withShiftedHeading = (markdown ?? '').replace(
    /^\s*#\s+(.+)$/m,
    '## $1'
  );
  return domPurify.sanitize(marked.parse(withShiftedHeading), {
    ADD_ATTR: ['target'], // liens externes ouverts dans un nouvel onglet
    FORBID_TAGS: ['style'],
  });
};

const resolveRoutes = async () => {
  try {
    const posts = await listPublished();
    const routes = ['/', '/blog', ...posts.map((post) => `/blog/${post.slug}`)];
    log(`${posts.length} article(s) publié(s) lu(s) depuis la base.`);
    return { routes, posts };
  } catch (error) {
    log(`base injoignable (${error.message.split('\n')[0]}) — pré-rendu du portfolio et de la liste du blog.`);
    return { routes: ['/', '/blog'], posts: [] };
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
  // Image de partage propre à la page.
  //
  // Sans ce bloc, une note qui déclare sa propre image serait ignorée : les
  // réseaux sociaux afficheraient l'image générique du site à la place. C'est
  // précisément ce qui se voit quand on partage un article.
  //
  // Les dimensions déclarées dans le gabarit sont retirées au passage : elles
  // décrivent l'image par défaut, pas celle-ci, et une dimension fausse fait
  // recadrer la carte de travers. Mieux vaut ne rien déclarer et laisser la
  // plateforme mesurer l'image qu'elle télécharge.
  if (meta.ogImage) {
    out = out.replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${escapeAttr(meta.ogImage)}"`
    );
    out = out.replace(
      /<meta name="twitter:image" content="[^"]*"/,
      `<meta name="twitter:image" content="${escapeAttr(meta.ogImage)}"`
    );
    for (const attribute of ['og:image:width', 'og:image:height', 'og:image:type']) {
      out = out.replace(
        new RegExp(`\\s*<meta property="${attribute}" content="[^"]*"\\s*/?>`),
        ''
      );
    }
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

const SITE_URL = 'https://zamblezie.fr';

/**
 * Données structurées d'une page, au format schema.org.
 *
 * L'accueil porte déjà son graphe JSON-LD dans index.html (WebSite, WebPage,
 * Person) : on n'y touche pas. Ce sont les pages du blog qui ont besoin des
 * leurs — sans quoi un moteur voit une page de texte sans savoir qu'il s'agit
 * d'une liste d'articles ou d'un article daté et signé.
 *
 * `Blog` pour la liste, `BlogPosting` pour une note. BlogPosting plutôt que
 * `Article` : c'est le type attendu pour un billet daté, et il est mieux
 * compris des moteurs comme des moteurs de réponse.
 *
 * Le texte intégral n'est pas dupliqué dans le JSON-LD (`articleBody`) : la
 * page le contient déjà, et le répéter doublerait le poids de chaque fichier
 * pour un bénéfice nul.
 */
const jsonLdFor = (route, postByRoute, posts) => {
  if (route === '/blog') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: `Notes — ${siteName}`,
      description:
        "Notes de veille sur l'automatisation IA, le développement web et les constats tirés de projets réels.",
      inLanguage: 'fr-FR',
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@id': `${SITE_URL}/#person` },
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
        datePublished: post.published_at,
        description: post.summary || undefined,
      })),
    };
  }

  if (route.startsWith('/blog/')) {
    const post = postByRoute.get(route.slice('/blog/'.length));
    if (!post) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${SITE_URL}${route}#post`,
      url: `${SITE_URL}${route}`,
      headline: post.title,
      description: post.meta_description || post.summary || undefined,
      articleSection: post.theme || undefined,
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      inLanguage: 'fr-FR',
      // Le nom et l'URL de l'image ne sont déclarés que s'il y en a une : un
      // og:image vide vaut moins que pas d'image du tout.
      image: post.og_image || undefined,
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@id': `${SITE_URL}/#person` },
      isPartOf: { '@id': `${SITE_URL}/blog#blog` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${route}` },
    };
  }

  // L'accueil apporte déjà son propre graphe dans le gabarit.
  return null;
};

/**
 * Sitemap du site, écrit dans dist/ (qui remplace public/ après le build).
 *
 * Il est produit ici, et non dans public/, parce que les notes n'existent
 * qu'au moment du build : elles viennent de la base. Un sitemap statique
 * dans public/ ignorerait tout article publié.
 *
 * `lastmod` porte la date de dernière modification réelle quand elle est
 * connue — c'est ce qui aide un moteur à savoir quoi recrawler.
 */
const writeSitemap = (routes, postByRoute) => {
  const today = new Date().toISOString().slice(0, 10);

  const entries = routes.map((route) => {
    const isPost = route.startsWith('/blog/');
    const post = isPost ? postByRoute.get(route.slice('/blog/'.length)) : null;

    const priority = route === '/' ? '1.0' : isPost ? '0.7' : '0.8';
    const lastmod = post?.updated_at
      ? new Date(post.updated_at).toISOString().slice(0, 10)
      : today;

    return [
      '  <url>',
      `    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  writeFileSync(join(distDir, 'sitemap.xml'), xml, 'utf8');
  log(`sitemap.xml — ${routes.length} URL(s)`);
};

try {
  if (!existsSync(join(distDir, 'index.html'))) {
    throw new Error('dist/index.html introuvable — lancez `vite build` avant.');
  }

  const { routes, posts } = await resolveRoutes();

  // Données de chaque article, lues une fois : le contenu HTML (markdown
  // assaini au build, jamais dans le navigateur) et les voisins pour la
  // navigation précédent/suivant.
  const postByRoute = new Map();
  for (const route of routes) {
    if (!route.startsWith('/blog/')) continue;
    const slug = route.slice('/blog/'.length);
    const post = await getPublishedBySlug(slug);
    if (post) {
      post.html = renderMarkdown(post.content);
      post.neighbours = await getNeighbours(slug);
      postByRoute.set(slug, post);
    }
  }

  // Chaque page du blog embarque dans window.__POST_DATA__ exactement les
  // données dont elle a besoin : la liste pour /blog, l'article et ses
  // voisins pour /blog/<slug>. Les pages restent des fichiers statiques —
  // aucune requête de données au chargement, et l'hydratation reçoit les
  // mêmes données que le rendu initial, sans écart possible.
  // Le markdown brut est exclu de la sérialisation : seul le HTML assaini
  // voyage dans la page, le contenu source ne sert qu'au rendu initial.
  const dataFor = (route) => {
    if (route === '/blog') return { posts };
    if (route.startsWith('/blog/')) {
      const stored = postByRoute.get(route.slice('/blog/'.length));
      if (!stored) return null;
      const { content, neighbours, ...post } = stored;
      return { post, neighbours };
    }
    return null;
  };

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
    const data = dataFor(route);
    const appHtml = render(route, data);

    const meta = metaFor(route, postByRoute);

    // Les données de la page sont sérialisées dans le document. Le JSON est
    // échappé pour qu'une séquence `</script>` dans un article ne puisse pas
    // refermer la balise : c'est la contre-mesure standard de l'injection
    // dans un script inline.
    const dataScript = data
      ? `<script>window.__POST_DATA__=${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
      : '';

    // Données structurées : même échappement que ci-dessus, même raison.
    const jsonLd = jsonLdFor(route, postByRoute, posts);
    const jsonLdScript = jsonLd
      ? `\n    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
      : '';

    const html = applyMeta(template, meta)
      .replace(marker, `<div id="root">${appHtml}</div>`)
      .replace('</head>', `${dataScript}${jsonLdScript}</head>`);

    const file = fileFor(route);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html, 'utf8');

    total += appHtml.length;
    log(`${route.padEnd(30)} → ${Math.round(appHtml.length / 1024)} Ko`);
  }

  writeSitemap(routes, postByRoute);

  log(`${routes.length} page(s) pré-rendue(s), ${Math.round(total / 1024)} Ko de contenu au total.`);
  rmSync(ssrDir, { recursive: true, force: true });
} catch (error) {
  console.warn(`[prerender] ignoré — ${error.message}`);
  console.warn('[prerender] le site est déployé sans pré-rendu.');
  rmSync(ssrDir, { recursive: true, force: true });
}
