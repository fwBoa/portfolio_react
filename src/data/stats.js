// Statistiques techniques du portfolio
export const techStats = {
  buildTime: "2.3s",
  bundleSize: "245 KB",
  components: 12,
  linesOfCode: 1936,
  technologies: [
    { name: "React", logo: "⚛️", version: "19" },
    { name: "Vite", logo: "⚡", version: "7" },
    { name: "TailwindCSS", logo: "🎨", version: "3" },
    { name: "Framer Motion", logo: "🎬", version: "12" },
    { name: "Prism.js", logo: "📝", version: "1" },
  ],
};

// Commandes disponibles pour le terminal
export const terminalCommands = {
  help: {
    description: "Affiche la liste des commandes disponibles",
    output: `Commandes disponibles :
  - help       : Affiche cette aide
  - about      : Informations sur moi
  - skills     : Mes compétences techniques
  - projects   : Liste des projets
  - contact    : Mes coordonnées
  - clear      : Efface le terminal
  - whoami     : Qui suis-je ?
  - neofetch   : Informations système (ASCII)
  - matrix     : Active la pluie Matrix
  - theme      : Thème actuel
  - sudo       : Essayez... 😉`
  },
  about: {
    description: "Informations personnelles",
    output: `Jean-David Zamblezie
Développeur web full stack
Localisation : Paris, France
Expérience : 1+ an
Stack : React, Next.js, TypeScript, Node.js`
  },
  skills: {
    description: "Compétences techniques",
    output: `Frontend:
  React, Next.js, TypeScript, TailwindCSS

Backend:
  Node.js, Express, Python

Database:
  PostgreSQL, MongoDB, Supabase

Tools:
  Git, Vite, Docker, Figma`
  },
  projects: {
    description: "Liste des projets",
    output: `Projets :
  1. Airspace        — Plateforme de gestion collaborative (Next.js)
  2. Terminal        — Terminal interactif intégré (React)
  3. Gîte Montplaisir — Site WordPress sur mesure
  4. SEBI-Kids       — Plateforme éducative pour enfants (Next.js)`
  },
  contact: {
    description: "Coordonnées",
    output: `Email  : jeandavidzamblezie@outlook.fr
GitHub : github.com/fwboa
LinkedIn: linkedin.com/in/jean-david-zamblezie`
  },
  whoami: {
    description: "Identité",
    output: "root (just kidding — je fais pas mal de choses, mais surtout du code)"
  },
  sudo: {
    description: "Super utilisateur",
    output: "sudo: command not found 😄\nNice try, mais il n'y a pas les permissions root ici."
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
