import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { terminalCommands } from '../../data/stats';

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Portfolio OS Terminal [v2.0]\nType "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setHistory((prev) => [...prev, { type: 'input', content: `$ ${cmd}` }]);

    if (!trimmedCmd) return;
    setCommandHistory((prev) => [...prev, cmd]);

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmedCmd === 'neofetch') {
      setHistory((prev) => [...prev, {
        type: 'output',
        content: `OS: Portfolio OS\nHost: Jean-David Zamblezie\nKernel: React + Vite\nUptime: Forever\nShell: zsh\nWM: Framer Motion\nTheme: Cyberpunk\n\nSkills:\n  Web: React, Next.js, TypeScript\n  AI: Python, LangChain, OpenAI\n  Tools: Git, Docker, Vercel`
      }]);
      return;
    }

    const command = terminalCommands[trimmedCmd];
    if (command) {
      setHistory((prev) => [...prev, { type: 'output', content: command.output }]);
    } else {
      setHistory((prev) => [...prev, {
        type: 'error',
        content: `Command not found: ${trimmedCmd}. Type "help" for available commands.`
      }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = Object.keys(terminalCommands);
      const match = commands.find((cmd) => cmd.startsWith(input.toLowerCase()));
      if (match && match !== input.toLowerCase()) {
        setInput(match);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-dev-surface rounded-lg border border-dev-border overflow-hidden"
      onClick={handleTerminalClick}
    >
      {/* Window chrome */}
      <div className="bg-dev-bg px-4 py-2.5 flex items-center gap-2 border-b border-dev-border">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
        <span className="ml-3 text-dev-muted text-xs font-mono">
          jean-david@portfolio:~ — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="h-80 sm:h-96 overflow-y-auto dev-scrollbar p-4 font-mono text-sm"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-1.5">
            {entry.type === 'input' && (
              <div className="text-dev-green">{entry.content}</div>
            )}
            {entry.type === 'output' && (
              <div className="text-dev-text whitespace-pre-wrap">{entry.content}</div>
            )}
            {entry.type === 'error' && (
              <div className="text-red-400">{entry.content}</div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
          <span className="text-dev-green shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-dev-text outline-none caret-dev-green"
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
          <span className="text-dev-green animate-blink">▊</span>
        </form>
      </div>
    </motion.div>
  );
};

export default Terminal;
