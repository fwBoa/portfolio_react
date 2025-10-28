// Liste des projets du portfolio
import sebiImg from '../assets/Img/SEBI.png';
import airspaceImg from '../assets/Img/airspace.png';
import giteImg from '../assets/Img/Gitmonplaisir.png';
import terminalImg from '../assets/Img/terminal.png'; 

export const projects = [
  {
    id: 1,
    title: "Airspace",
    description: "Application web moderne de gestion d'espace de travail collaboratif. Développée avec les dernières technologies web, cette plateforme permet aux équipes de gérer leurs projets, partager des ressources et collaborer efficacement en temps réel. Interface intuitive et responsive adaptée à tous les appareils.",
    shortDescription: "Plateforme de gestion collaborative",
    image: airspaceImg,
    tags: ["Next.js", "TailwindCSS", "Vercel"],
    github: "",
    demo: "https://airespace.vercel.app/",
    featured: true,
    code: ``
  },
  {
    id: 2,
    title: "Terminal Interactif",
    description: "Un terminal intégré au portfolio qui m'a permis d'enrichir mes compétences en React. Terminal fonctionnel avec navigation par flèches, historique de commandes, auto-complétion et commandes personnalisées (help, about, skills, projects, contact). Interface inspirée des terminaux Linux/Unix. ",
    shortDescription: "Terminal React avec commandes personnalisées, accessible via le dev mode",
    image: terminalImg,
    tags: ["React", "Hooks", "CSS", "Terminal UI"],
    github: "",
    demo: "",
    featured: true,
    code: ``
  },
  {
    id: 3,
    title: "Gîte Montplaisir",
    description: "Site web créé avec WordPress pour promouvoir un gîte rural. Développement d'un thème personnalisé sur mesure et création de plugins personnalisés en PHP pour répondre aux besoins spécifiques du client (système de réservation, galerie photos, gestion des disponibilités). Optimisation SEO et responsive design.",
    shortDescription: "Site WordPress pour un gîte avec thème et plugin customisé",
    image: giteImg,
    tags: ["WordPress", "PHP", "MySQL",],
    github: "",
    demo: "https://www.gitemontplaisir.com/",
    featured: true,
    code: ``
  },
  {
    id: 4,
    title: "SEBI-Kids",
    description: "Plateforme numérique dédiée à l'univers des enfants, proposant des contenus éducatifs, ludiques et interactifs dans un environnement sécurisé et adapté. Développée avec Next.js pour optimiser les performances et le SEO, cette application inclut des jeux éducatifs, des vidéos, des activités créatives et un système de suivi parental.",
    shortDescription: "Plateforme éducative pour enfants",
    image: sebiImg,
    tags: ["Next.js", "Tailwind"],
    github: "",
    demo: "https://sebi-kids.vercel.app/",
    featured: true,
    code: `// a remplir`
  }
];

