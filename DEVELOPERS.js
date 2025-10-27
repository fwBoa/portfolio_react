// Guide de développement du Portfolio "Double Face"

/**
 * ARCHITECTURE DU PROJET
 * =====================
 * 
 * Le portfolio utilise une architecture modulaire basée sur React avec :
 * - Composants réutilisables
 * - État local géré avec useState
 * - Animations avec Framer Motion
 * - Styles avec TailwindCSS
 */

// ============================================
// STRUCTURE DES COMPOSANTS
// ============================================

/**
 * App.jsx
 * -------
 * Composant racine qui importe la page Home
 */

/**
 * pages/Home.jsx
 * --------------
 * Gère l'état global de l'application :
 * - isDevMode : booléen pour le mode actuel
 * - toggleMode : fonction pour basculer entre les modes
 * 
 * Easter eggs implémentés :
 * - Code Konami
 * - Triple clic
 * - Raccourci clavier (Ctrl/Cmd + Shift + D)
 * - Scroll rapide
 */

/**
 * components/Header.jsx
 * --------------------
 * Barre de navigation avec :
 * - Toggle switch pour basculer entre les modes
 * - Navigation adaptative selon le mode
 * - Animations au hover et au clic
 */

/**
 * components/ToggleFace.jsx
 * ------------------------
 * Wrapper pour les animations de transition
 * Utilise Framer Motion pour l'effet de flip 3D
 */

/**
 * components/Face.jsx
 * ----------------------------
 * Interface pour les recruteurs :
 * - Section À propos avec photo
 * - Galerie de projets
 * - Formulaire de contact
 * - Liens sociaux
 */

/**
 * components/DevFace.jsx
 * ---------------------
 * Interface pour les développeurs :
 * - ASCII art
 * - Stats techniques
 * - Affichage du code des projets
 * - Terminal interactif
 * - Stats GitHub
 */

/**
 * components/ProjectCard.jsx
 * -------------------------
 * Carte de projet avec design adaptatif
 * Props :
 * - project : objet contenant les données du projet
 * - isDevMode : booléen pour adapter le style
 * - delay : délai pour l'animation
 */

/**
 * components/CodeDisplay.jsx
 * -------------------------
 * Affichage du code avec coloration syntaxique
 * Utilise Prism.js pour la coloration
 * Fonctionnalité de copie dans le presse-papiers
 */

/**
 * components/Terminal.jsx
 * ----------------------
 * Terminal interactif avec :
 * - Historique des commandes
 * - Navigation avec flèches ↑↓
 * - Commandes personnalisées
 * - Auto-scroll
 */

// ============================================
// DONNÉES
// ============================================

/**
 * data/projects.js
 * ---------------
 * Contient le tableau des projets avec :
 * - id, title, description
 * - image, tags
 * - github, demo
 * - code (extrait de code)
 * - featured (booléen)
 * 
 * Pour ajouter un projet :
 * 1. Ajouter un objet dans le tableau
 * 2. Suivre la structure existante
 * 3. Mettre featured: true pour l'afficher en vedette
 */

/**
 * data/stats.js
 * ------------
 * Contient :
 * - techStats : statistiques techniques du site
 * - githubStats : statistiques GitHub
 * - terminalCommands : commandes du terminal
 * - easterEggs : configuration des easter eggs
 */

// ============================================
// STYLES
// ============================================

/**
 * styles/global.css
 * ----------------
 * Styles globaux avec :
 * - Directives Tailwind
 * - Animations personnalisées (flip, blink, matrix-fall)
 * - Scrollbar personnalisée
 * - Reset CSS
 */

/**
 * tailwind.config.js
 * -----------------
 * Configuration Tailwind avec :
 * - Couleurs personnalisées pour les deux modes
 * - Polices mono pour le mode dev
 * - Extensions du thème
 */

// ============================================
// ANIMATIONS
// ============================================

/**
 * Framer Motion est utilisé pour :
 * 
 * 1. Transitions de page (flip 3D)
 *    - initial={{ rotateY: 90, opacity: 0 }}
 *    - animate={{ rotateY: 0, opacity: 1 }}
 *    - exit={{ rotateY: -90, opacity: 0 }}
 * 
 * 2. Animations au scroll
 *    - initial="hidden"
 *    - whileInView="visible"
 *    - viewport={{ once: true }}
 * 
 * 3. Interactions
 *    - whileHover={{ scale: 1.05 }}
 *    - whileTap={{ scale: 0.95 }}
 */

// ============================================
// EASTER EGGS
// ============================================

/**
 * Code Konami
 * ----------
 * Séquence : ↑ ↑ ↓ ↓ ← → ← → B A
 * Effet : Active le mode développeur et affiche ASCII art
 * 
 * Implémentation :
 * - Listener sur keydown
 * - Compare la séquence de touches
 * - Réinitialise après détection
 */

/**
 * Triple Clic
 * ----------
 * Détecte 3 clics rapides (<500ms)
 * Affiche un message dans la console
 */

