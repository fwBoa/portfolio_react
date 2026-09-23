import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { site, LEGAL_LAST_UPDATED } from '../../data/site';
import { legalSections, privacySections } from '../../data/legal';

/**
 * Pied de page du site, partagé par toutes les pages.
 *
 * Il porte aussi l'accès aux mentions légales et à la politique de
 * confidentialité : ces informations doivent rester joignables depuis
 * n'importe quelle page (obligation LCEN art. 6-III), pas seulement depuis
 * l'accueil. Le pied de page et la modale forment donc un seul composant —
 * le bouton et ce qu'il ouvre ne peuvent pas se désynchroniser.
 *
 * Une variante `isDevMode` existe parce que l'accueil a deux mises en forme
 * (page claire et terminal). Sans elle, la vue terminal finissait avec un
 * pied de page clair, ou avec deux pieds de page. Une seule structure, deux
 * habillages : le contenu et les obligations restent identiques.
 */

const legalTabs = [
  { id: 'legal', label: 'Mentions légales', sections: legalSections },
  { id: 'privacy', label: 'Confidentialité', sections: privacySections },
];

const SiteFooter = ({ isDevMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('legal');

  const activeTab = legalTabs.find((tab) => tab.id === activeId) ?? legalTabs[0];

  // Fermeture au clavier + blocage du défilement d'arrière-plan
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const openLegal = (tab) => {
    setActiveId(tab);
    setIsOpen(true);
  };

  return (
    <>
      {isDevMode ? (
        /* Variante terminal : mêmes informations, mise en forme mono. */
        <footer className="px-5 sm:px-10 lg:px-20 xl:px-24 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-[1400px] mx-auto pt-6 border-t border-dev-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs text-dev-muted">
                © {new Date().getFullYear()} {site.name}
              </span>
              <span className="text-[10px] sm:text-xs text-dev-muted">
                jean-david@portfolio:~$ exit → logout
              </span>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="px-5 sm:px-10 lg:px-20 xl:px-24 py-10 sm:py-14 lg:py-20 border-t border-os-border bg-os-surface/30">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12">
              <div className="space-y-4">
                <p className="text-os-text text-xl sm:text-2xl lg:text-3xl font-display font-bold leading-tight">
                  Jean-David
                  <br />
                  Zamblezie
                </p>
                <p className="text-os-body text-sm">
                  © {new Date().getFullYear()} — Tous droits réservés.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
                >
                  GitHub
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
                >
                  LinkedIn
                </a>
                <button
                  onClick={() => openLegal('privacy')}
                  className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
                >
                  Confidentialité
                </button>
                <button
                  onClick={() => openLegal('legal')}
                  className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
                >
                  Mentions légales
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* ===== MODALE LÉGALE ===== */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="legal-modal"
                className="fixed inset-0 z-[9999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 bg-os-text/20 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="legal-modal-title"
                  className="absolute inset-4 sm:inset-6 lg:inset-auto lg:top-20 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl bg-white border border-os-text rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
                >
                  <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-os-border">
                    <h2 id="legal-modal-title" className="sr-only">
                      Informations légales
                    </h2>
                    <div
                      role="tablist"
                      aria-label="Informations légales"
                      className="flex items-center gap-1"
                    >
                      {legalTabs.map((tab) => {
                        const isActive = tab.id === activeId;
                        return (
                          <button
                            key={tab.id}
                            role="tab"
                            id={`legal-tab-${tab.id}`}
                            aria-selected={isActive}
                            aria-controls={`legal-panel-${tab.id}`}
                            onClick={() => setActiveId(tab.id)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium transition-colors duration-300 ${
                              isActive
                                ? 'bg-os-surface text-os-text'
                                : 'text-os-muted hover:text-os-text'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-os-border flex items-center justify-center text-os-muted hover:border-os-text hover:text-os-text transition-all duration-300 flex-shrink-0"
                      aria-label="Fermer"
                    >
                      <FaTimes size={13} />
                    </button>
                  </div>

                  <div
                    id={`legal-panel-${activeTab.id}`}
                    role="tabpanel"
                    aria-labelledby={`legal-tab-${activeTab.id}`}
                    className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8"
                  >
                    {activeTab.sections.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-sm font-bold mb-2 sm:mb-3 text-os-text">
                          {section.title}
                        </h3>
                        <p className="text-os-body text-sm leading-relaxed whitespace-pre-line">
                          {section.body}
                        </p>
                      </div>
                    ))}
                    <div className="pt-3 sm:pt-4 border-t border-os-border">
                      <p className="text-xs text-os-muted">
                        Dernière mise à jour : {LEGAL_LAST_UPDATED}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 py-3 sm:py-4 border-t border-os-border flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 bg-os-text text-white rounded-lg text-sm font-medium hover:bg-os-muted transition-colors duration-300"
                    >
                      Fermer
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default SiteFooter;
