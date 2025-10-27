import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { terminalCommands } from '../data/stats';

/**
 * Composant Terminal - Terminal interactif pour le mode développeur
 */
const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Portfolio v1.0.0' },
    { type: 'output', content: 'Tapez "help" pour voir les commandes disponibles.' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus sur l'input au clic
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Traitement des commandes
  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Ajoute la commande à l'historique
    setHistory(prev => [...prev, { type: 'input', content: `$ ${cmd}` }]);

    if (!trimmedCmd) {
      return;
    }

    // Ajoute à l'historique des commandes
    setCommandHistory(prev => [...prev, cmd]);

    // Commande clear
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    // Recherche la commande
    const command = terminalCommands[trimmedCmd];
    
    if (command) {

      // Commande normale
      setHistory(prev => [
        ...prev,
        { type: 'output', content: command.output }
      ]);
    } else {
      // Commande inconnue
      setHistory(prev => [
        ...prev,
        {
          type: 'error',
          content: `Command not found: ${trimmedCmd}. Type "help" for available commands.`
        }
      ]);
    }
  };

  // Gestion de la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  // Navigation dans l'historique avec les flèches
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0a0a0a] rounded-lg border border-dev-accent/30 overflow-hidden shadow-2xl"
      onClick={handleTerminalClick}
    >
      {/* Header du terminal */}
      <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-dev-accent/30">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="ml-4 text-dev-accent font-mono text-sm">
          jean-david@portfolio:~
        </span>
      </div>

      {/* Contenu du terminal */}
      <div
        ref={terminalRef}
        className="h-96 overflow-y-auto dev-scrollbar p-4 font-mono text-sm"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.type === 'input' && (
              <div className="text-dev-accent">{entry.content}</div>
            )}
            {entry.type === 'output' && (
              <div className="text-gray-300 whitespace-pre-wrap">{entry.content}</div>
            )}
            {entry.type === 'error' && (
              <div className="text-red-400">{entry.content}</div>
            )}
            {entry.type === 'info' && (
              <div className="text-yellow-400">{entry.content}</div>
            )}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-dev-accent">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-300 outline-none caret-dev-accent"
            autoFocus
            spellCheck="false"
          />
          <span className="text-dev-accent cursor-blink">▊</span>
        </form>
      </div>
    </motion.div>
  );
};

export default Terminal;
