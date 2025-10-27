import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';

/**
 * Composant CodeDisplay - Affichage du code avec coloration syntaxique
 * @param {string} code - Code à afficher
 * @param {string} language - Langage de programmation
 * @param {string} title - Titre du bloc de code
 */
const CodeDisplay = ({ code, language = 'javascript', title = 'Code' }) => {
  const codeRef = useRef(null);

  // Applique la coloration syntaxique
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  // Fonction pour copier le code
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    // Optionnel: ajouter un feedback visuel
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#272822] rounded-lg overflow-hidden shadow-xl border border-dev-accent/30"
    >
      {/* Header */}
      <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-dev-accent/30">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-4 text-dev-accent font-mono text-sm">{title}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="text-dev-accent hover:text-white transition-colors text-sm font-mono"
        >
          [copier]
        </motion.button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto dev-scrollbar">
        <pre className="p-4 text-sm">
          <code
            ref={codeRef}
            className={`language-${language}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </motion.div>
  );
};

export default CodeDisplay;
