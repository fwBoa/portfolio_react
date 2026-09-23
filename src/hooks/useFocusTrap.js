import { useEffect, useRef } from 'react';

/**
 * Piège de focus pour une couche plein écran (menu mobile, modale).
 *
 * Pourquoi c'est nécessaire : une couche qui recouvre la page ne la retire pas
 * du parcours clavier. Sans piège, la touche Tab finit par atteindre les liens
 * « derrière » la couche — invisibles à l'écran, mais bien focalisés. On croit
 * alors avoir perdu le focus, ou on active un lien qu'on ne voyait pas.
 *
 * Trois choses, et rien de plus :
 *
 * 1. Place le focus dans la couche à l'ouverture — sinon le focus reste sur
 *    l'élément déclencheur, derrière la couche.
 * 2. Fait cycler Tab et Maj+Tab entre le premier et le dernier élément.
 * 3. Rend le focus à l'élément déclencheur à la fermeture. Sans cela, le focus
 *    retombe sur <body> et la personne repart du début de la page.
 *
 * La touche Échap reste gérée par l'appelant : elle déclenche la fermeture, qui
 * à son tour fait retomber `active` à false et dénoue le piège.
 *
 * @param {boolean} active — true quand la couche est ouverte
 * @returns {React.RefObject} à poser sur l'élément qui contient la couche
 */
export function useFocusTrap(active) {
  const containerRef = useRef(null);
  // Mémorisé pour pouvoir y revenir : au moment de la fermeture, le focus a
  // déjà bougé, `document.activeElement` ne désigne plus le déclencheur.
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    triggerRef.current = document.activeElement;
    const container = containerRef.current;
    if (!container) return;

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    getFocusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      // Le cycle est assuré à la main aux deux extrémités : ailleurs, on laisse
      // le navigateur faire son travail normal.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus?.();
    };
  }, [active]);

  return containerRef;
}

export default useFocusTrap;
