import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FADE_MS = 280;
// La sortante est masquée après le fondu, puis retirée un peu plus tard :
// sur iOS, un retrait immédiat réaffichait sa couche une frame en pleine
// opacité (le flash blanc observé en revenant du terminal).
const HIDE_MS = FADE_MS + 80;
const REMOVE_MS = FADE_MS + 160;

/**
 * ToggleFace — fondu simultané entre la face publique et le terminal.
 *
 * Les deux faces occupent la même cellule de grille pendant le fondu. La
 * sortante reste dans le flux, mais devient `inert` et `aria-hidden` : elle
 * ne reçoit plus de clic ni de focus. Contrairement à `AnimatePresence`, le
 * démontage est différé (voir HIDE_MS / REMOVE_MS) pour éviter le flash.
 *
 * Aucune transformation permanente sur le conteneur : le `position: sticky`
 * des cartes de compétences n'a pas de containing block parasite.
 */
const ToggleFace = ({ isDevMode, faces }) => {
  const key = isDevMode ? 'dev' : 'public';
  const [layers, setLayers] = useState([{ key, hidden: false, fresh: false }]);

  // Première frame après la bascule : la nouvelle face est déjà rendue,
  // l'effet ne fait que l'ajouter à la liste et programmer le retrait.
  const rendered = layers.some((layer) => layer.key === key)
    ? layers
    : [...layers, { key, hidden: false, fresh: true }];

  useEffect(() => {
    setLayers((prev) => {
      if (prev.length === 1 && prev[0].key === key) return prev;

      return [
        ...prev
          .filter((layer) => layer.key !== key)
          .map((layer) => ({ ...layer, fresh: false })),
        { key, hidden: false, fresh: false },
      ];
    });

    const hide = window.setTimeout(() => {
      setLayers((prev) =>
        prev.map((layer) => (layer.key === key ? layer : { ...layer, hidden: true })),
      );
    }, HIDE_MS);

    const remove = window.setTimeout(() => {
      setLayers((prev) => prev.filter((layer) => layer.key === key));
    }, REMOVE_MS);

    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(remove);
    };
  }, [key]);

  return (
    <div className="grid w-full">
      {rendered.map((layer) => (
        <motion.div
          key={layer.key}
          initial={layer.fresh ? { opacity: 0 } : false}
          animate={{ opacity: layer.key === key ? 1 : 0 }}
          transition={{ duration: FADE_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }}
          inert={layer.key !== key}
          aria-hidden={layer.key !== key ? true : undefined}
          data-face-active={layer.key === key ? 'true' : 'false'}
          className="col-start-1 row-start-1 min-w-0 w-full self-start"
          style={{
            willChange: layer.hidden ? 'auto' : 'opacity',
            visibility: layer.hidden ? 'hidden' : 'visible',
          }}
        >
          {faces[layer.key]}
        </motion.div>
      ))}
    </div>
  );
};

export default ToggleFace;
