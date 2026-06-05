import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { terminalCommands } from '../../data/stats';

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Prometheus OS Terminal [v2.0]\nWelcome, guest. Type "help" for available commands.' },
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
    setHistory((prev) => [...prev, { type: 'input', content: `jean-david@portfolio:~$ ${cmd}` }]);

    if (!trimmedCmd) return;
    setCommandHistory((prev) => [...prev, cmd]);

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmedCmd === 'neofetch') {
      setHistory((prev) => [...prev, {
        type: 'output',
        content: `OS:       Prometheus OS
Host:     Jean-David Zamblezie
Kernel:   React + Vite
Uptime:   Forever
Shell:    zsh
WM:       Framer Motion
Theme:    Monochrome Teal

Skills:
  Web  → React, Next.js, TypeScript, Tailwind
  AI   → Python, LangChain, OpenAI, n8n, MCP
  Infra→ Git, Docker, PostgreSQL, Vercel`
      }]);
      return;
    }

    const command = terminalCommands[trimmedCmd];
    if (command) {
      let output = command.output;
      if (typeof output === 'function') {
        output = output();
      }
      setHistory((prev) => [...prev, { type: 'output', content: output }]);
    } else {
      setHistory((prev) => [...prev, {
        type: 'error',
        content: `Command not found: ${trimmedCmd}. Type "help" for available commands.`,
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

  const promptTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="border border-dev-border overflow-hidden rounded-lg"
      onClick={handleTerminalClick}
    >
      {/* Chrome bar */}
      <div className="bg-dev-surface px-4 py-2.5 flex items-center justify-between border-b border-dev-border">
        <span className="text-[10px] sm:text-xs text-dev-muted font-mono tracking-wider">
          jean-david@portfolio:~ — zsh
        </span>
        <span className="text-[10px] text-dev-muted font-mono">{promptTime}</span>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="h-64 sm:h-72 lg:h-80 overflow-y-auto dev-scrollbar p-3 sm:p-4 font-mono text-xs sm:text-sm bg-dev-bg"
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
          <span className="text-dev-green shrink-0 text-xs sm:text-sm font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-dev-text outline-none caret-dev-green text-xs sm:text-sm font-mono"
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
          <span className="text-dev-green animate-blink text-xs sm:text-sm">▊</span>
        </form>
      </div>
    </motion.div>
  );
};

export default Terminal;
