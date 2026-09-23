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
 * `isDevMode` et `toggleMode` ne sont transmis que par l'accueil — les pages du
 * blog n'ont pas de vue terminal, la bascule ne leur est donc pas proposée.
 */
const Layout = ({ children, isDevMode = false, toggleMode, activeSection = null }) => (
  <div
    className={`min-h-screen flex flex-col ${
      isDevMode ? 'bg-dev-bg text-dev-text' : 'bg-os-bg text-os-text'
    }`}
  >
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
