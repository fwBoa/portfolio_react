import { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import ToggleFace from '../components/ToggleFace';
import Face from '../components/Face';
import DevFace from '../components/DevFace';
import useScrollSpy from '../hooks/useScrollSpy';

/**
 * Sections de l'accueil, dans l'ordre où elles apparaissent.
 * Elles servent au repérage de la section active dans l'en-tête.
 */
const SECTION_IDS = ['about', 'skills', 'notes', 'contact'];

const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const Home = ({ posts = [] }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [konamiCode, setKonamiCode] = useState([]);
  const activeSection = useScrollSpy(SECTION_IDS);
  const focusAfterToggle = useRef(false);

  const toggleMode = () => {
    focusAfterToggle.current = true;
    setIsDevMode((prev) => {
      const next = !prev;
      localStorage.setItem('devMode', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [isDevMode]);

  // Après la bascule, le bouton Switch disparaît : sans ce transfert, le focus
  // retomberait sur <body> et la personne devrait repartir du début.
  useEffect(() => {
    if (!focusAfterToggle.current) return undefined;
    focusAfterToggle.current = false;

    const timer = window.setTimeout(() => {
      document.getElementById('main')?.focus({ preventScroll: true });
    }, 430);

    return () => window.clearTimeout(timer);
  }, [isDevMode]);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('devMode');
      if (savedMode) setIsDevMode(JSON.parse(savedMode));
    } catch {
      localStorage.removeItem('devMode');
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const newSequence = [...konamiCode, e.key].slice(-10);
      setKonamiCode(newSequence);
      if (JSON.stringify(newSequence) === JSON.stringify(konamiSequence)) {
        if (!isDevMode) setIsDevMode(true);
        setKonamiCode([]);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konamiCode, isDevMode]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDevMode]);

  return (
    <Layout isDevMode={isDevMode} toggleMode={toggleMode} activeSection={activeSection}>
      <ToggleFace isDevMode={isDevMode}>
        {isDevMode ? <DevFace /> : <Face posts={posts} />}
      </ToggleFace>
    </Layout>
  );
};

export default Home;
