import { useState, useEffect } from 'react';
import { FaLinkedinIn, FaLink, FaCheck, FaWhatsapp } from 'react-icons/fa';
import { site } from '../../data/site';

/**
 * Partage d'une note.
 *
 * Deux chemins, dans cet ordre :
 *
 * 1. Sur mobile, le partage natif du système (`navigator.share`) — il ouvre la
 *    feuille du téléphone, où sont déjà les applications que la personne
 *    utilise. C'est meilleur que n'importe quelle liste qu'on écrirait.
 * 2. Sinon, des liens explicites. Les intentions de partage de LinkedIn, X et
 *    WhatsApp sont de simples URL : aucune bibliothèque, aucun script tiers,
 *    aucune donnée envoyée à ces plateformes tant qu'on ne clique pas.
 *
 * Le bouton « Copier le lien » est toujours là : c'est souvent ce qu'on veut
 * pour coller dans une conversation interne.
 *
 * Les icônes reprennent le cercle bordé de la section contact du portfolio —
 * même vocabulaire, pas un nouveau langage visuel.
 */

const BUTTON =
  'w-10 h-10 rounded-full border border-os-border flex items-center justify-center ' +
  'text-os-muted hover:border-os-text hover:text-os-text hover:bg-os-text ' +
  'hover:[&>svg]:text-white transition-all duration-300';

/** Logo X : absent de react-icons/fa, donc tracé ici. */
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
  </svg>
);

const ShareNote = ({ post }) => {
  const [copied, setCopied] = useState(false);
  // Repli quand le presse-papiers est refusé : on affiche le lien, à portée de
  // sélection. `window.prompt` serait plus court mais il est bloquant, laid, et
  // refusé par certains environnements (aperçus intégrés, navigateurs durcis).
  const [showFallback, setShowFallback] = useState(false);

  // Le lien est reconstruit depuis le slug plutôt que lu dans
  // `window.location` : la valeur est alors la même au build et dans le
  // navigateur, donc l'hydratation ne peut pas diverger.
  const url = `${site.url}/blog/${post.slug}`;
  const text = post.title;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const [canShareNatively, setCanShareNatively] = useState(false);
  useEffect(() => {
    // Détecté après montage : `navigator` n'existe pas au build.
    setCanShareNatively(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const targets = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <FaLinkedinIn size={14} /> },
    { label: 'X', href: `https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`, icon: <XIcon /> },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`, icon: <FaWhatsapp size={15} /> },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowFallback(false);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission, navigateur
      // durci) : on montre le lien plutôt que d'échouer en silence.
      setShowFallback(true);
    }
  };

  const shareNatively = async () => {
    try {
      await navigator.share({ title: text, text: post.summary ?? '', url });
    } catch {
      // Annulation par la personne : rien à signaler.
    }
  };

  return (
    <div className="max-w-[68ch] mx-auto">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-os-muted">
          Partager
        </span>

        <div className="flex items-center gap-2">
          {canShareNatively && (
            <button onClick={shareNatively} className={BUTTON} aria-label="Partager">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2v13" />
                <path d="m8 6 4-4 4 4" />
                <path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
              </svg>
            </button>
          )}

          {targets.map((target) => (
            <a
              key={target.label}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className={BUTTON}
              aria-label={`Partager sur ${target.label}`}
            >
              {target.icon}
            </a>
          ))}

          <button onClick={copy} className={BUTTON} aria-label="Copier le lien">
            {copied ? <FaCheck size={13} /> : <FaLink size={13} />}
          </button>
        </div>

        {/* Région annoncée aux lecteurs d'écran : le changement d'icône seul
            ne dit rien à qui ne voit pas l'écran. */}
        <span aria-live="polite" className="text-[11px] text-os-muted">
          {copied ? 'Lien copié' : ''}
        </span>
      </div>

      {/* Repli : le lien est affiché et sélectionnable d'un clic. */}
      {showFallback && (
        <div className="mt-3">
          <label htmlFor="share-url" className="sr-only">
            Adresse de la note
          </label>
          <input
            id="share-url"
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
            className="w-full px-3 py-2 text-xs text-os-body bg-os-surface border border-os-border rounded-lg select-all"
          />
          <p className="mt-1.5 text-[11px] text-os-muted">
            Sélectionnez puis copiez l&apos;adresse.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareNote;
