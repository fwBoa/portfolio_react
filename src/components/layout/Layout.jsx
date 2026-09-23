import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

/**
 * Ossature commune à toutes les pages.
 *
 * L'accueil, la liste des notes et chaque note partagent le même en-tête, le
 * même pied de page et le même fond : le blog se lit comme une partie du site,
 * pas comme une annexe. C'est aussi ce qui garantit que les mentions légales
 * sont joignables depuis n'importe quelle page.
 *
 * Le fond `os-bg` et la couleur de texte de base sont posés ici, une fois :
 * les pages se concentrent sur leur contenu.
 *
 * `data-dev` expose le mode courant au CSS. Sans cet attribut, impossible
 * d'assombrir les contours de focus en mode Dev : les sélecteurs CSS ne
 * remontent pas jusqu'à une prop React, et le teal du site (2,4:1 sur le fond
 * sombre) y serait invisible.
 *
 * `isDevMode` et `toggleMode` ne sont transmis que par l'accueil — les pages du
 * blog n'ont pas de vue terminal, la bascule ne leur est donc pas proposée.
 *
 * Le lien d'évitement est le premier élément focusable de la page. Sans lui, une
 * personne au clavier doit traverser le logo et les quatre entrées du menu à
 * chaque chargement avant d'atteindre le contenu — sur chaque page. Il est
 * masqué visuellement jusqu'à ce qu'il reçoive le focus.
 */
const Layout = ({ children, isDevMode = false, toggleMode, activeSection = null }) => (
  <div
    data-dev={isDevMode}
    className={`min-h-screen flex flex-col ${
      isDevMode ? 'bg-dev-bg text-dev-text' : 'bg-os-bg text-os-text'
    }`}
  >
    <a href="#main" className="skip-link">
      Aller au contenu
    </a>
    <SiteHeader
      isDevMode={isDevMode}
      toggleMode={toggleMode}
      activeSection={activeSection}
    />
    {children}
    <SiteFooter isDevMode={isDevMode} />
  </div>
);

export default Layout;
