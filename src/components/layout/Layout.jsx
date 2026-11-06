import { FaCode } from 'react-icons/fa';
import SiteHeader from './SiteHeader';
import SiteHeaderFusion from './SiteHeaderFusion';
import SiteFooter from './SiteFooter';
import SmoothScroll from './SmoothScroll';

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
const Layout = ({
  children,
  isDevMode = false,
  toggleMode,
  activeSection = null,
  notesHref = '/#notes',
}) => (
  <div
    data-dev={isDevMode}
    className={`min-h-screen flex flex-col ${
      isDevMode ? 'bg-dev-bg text-dev-text' : 'bg-os-bg text-os-text'
    }`}
  >
    <a href="#main" className="skip-link">
      Aller au contenu
    </a>
    {!isDevMode && <SmoothScroll />}
    {isDevMode ? (
      <SiteHeader toggleMode={toggleMode} />
    ) : (
      <SiteHeaderFusion activeSection={activeSection} notesHref={notesHref} />
    )}
    {children}
    <SiteFooter isDevMode={isDevMode} />
    {!isDevMode && toggleMode && <DevSwitch toggleMode={toggleMode} />}
  </div>
);

/**
 * Entrée du mode Dev, séparée de la navigation. C'est le seul contrôle qui
 * ouvre le terminal : le tiroir et la capsule n'en portent pas la commande.
 */
function DevSwitch({ toggleMode }) {
  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label="Switch, passer en mode Dev"
      title="Passer en mode Dev"
      className="dev-switch fixed bottom-6 right-6 z-[9995] inline-flex min-h-11 items-center gap-2 rounded-full border border-os-border bg-white px-4 text-xs font-medium text-os-reading shadow-[0_20px_50px_-30px_rgba(45,107,107,0.6)] transition-[color,background-color,border-color,transform] duration-300 hover:border-os-text hover:text-os-text active:scale-95"
    >
      <FaCode size={11} aria-hidden="true" />
      {/* Icône seule sur mobile : moins d'occlusion sur les cartes. */}
      <span className="hidden sm:inline">Switch</span>
    </button>
  );
}

export default Layout;
