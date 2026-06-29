// Statistiques techniques du portfolio
export const techStats = {
  buildTime: "1.2s",
  bundleSize: "245 KB",
  components: 14,
  linesOfCode: 2100,
  technologies: [
    { name: "React", logo: "⚛️", version: "19" },
    { name: "Vite", logo: "⚡", version: "7" },
    { name: "TailwindCSS", logo: "🎨", version: "3" },
    { name: "Framer Motion", logo: "🎬", version: "12" },
  ],
};

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
    output: `Jean-David Zamblezie
━━━━━━━━━━━━━━━━━━━━━━
Développeur web full stack spécialisé en
automatisation IA et ingénierie agentique.

Localisation : Paris, France
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
    output: `Développement Web
  React · Next.js · TypeScript · Tailwind CSS · Node.js · Vite

IA & Automatisation
  Python · LangChain · OpenAI API · n8n · MCP · Agentic Workflows

Infrastructure & Design
  Git · Docker · Figma · PostgreSQL · Supabase · Vercel`
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
    output: `Email    : jeandavidzamblezie@outlook.fr
GitHub   : github.com/fwboa
LinkedIn : linkedin.com/in/jean-david-zamblezie
Site     : jean-david-zamblezie.vercel.app`
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

// Easter eggs
export const easterEggs = [
  {
    trigger: "konami",
    code: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"],
    message: "Code Konami activé !",
    action: "retro-mode"
  },
  {
    trigger: "triple-click",
    message: "Triple-clic détecté !",
    action: "confetti"
  }
];
