/**
 * Génère llms-full.txt — la version markdown complète du portfolio,
 * destinée aux agents IA qui ne rendent pas le JavaScript.
 *
 * Le contenu est dérivé de src/data/ pour rester synchronisé avec le site :
 * une modification des compétences ou des coordonnées se propage automatiquement.
 *
 * Les notes du blog sont lues depuis la base quand elle est joignable : une
 * note publiée doit être citable par un agent IA, pas seulement lisible dans
 * un navigateur. Si la base ne répond pas, le fichier est produit sans elles —
 * le build ne doit jamais échouer pour cette raison.
 *
 * Exécuté via `npm run build` (script prebuild).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { site } from '../src/data/site.js';
import { skillGroups } from '../src/data/skills.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const skills = skillGroups
  .map(
    (group) => `### ${group.num} — ${group.title}

${group.items.join(', ')}

${group.desc}`
  )
  .join('\n\n');

/**
 * Section « Notes » du fichier. Chaque note est présentée par ses métadonnées
 * et son résumé, avec un lien vers sa page : l'agent sait de quoi la note
 * parle sans avoir à charger la page entière.
 */
const notesSection = async () => {
  let posts = [];
  try {
    const { listPublished, closePool } = await import('../src/lib/posts.js');
    posts = await listPublished();
    await closePool();
  } catch (error) {
    console.warn(`[llms] notes ignorées — ${error.message.split('\n')[0]}`);
    return '';
  }

  if (posts.length === 0) return '';

  // node-postgres renvoie les colonnes timestamptz en objets Date : on les
  // formate ici, la date brute n'ayant aucun sens pour un agent qui lit le
  // fichier.
  const fmtDate = (value) =>
    new Date(value).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const entries = posts
    .map(
      (post) => `- **${post.title}**${
        post.theme ? ` · ${post.theme}` : ''
      } (${fmtDate(post.published_at)}${
        post.reading_minutes ? `, ${post.reading_minutes} min de lecture` : ''
      })
  ${post.summary ?? ''}
  ${site.url}/blog/${post.slug}`
    )
    .join('\n\n');

  return `## Notes

Notes de veille sur l'automatisation IA, le développement web et les constats
tirés de projets réels. ${posts.length} note${posts.length > 1 ? 's' : ''} publiée${
    posts.length > 1 ? 's' : ''
  }, de la plus récente à la plus ancienne.

${entries}`;
};

const notes = await notesSection();

const content = `# ${site.name} — ${site.jobTitle}

> Portfolio de ${site.name}, développeur web basé à ${site.location}, spécialisé
> en automatisation IA et ingénierie agentique. Conçoit des sites et applications
> web sur mesure (React, Next.js, TypeScript) ainsi que des systèmes agentiques
> (LangChain, MCP, n8n).

Source : ${site.url}/ — Contact : ${site.email}

## Profil

- Nom complet : ${site.name}
- Rôle : ${site.role}
- Titre : ${site.jobTitle}
- Localisation : ${site.location}
- Statut : disponible en alternance ou en freelance
- Expérience : 1+ an

## Compétences

${skills}
${notes ? `\n${notes}\n` : ''}
## Contact

- Email : ${site.email}
- GitHub : ${site.github}
- LinkedIn : ${site.linkedin}
- Site : ${site.url}

## Informations complémentaires

- Le site propose deux modes d'affichage : une vue « OS » classique et une vue
  « terminal » accessible via le bouton *Switch* du menu, avec des commandes
  interactives (help, about, skills, contact, neofetch, whoami...).
- Un CV au format PDF est téléchargeable depuis la page d'accueil.
- Mentions légales et politique de confidentialité : accessibles depuis le pied
  de page. Le site ne collecte aucune donnée personnelle et n'utilise aucun cookie.
`;

writeFileSync(join(root, 'public', 'llms-full.txt'), content, 'utf8');

console.log(`llms-full.txt généré (${content.length} caractères)`);
