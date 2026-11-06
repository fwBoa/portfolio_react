/**
 * Contrôle du défilement Lenis depuis les couches qui bloquent la page
 * (tiroir mobile, modale légale). Lenis écrit le scroll au niveau de la
 * fenêtre : `body { overflow: hidden }` ne suffit pas à l'arrêter.
 *
 * Une seule instance vit sur la face publique. En mode Dev ou en mouvement
 * réduit, elle est absente et ces fonctions ne font rien.
 */
let instance = null;

export function registerLenis(lenis) {
  instance = lenis;
}

export function unregisterLenis(lenis) {
  if (instance === lenis) instance = null;
}

export function stopLenis() {
  instance?.stop();
}

export function startLenis() {
  instance?.start();
}
