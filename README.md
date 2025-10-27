# Portfolio "Double Face" 🎭# React + Vite



Portfolio personnel innovant avec deux interfaces distinctes : une version minimaliste pour les recruteurs et une version développeur avec code, stats et terminal interactif.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FonctionnalitésCurrently, two official plugins are available:



### Face Minimaliste ✨- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- Design épuré et professionnel- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- Section "À propos" avec présentation

- Galerie de projets en vedette## React Compiler

- Formulaire de contact

- Liens vers les réseaux sociauxThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- Responsive et accessible

## Expanding the ESLint configuration

### Face Développeur 💻

- ASCII art personnaliséIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

- Statistiques techniques (build time, bundle size, etc.)
- Affichage du code source des projets avec coloration syntaxique
- Terminal interactif avec commandes personnalisées
- Statistiques GitHub
- Stack technique détaillée
- Dark mode automatique

## 🎮 Easter Eggs

Le portfolio contient plusieurs easter eggs cachés :

1. **Code Konami** : ↑ ↑ ↓ ↓ ← → ← → B A
2. **Triple clic** : Cliquez 3 fois rapidement n'importe où
3. **Raccourci clavier** : `Ctrl/Cmd + Shift + D` pour basculer entre les modes
4. **Scroll rapide** : Scrollez rapidement vers le bas 5 fois
5. **Commandes terminal** : Tapez `help` dans le terminal pour découvrir les commandes

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Framework CSS utility-first
- **Framer Motion** - Animations fluides
- **Prism.js** - Coloration syntaxique du code
- **React Icons** - Bibliothèque d'icônes

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Lint
npm run lint
```

## 📁 Structure du projet

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Barre de navigation
│   │   ├── ToggleFace.jsx       # Animation de transition
│   │   ├── Face.jsx   # Interface minimaliste
│   │   ├── DevFace.jsx          # Interface développeur
│   │   ├── ProjectCard.jsx      # Carte de projet
│   │   ├── CodeDisplay.jsx      # Affichage du code
│   │   └── Terminal.jsx         # Terminal interactif
│   ├── pages/
│   │   └── Home.jsx             # Page principale
│   ├── data/
│   │   ├── projects.js          # Données des projets
│   │   └── stats.js             # Statistiques techniques
│   ├── styles/
│   │   └── global.css           # Styles globaux
│   ├── App.jsx                  # Composant App
│   └── main.jsx                 # Point d'entrée
├── public/                      # Assets statiques
├── index.html                   # HTML de base
├── package.json                 # Dépendances
├── vite.config.js              # Configuration Vite
├── tailwind.config.js          # Configuration Tailwind
└── README.md                    # Documentation
```

## 🎨 Personnalisation

### Modifier vos informations

1. **Projets** : Éditez `src/data/projects.js`
2. **Stats** : Éditez `src/data/stats.js`
3. **Photo de profil** : Remplacez l'URL dans `src/components/Face.jsx`
4. **Liens sociaux** : Modifiez les URLs dans les composants

### Personnaliser les couleurs

Les couleurs sont définies dans `tailwind.config.js` :

```javascript
colors: {
  'dev-dark': '#0a0a0a',      // Fond mode développeur
  'dev-accent': '#00ff41',     // Couleur accent (vert Matrix)
  'minimal-bg': '#f8f9fa',     // Fond mode minimaliste
  'minimal-text': '#2c3e50',   // Texte mode minimaliste
}
```

## 🔧 Commandes du Terminal

Commandes disponibles dans le terminal interactif (mode développeur) :

- `help` - Liste des commandes
- `about` - Informations personnelles
- `skills` - Compétences techniques
- `projects` - Liste des projets
- `contact` - Coordonnées
- `clear` - Efface le terminal
- `matrix` - Active l'effet Matrix
- `whoami` - Qui suis-je ?
- `sudo` - Easter egg 😉

## 🌐 Déploiement

### Netlify / Vercel

```bash
npm run build
# Déployez le dossier 'dist'
```

## 📝 Bonnes pratiques implémentées

- ✅ Composants React réutilisables
- ✅ Hooks personnalisés
- ✅ Code commenté et documenté
- ✅ Responsive design
- ✅ Accessibilité (ARIA labels)
- ✅ Performance optimisée
- ✅ SEO friendly

## 👤 Auteur

**Jean-David Zamblezie**


---

⭐ N'oubliez pas de mettre une étoile si ce projet vous a été utile !

**Happy Coding!** 🚀
# portfolio_react