/**
 * Raccourci Clavier
 * ----------------
 * Ctrl/Cmd + Shift + D
 * Bascule instantanément entre les modes
 */

/**
 * Scroll Rapide
 * ------------
 * Détecte 5 scrolls rapides vers le bas
 * Bascule automatiquement le mode
 */

// ============================================
// COMMANDES TERMINAL
// ============================================

/**
 * help     - Liste des commandes
 * about    - Infos personnelles
 * skills   - Compétences techniques
 * projects - Liste des projets
 * contact  - Coordonnées
 * clear    - Efface le terminal
 * matrix   - Effet Matrix
 * snake    - Jeu Snake (à implémenter)
 * whoami   - Message fun
 * sudo     - Easter egg
 * 
 * Pour ajouter une commande :
 * 1. Ajouter dans terminalCommands (data/stats.js)
 * 2. Gérer dans executeCommand (components/Terminal.jsx)
 */

// ============================================
// PERSONNALISATION
// ============================================

/**
 * Couleurs
 * --------
 * Modifier dans tailwind.config.js :
 * - dev-dark : Fond mode développeur
 * - dev-accent : Couleur d'accentuation
 * - minimal-bg : Fond mode minimaliste
 * - minimal-text : Texte mode minimaliste
 */

/**
 * Informations personnelles
 * ------------------------
 * À modifier dans :
 * - components/Face.jsx (À propos, liens)
 * - data/stats.js (commande about, contact)
 * - components/DevFace.jsx (ASCII art)
 */

/**
 * Projets
 * -------
 * Modifier/ajouter dans data/projects.js
 * Structure obligatoire pour chaque projet
 */

// ============================================
// OPTIMISATION
// ============================================

/**
 * Performance
 * ----------
 * - Lazy loading des images
 * - Code splitting automatique (Vite)
 * - Animations GPU-accelerated (Framer Motion)
 * - Memoization si nécessaire
 */

/**
 * SEO
 * ---
 * - Balises meta dans index.html
 * - Balises alt sur les images
 * - Structure sémantique HTML
 * - Aria labels pour l'accessibilité
 */

/**
 * Accessibilité
 * ------------
 * - Contraste de couleurs suffisant
 * - Navigation au clavier
 * - ARIA labels sur les boutons
 * - Focus visible
 * - Responsive design
 */

// ============================================
// DÉPLOIEMENT
// ============================================

/**
 * Build de production
 * ------------------
 * npm run build
 * 
 * Crée le dossier 'dist' optimisé :
 * - Minification
 * - Tree-shaking
 * - Asset optimization
 * - Code splitting
 */

/**
 * Hébergement 
 * ---------------------
 * - Vercel (recommandé pour React)
 */

// ============================================
// ÉVOLUTIONS FUTURES
// ============================================

/**
 * Fonctionnalités à ajouter :
 * 
 * 1. Jeu Snake dans le terminal ( optionnel )
 * 2. API GitHub réelle pour les stats
 * 3. Blog intégré
 * 4. Mode sombre/clair pour la face minimaliste
 * 5. Animations Matrix plus complexes
 * 6. Système de notifications
 * 7. Formulaire de contact fonctionnel
 * 8. Multilangue (i18n)
 * 9. Analytics intégrés
 * 10. PWA (Progressive Web App)
 */

// ============================================
// DEBUGGING
// ============================================

/**
 * Console logs
 * -----------
 * Le projet inclut des logs dans la console :
 * - Message de bienvenue au chargement
 * - Détection des easter eggs
 * - Changements de mode
 * 
 * Pour désactiver en production :
 * Ajouter process.env.NODE_ENV === 'development' avant les console.log
 */

/**
 * React DevTools
 * -------------
 * Utilisez React DevTools pour :
 * - Inspecter la hiérarchie des composants
 * - Analyser les props et l'état
 * - Profiler les performances
 */

// ============================================
// TESTS (À implémenter)
// ============================================

/**
 * Tests unitaires recommandés :
 * - Vitest pour les tests
 * - React Testing Library pour les composants
 * 
 * Tests à créer :
 * - Basculement entre modes
 * - Commandes du terminal
 * - Affichage des projets
 * - Easter eggs
 */

// ============================================
// CONTRIBUTION
// ============================================

/**
 * Pour contribuer :
 * 
 * 1. Fork le projet
 * 2. Créer une branche (feature/nouvelle-fonctionnalite)
 * 3. Commit les changements
 * 4. Push vers la branche
 * 5. Ouvrir une Pull Request
 * 
 * Conventions de code :
 * - JSDoc pour documenter les fonctions
 * - Noms de variables explicites
 * - Commentaires pour la logique complexe
 * - Prettier/ESLint pour le formatage
 */

export default {
  version: '1.0.0',
  author: 'Jean-David Zamblezie',
  lastUpdate: '2025-10-14',
  status: 'Production Ready'
};
