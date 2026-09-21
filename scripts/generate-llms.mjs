/**
 * Génère llms-full.txt — la version markdown complète du portfolio,
 * destinée aux agents IA qui ne rendent pas le JavaScript.
 *
 * Le contenu est dérivé de src/data/ pour rester synchronisé avec le site :
 * une modification des compétences ou des coordonnées se propage automatiquement.
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
