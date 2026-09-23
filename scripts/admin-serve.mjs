#!/usr/bin/env node
/**
 * Serveur local pour l'administration.
 *
 *   node --env-file=.env.local scripts/admin-serve.mjs [port]
 *
 * Pourquoi ce script existe
 * -------------------------
 * En production, Vercel transforme chaque fichier de `api/` en fonction et
 * fournit les objets `req`/`res` attendus. En développement, `vite dev` ne
 * connaît pas ce dossier : sans ce serveur, l'administration ne serait
 * testable qu'après déploiement, ce qui est le pire moment pour découvrir un
 * bug d'authentification.
 *
 * Le serveur reproduit fidèlement le contrat de Vercel : `req.query`,
 * `req.body` déjà analysé, `res.status().json()`, `res.setHeader()`. Il sert
 * aussi le build statique (`dist/`) pour que `/abyss` s'ouvre dans la même
 * origine — condition pour que le cookie de session soit transmis.
 *
 * Ce n'est pas un outil de production : il n'est pas optimisé, ne gère pas les
 * connexions persistantes, et n'a aucune raison d'être déployé.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4300);

/** Table des routes : chemin → module du handler. */
const ROUTES = {
  '/api/auth/login': '../api/auth/login.js',
  '/api/auth/logout': '../api/auth/logout.js',
  '/api/auth/session': '../api/auth/session.js',
  '/api/posts': '../api/posts/index.js',
  '/api/posts/publish': '../api/posts/publish.js',
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/** Lit le corps de la requête et le décode si c'est du JSON. */
function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        // Vercel fournit une chaîne si l'en-tête n'est pas du JSON ; les
        // handlers tolèrent les deux.
        resolve(raw);
      }
    });
  });
}

/**
 * Enveloppe `res` pour offrir l'API de Vercel : chaînage, `json()`, `send()`.
 */
function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(payload));
    return res;
  };
  res.send = (payload) => {
    res.end(payload);
    return res;
  };
  return res;
}

/** Sert un fichier de `dist/`, avec repli sur la page 404 du site. */
async function serveStatic(pathname, res) {
  // Un chemin `../` sortirait du dossier servi : on normalise et on borne.
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let target = join(DIST, safePath);

  try {
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, 'index.html');
  } catch {
    // Chemin inconnu : on tente la page 404 statique du site.
    try {
      const notFound = await readFile(join(DIST, '404.html'));
      res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(notFound);
    } catch {
      res.status(404).setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('404');
    }
  }

  try {
    const file = await readFile(target);
    res.setHeader('Content-Type', TYPES[extname(target)] ?? 'application/octet-stream');
    // Pas de cache en développement : c'est le but.
    res.setHeader('Cache-Control', 'no-store');
    return res.end(file);
  } catch {
    res.status(404).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('404');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const handlerPath = ROUTES[url.pathname];

  enhanceResponse(res);

  if (handlerPath) {
    try {
      const { default: handler } = await import(handlerPath);

      // Reproduit la forme fournie par Vercel.
      req.query = Object.fromEntries(url.searchParams.entries());
      req.body = await readBody(req);

      await handler(req, res);
    } catch (error) {
      console.error(`[admin-serve] ${req.method} ${url.pathname} → ${error.message}`);
      if (!res.writableEnded) {
        res.status(500).json({ error: 'Erreur serveur.' });
      }
    }
    return;
  }

  // `/abyss` sans nom de fichier → la page d'administration.
  const pathname = url.pathname === '/abyss' || url.pathname === '/abyss/'
    ? '/abyss/index.html'
    : url.pathname;

  await serveStatic(decodeURIComponent(pathname), res);
});

server.listen(PORT, () => {
  const configured = {
    ADMIN_PASSWORD_HASH: Boolean(process.env.ADMIN_PASSWORD_HASH),
    ADMIN_SESSION_SECRET: Boolean(process.env.ADMIN_SESSION_SECRET),
    DEPLOY_HOOK_URL: Boolean(process.env.DEPLOY_HOOK_URL),
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
  };

  console.log(`\nServeur d'administration — http://localhost:${PORT}/abyss\n`);
  for (const [key, present] of Object.entries(configured)) {
    console.log(`  ${present ? '✓' : '·'} ${key}${present ? '' : '  (absente)'}`);
  }

  if (!configured.ADMIN_PASSWORD_HASH || !configured.ADMIN_SESSION_SECRET) {
    console.log(
      '\n  ⚠ La connexion est impossible sans ADMIN_PASSWORD_HASH et ADMIN_SESSION_SECRET.\n' +
        '    Génère-les avec : node scripts/admin-password.mjs\n'
    );
  }
  console.log('');
});
