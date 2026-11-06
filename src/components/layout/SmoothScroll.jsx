import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import { registerLenis, unregisterLenis } from '../../lib/smooth-scroll';
import 'lenis/dist/lenis.css';

/**
 * Défilement inertiel de la face publique.
 *
 * Lenis ne remplace pas le scroll natif : il lisse la molette et laisse le
 * navigateur gérer le clavier, les ancres et le tactile. Un seul rAF pour
 * toute la page, arrêté au démontage.
 *
 * En mode Dev et en mouvement réduit, on ne l'installe pas : le terminal garde
 * son défilement natif et l'utilisateur qui demande moins de mouvement n'a
 * aucun lissage à subir.
 */
const SmoothScroll = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;

    // Lenis ne sert qu'à la molette et au trackpad. Sur iPhone/iPad, le
    // défilement tactile est déjà natif : le lancer ajoutait un rAF permanent
    // et des mises à jour d'état dans la trace, sans aucun bénéfice.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    registerLenis(lenis);

    return () => {
      cancelAnimationFrame(frame);
      unregisterLenis(lenis);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
};

export default SmoothScroll;
