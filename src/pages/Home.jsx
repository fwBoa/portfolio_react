import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ToggleFace from '../components/ToggleFace';
import Face from '../components/Face';
import DevFace from '../components/DevFace';

const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const Home = () => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [konamiCode, setKonamiCode] = useState([]);

  const toggleMode = () => {
    setIsDevMode((prev) => {
      const next = !prev;
      localStorage.setItem('devMode', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
    <div className={`min-h-screen ${isDevMode ? 'bg-dev-bg text-dev-text' : 'bg-os-bg text-os-text'}`}>
      <Header isDevMode={isDevMode} toggleMode={toggleMode} />
      <AnimatePresence mode="wait">
        <ToggleFace isDevMode={isDevMode}>
          {isDevMode ? <DevFace /> : <Face />}
        </ToggleFace>
      </AnimatePresence>
    </div>
  );
};

export default Home;
