// Statistiques techniques du portfolio
export const techStats = {
  buildTime: "2.3s", // temps de compilation 
  bundleSize: "245 KB", 
  components: 12,
  linesOfCode: 2847,
  technologies: [
    { name: "React", version: "18.3.1", logo: "⚛️" },
    { name: "Vite", version: "5.4.11", logo: "⚡" },
    { name: "TailwindCSS", version: "3.4.16", logo: "🎨" },
    { name: "Framer Motion", version: "11.18.0", logo: "🎬" },
    { name: "Prism.js", version: "1.29.0", logo: "📝" },
  ],
};

// Commandes disponibles pour le terminal
export const terminalCommands = {
  help: {
    description: "Affiche la liste des commandes disponibles",
    output: `Commandes disponibles :
  - help : Affiche cette aide
  - about : Informations sur moi
  - skills : Mes compétences techniques
  - projects : Liste des projets
  - contact : Mes coordonnées
  - clear : Efface le terminal
  - whoami : Qui suis-je ?
  - sudo : Essayez... 😉`
  },
  about: {
    description: "Informations personnelles",
    output: `Jean-David Zamblezie
Développeur web
Localisation : Paris, France
Expérience professionnelle : 1+ ans
`
  },
  skills: {
    description: "Compétences techniques",
    output: `Frontend:
   React, Next.js,
   TailwindCSS,
  
Backend:
  Node.js, Express
  Python,
  
Database:
  MongoDB, Supabase 
  
Tools:
    Git, Vite, Webpack`
  },
  projects: {
    description: "Liste des projets",
    output: `Projets :
    1. Mon portfolio personnel - Un site web qui présenter mes travaux et compétences avec un concept propre aux developpeurs.
    2. Un terminal interactif - Un terminal intégré au site qui m'a permie d'enrichir mes compétences en React.
    3. Gitemonplaisir - un site créé avec wordpress en vue de promouvoir un gite, thème personnalisé, plugins concus avec php.
    4. SEBI-Kids - une plateforme numérique dédiée à l’univers des enfants, proposant des contenus éducatifs, ludiques et interactifs dans un environnement sécurisé et adapté, développer en Nextjs.
    `
  },
  contact: {
    description: "Coordonnées",
    output: `Email : jeandavidzamblezie@outlook.fr
 GitHub : github.com/fwboa
 https://www.linkedin.com/in/jean-david-zamblezie-84410b258/
`

  },
  whoami: {
    description: "Identité",
    output: "Je fais pas mal de choses... mais surtout du code"
  },
  sudo: {
    description: "Super utilisateur",
    output: "Nice try! il n'y a pas les permissions root 😄"
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
    message: "Triple-clic détecté ! Easter egg trouvé !",
    action: "confetti"
  }
];
