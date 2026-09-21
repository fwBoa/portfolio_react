import { site } from './site';
import { skillGroups } from './skills';

// Sortie de la commande `skills` générée depuis la source unique
const skillsOutput = skillGroups
  .map((group) => `${group.title}\n  ${group.items.join(' · ')}`)
  .join('\n\n');

// Commandes disponibles pour le terminal
export const terminalCommands = {
  help: {
    description: "Affiche la liste des commandes disponibles",
    output: `Commandes disponibles :
  help       Affiche cette aide
  about      À propos de moi
  skills     Mes compétences détaillées
  projects   Projets réalisés
  contact    Coordonnées
  ls         Liste les fichiers
  cd         Change de répertoire
  pwd        Répertoire actuel
  clear      Efface le terminal
  whoami     Identité
  neofetch   Informations système
  uptime     Temps de fonctionnement
  date       Date et heure actuelles
  sudo       Essayez... 😉`
  },
  about: {
    description: "Informations personnelles",
    output: `${site.name}
━━━━━━━━━━━━━━━━━━━━━━
Développeur web full stack spécialisé en
automatisation IA et ingénierie agentique.

Localisation : ${site.location}
Expérience    : 1+ an
Statut        : En alternance / Freelance

Stack principale :
  Frontend  → React, Next.js, TypeScript
  Backend   → Node.js, Python, PostgreSQL
  AI/Auto   → LangChain, OpenAI, n8n, MCP
  DevOps    → Git, Docker, Vercel, Supabase`
  },
  skills: {
    description: "Compétences techniques",
    output: skillsOutput
  },
  projects: {
    description: "Liste des projets",
    output: `Projets :
  1. Airspace        Plateforme de gestion collaborative (Next.js)
  2. Terminal        Terminal interactif intégré (React)
  3. Gîte Montplaisir Site WordPress sur mesure
  4. SEBI-Kids       Plateforme éducative pour enfants (Next.js)`
  },
  contact: {
    description: "Coordonnées",
    output: `Email    : ${site.email}
GitHub   : ${site.githubLabel}
LinkedIn : ${site.linkedinLabel}
Site     : zamblezie.fr`
  },
  whoami: {
    description: "Identité",
    output: "jean-david (web developer, ai automation, agentic engineer)"
  },
  sudo: {
    description: "Super utilisateur",
    output: "sudo: command not found 😄\nTu n'as pas les permissions root ici."
  },
  ls: {
    description: "Liste les fichiers",
    output: `cv.pdf              skills.md         contact.json
projects/           assets/           README.md`
  },
  uptime: {
    description: "Temps de fonctionnement",
    output: "Uptime: ∞ (le portfolio tourne 24/7 sur Vercel)"
  },
  date: {
    description: "Date actuelle",
    output: () => new Date().toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  },
  cd: {
    description: "Change directory",
    output: "cd: access denied — this is a read-only portfolio filesystem 😄"
  },
  pwd: {
    description: "Print working directory",
    output: "/home/jean-david/portfolio"
  },
  theme: {
    description: "Thème actuel",
    output: "Thème actuel : Monochrome Teal\nDev mode   : Prometheus OS (green-on-black)"
  },
  clear: {
    description: "Efface le terminal",
    output: ""
  }
};

