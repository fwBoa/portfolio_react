import { useState, useEffect } from 'react';

/**
 * Repère la section visible pendant le défilement.
 *
 * L'en-tête est partagé par toutes les pages, mais les sections qu'il met en
 * évidence (`#about`, `#skills`, `#contact`) n'existent que sur l'accueil.
 * Le calcul reste donc dans la page, qui sait ce qu'elle contient, et
 * l'en-tête se contente de recevoir la valeur.
 *
 * On parcourt les sections de la fin vers le début et on retient la dernière
 * dont le haut est passé au-dessus du seuil : c'est la section courante.
 *
 * @param {string[]} ids        Identifiants des sections à surveiller.
 * @param {number}   [offset]   Marge sous l'en-tête, en pixels.
 * @returns {string|null}       Identifiant de la section active.
 */
export function useScrollSpy(ids, offset = 150) {
  const [activeId, setActiveId] = useState(ids[0] ?? null);

  // La liste est recréée à chaque rendu ; on la fige pour ne pas relancer
  // l'écouteur à chaque fois.
  const key = ids.join('|');

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter((entry) => entry.element);

    if (sections.length === 0) return;

    const onScroll = () => {
      const scrollPos = window.scrollY + offset;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].element.offsetTop <= scrollPos) {
          setActiveId(sections[i].id);
          return;
        }
      }
      setActiveId(sections[0].id);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [key, offset]);

  return activeId;
}

export default useScrollSpy;
