import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

/**
 * SkillStack — liste de compétences en pastilles.
 *
 * Deux niveaux d'animation, volontairement discrets :
 *
 * 1. Entrée en cascade : chaque pastille monte légèrement après la précédente.
 *    L'orchestration est portée par le conteneur (staggerChildren) plutôt que
 *    par des délais codés sur chaque élément.
 *
 * 2. Aura magnétique : au survol, la pastille la plus proche du curseur s'élève
 *    et son contour se teinte, puis l'effet décroît avec la distance. Réservé
 *    aux pointeurs précis (souris, trackpad) — désactivé au tactile et si
 *    l'utilisateur a demandé moins d'animations.
 *
 * Les positions sont relevées à l'entrée du curseur et non au montage : à ce
 * moment les pastilles ont terminé leur animation d'entrée et leur position est
 * donc définitive. Elles sont stockées en coordonnées de page pour rester
 * valables quand on fait défiler la page.
 *
 * Aucun useEffect sur `pointermove` ne déclenche de rendu React : les valeurs
 * passent par useMotionValue, ce qui évite de reconstruire l'arbre à chaque
 * déplacement de souris.
 */

const AURA_RADIUS = 170; // px — rayon d'influence autour du curseur
const MAX_LIFT = 0.055; // amplitude d'agrandissement au plus près

const chipListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.1 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
  },
};

const Chip = ({ item, index, pointerX, pointerY, centers, magnetic, registerRef }) => {
  // 0 = hors d'influence, 1 = curseur au centre de la pastille
  const proximity = useTransform([pointerX, pointerY], ([x, y]) => {
    if (!magnetic) return 0;
    const center = centers.current[index];
    if (!center) return 0;
    const distance = Math.hypot(x - center.x, y - center.y);
    return distance >= AURA_RADIUS ? 0 : 1 - distance / AURA_RADIUS;
  });

  const scale = useTransform(proximity, [0, 1], [1, 1 + MAX_LIFT]);
  const borderColor = useTransform(proximity, [0, 1], ['#d0e0e0', '#2d6b6b']);
  const backgroundColor = useTransform(proximity, [0, 1], ['#ffffff', '#f0f5f5']);

  return (
    <motion.li
      ref={(el) => registerRef(index, el)}
      variants={chipVariants}
      style={{ scale, borderColor, backgroundColor }}
      className="inline-flex items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium text-os-body sm:px-4 sm:py-2 sm:text-sm"
    >
      {item}
    </motion.li>
  );
};

const SkillStack = ({ items }) => {
  const chipRefs = useRef([]);
  const centers = useRef([]);
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const [magnetic, setMagnetic] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Rappel de ref stable, passé aux pastilles.
  const registerRef = useCallback((index, el) => {
    chipRefs.current[index] = el;
  }, []);

  // L'aura n'a de sens qu'avec une souris ou un trackpad, et pas si
  // l'utilisateur a demandé la réduction des animations.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setMagnetic(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [prefersReducedMotion]);

  // Relever la position de chaque pastille, en coordonnées de page.
  const measure = useCallback(() => {
    centers.current = chipRefs.current.map((el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      };
    });
  }, []);

  // Les pastilles se réorganisent quand la fenêtre change de largeur :
  // on relève à nouveau leurs positions et on coupe l'aura en cours.
  useEffect(() => {
    const onResize = () => {
      measure();
      pointerX.set(-9999);
      pointerY.set(-9999);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure, pointerX, pointerY]);

  const handlePointerMove = (event) => {
    if (!magnetic) return;
    pointerX.set(event.clientX + window.scrollX);
    pointerY.set(event.clientY + window.scrollY);
  };

  const handlePointerLeave = () => {
    pointerX.set(-9999);
    pointerY.set(-9999);
  };

  return (
    <motion.ul
      variants={chipListVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      onPointerEnter={measure}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="flex flex-wrap gap-2 sm:gap-2.5"
    >
      {items.map((item, index) => (
        <Chip
          key={item}
          item={item}
          index={index}
          pointerX={pointerX}
          pointerY={pointerY}
          centers={centers}
          magnetic={magnetic}
          registerRef={registerRef}
        />
      ))}
    </motion.ul>
  );
};

export default SkillStack;
