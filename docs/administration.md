# Espace d'administration — `/abyss`

Documentation de l'espace de rédaction des notes. Il vit sur `/abyss`, il est
protégé par un mot de passe, et il n'est pas indexé.

## Ce que fait cet espace

Il permet d'écrire, modifier et publier les notes du blog. Les articles sont
stockés dans la base Neon (`posts`) mais **figés en HTML au moment du build** :
c'est ce qui les rend lisibles par les robots qui n'exécutent pas le JavaScript
(GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot).

Conséquence directe, et c'est le point à retenir :

> **Publier ne suffit pas. Il faut relancer un build.**

Le bouton « Publier » s'en charge : il écrit en base, puis appelle un *Deploy
Hook* Vercel qui redéclenche la construction du site. Comptez une à deux
minutes avant que la note apparaisse en ligne.

## Variables d'environnement

Quatre variables, à définir sur Vercel (Production) et, pour travailler en
local, dans `.env.local` (fichier ignoré par git).

| Variable | Rôle | Comment l'obtenir |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | Hash du mot de passe administrateur. Le mot de passe lui-même n'est stocké nulle part. | `npm run admin:password` |
| `ADMIN_SESSION_SECRET` | Clé de signature des sessions (32 octets minimum, base64). | `openssl rand -base64 32` |
| `DEPLOY_HOOK_URL` | URL appelée pour reconstruire le site après une publication. | `vercel deploy-hooks create <nom>` |
| `DATABASE_URL` | Connexion Postgres (fournie par l'intégration Neon). | Déjà configurée |

### Les définir

```bash
# Secret de session
openssl rand -base64 32 > /tmp/secret.txt
vercel env add ADMIN_SESSION_SECRET production < /tmp/secret.txt

# Mot de passe : génère le hash (saisie masquée, jamais dans l'historique)
npm run admin:password
# puis, avec la ligne ADMIN_PASSWORD_HASH affichée :
vercel env add ADMIN_PASSWORD_HASH production < /tmp/hash.txt

# Deploy Hook
vercel deploy-hooks create abyss-publish
vercel env add DEPLOY_HOOK_URL production < /tmp/hook.txt

# Nettoyage : ne pas laisser traîner les valeurs sur le disque
rm -f /tmp/secret.txt /tmp/hash.txt /tmp/hook.txt
```

Passer la valeur par un fichier plutôt qu'en argument évite qu'elle
n'apparaisse dans l'historique du shell et dans la liste des processus.

**Après tout changement de variable, redéployer.** Vercel ne réinjecte pas les
variables dans un déploiement existant.

## Travailler en local

`vite dev` ne connaît pas le dossier `api/` : Vercel y voit des fonctions, pas
Vite. Un petit serveur reproduit donc le contrat de Vercel pour que
l'administration soit testable sans déployer.

```bash
npm run admin:serve        # http://localhost:4300/abyss
```

Il faut d'abord un build (`npm run build`) : le serveur sert `dist/`.

Le serveur indique au démarrage quelles variables sont présentes, et prévient
si la connexion restera impossible.

## Tests

```bash
npm run admin:test         # mot de passe, sessions, slug, temps de lecture
npm run admin:test:db      # CRUD contre la vraie base
```

`admin:test` vérifie ce qui casse silencieusement : qu'un mot de passe voisin
soit refusé, qu'un jeton falsifié soit rejeté, qu'un jeton signé avec un autre
secret ne passe pas, et qu'un hash corrompu ferme l'accès sans faire tomber la
fonction.

`admin:test:db` vérifie les règles qui vivent **dans la base** et non dans le
JavaScript : attribution du numéro de note à la publication, refus d'un état
incohérent, mise à jour de `updated_at`. Il crée son propre article puis le
supprime.

> Les séquences PostgreSQL ne sont pas transactionnelles : un `ROLLBACK` ne
> rend pas un numéro consommé. Le test relève donc la valeur avant et la
> restaure après. C'est ce qui lui permet d'être exécuté sans laisser de trou
> dans la numérotation éditoriale.

## Sécurité — ce qui protège, et ce qui ne protège pas

**Ce qui protège vraiment :**

- Mot de passe dérivé par **scrypt** (RFC 7914), coûteux en temps et en
  mémoire. Une fuite de l'environnement Vercel ne donne pas le mot de passe.
- Comparaison en **temps constant**, pour ne pas laisser fuir le secret par la
  durée de la réponse.
- Session : **JWT signé HS256**, `iss`/`aud` vérifiés, durée de 8 heures.
- Cookie `admin_session` : `httpOnly` (hors de portée d'une injection de
  script), `sameSite=strict` (coupe les requêtes forgées inter-sites), `secure`
  en production, et limité à `/api`.
- Session revérifiée **sur chaque route d'API**, avant tout accès aux données.
  L'interface peut masquer ses boutons ; une requête forgée à la main ne s'en
  soucie pas.
- Limitation des tentatives de connexion (10 par quart d'heure et par IP).

**Ce qui ne protège pas l'accès :**

Le `noindex`, le `X-Robots-Tag` et `robots.txt` découragent l'indexation. Un
visiteur qui tape `/abyss` voit le formulaire de connexion — c'est voulu. Ces
mesures ne remplacent pas l'authentification.

**Limites connues :**

- La limitation de débit vit en mémoire d'instance : elle ne survit pas à un
  redéploiement et chaque instance a la sienne. C'est une gêne contre le
  bourrage de mot de passe, pas une protection forte.
- Une session ne peut pas être révoquée individuellement avant son expiration.
  Changer `ADMIN_SESSION_SECRET` invalide toutes les sessions d'un coup.

## Non-indexation

Trois mécanismes, parce qu'aucun ne suffit seul :

1. `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">`
   dans `abyss/index.html`.
2. `X-Robots-Tag` dans `vercel.json`. **C'est le seul qui couvre les réponses
   hors HTML** (erreurs, redirections).
3. `robots.txt`.

Un piège à connaître : `robots.txt` ne contient **pas** `Disallow: /abyss`, et
c'est délibéré. Un `Disallow` empêcherait le robot de visiter la page, donc de
lire son `noindex` — il pourrait alors indexer l'URL *sans contenu*, avec le
chemin visible dans les résultats. Seul `/api/` est écarté.

## Fichiers

```
abyss/index.html              page HTML de l'espace (noindex)
src/abyss/main.jsx            point d'entrée, monté séparément du site public
src/abyss/AdminApp.jsx        trois états : connexion, liste, éditeur
src/abyss/Login.jsx           écran de connexion
src/abyss/PostList.jsx        liste brouillons + publiées
src/abyss/Editor.jsx          éditeur markdown avec aperçu côte à côte
src/abyss/api.js              appels à l'API, gestion de session expirée
api/_lib/password.js          scrypt : hash et vérification
api/_lib/session.js           JWT, cookie, contrôle d'accès
api/_lib/posts-admin.js       CRUD articles (brouillons compris)
api/auth/{login,logout,session}.js
api/posts/index.js            GET / POST / PATCH / DELETE
api/posts/publish.js          publication + Deploy Hook
scripts/admin-password.mjs    génère le hash du mot de passe
scripts/admin-serve.mjs       serveur local pour tester l'admin
scripts/admin-test.mjs        tests d'authentification
scripts/admin-db-test.mjs     tests CRUD contre la base
```

## Pourquoi pas Neon Auth

La question s'est posée et la réponse est documentée ici pour ne pas la
reposer. Neon Auth (Managed Better Auth) a été écarté pour quatre raisons
vérifiées :

1. Le paquet `@neondatabase/auth` est en **beta** (`0.5.0-beta`).
2. Il ne fournit d'adaptateur serveur que pour **Next.js, TanStack Start et
   Hono**. Sur Vite + fonctions Vercel, il faudrait écrire l'adaptateur
   `RequestContext` soi-même.
3. Il exige la CLI `neon` et un projet créé via **Neon Cloud**. Ce projet est
   *Claimable*, issu de l'intégration Vercel.
4. Il est **incompatible avec IP Allow** et Private Networking, si ces
   protections sont activées un jour.

Pour un administrateur unique, le coût dépassait le besoin. Si le
multi-utilisateurs devient nécessaire, les tables `users` et `sessions` de
Better Auth vivent dans le schéma `neon_auth` de la branche : la migration
reste possible sans refaire le schéma `posts`.
