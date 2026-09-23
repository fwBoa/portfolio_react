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
 * Deux précautions, qui font toute la différence en défilement rapide :
 *
 * 1. Les positions sont mesurées **une fois** à l'installation, puis à chaque
 *    redimensionnement. La version précédente lisait `element.offsetTop` à
 *    chaque événement de défilement — soit une lecture de mise en page forcée
 *    par frame, le navigateur devant recalculer la géométrie pour répondre.
 *
 *    Les hauteurs changent après le premier rendu, parce que le chargement des
 *    polices décale le texte. `document.fonts.ready` redonne donc une mesure
 *    juste une fois les polices arrivées.
 *
 * 2. L'état n'est réécrit que lorsque la section **change**. La version
 *    précédente réécrivait la valeur à chaque frame : React écartait le rendu
 *    pour une valeur identique, mais il fallait tout de même passer par sa
 *    mécanique de mise à jour à chaque événement.
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
    const idList = key.split('|');
    let tops = [];

    const measure = () => {
      tops = idList
        .map((id) => {
          const element = document.getElementById(id);
          return element ? { id, top: element.offsetTop } : null;
        })
        .filter(Boolean);
    };

    // Retenu hors du rendu : c'est la comparaison qui évite la mise à jour.
    let current = null;

    const update = () => {
      if (tops.length === 0) return;

      const scrollPos = window.scrollY + offset;
      let found = tops[0].id;

      for (let i = tops.length - 1; i >= 0; i--) {
        if (tops[i].top <= scrollPos) {
          found = tops[i].id;
          break;
        }
      }

      if (found !== current) {
        current = found;
        setActiveId(found);
      }
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Les polices arrivent après le premier rendu et déplacent les sections.
    // Une seule remesure suffit, une fois qu'elles sont là.
    if (document.fonts?.ready) {
      document.fonts.ready.then(onResize).catch(() => {});
    }

    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
    };
  }, [key, offset]);

  return activeId;
}

export default useScrollSpy;
