import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode, FaChartBar, FaTerminal } from 'react-icons/fa';
import CodeDisplay from './CodeDisplay';
import Terminal from './Terminal';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import { techStats } from '../data/stats';

/**
 * Composant DevFace - Version développeur du portfolio avec code, statistiques et le terminal interactif
 */
const DevFace = () => {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [loadTime, setLoadTime] = useState(0);

  // Calcule le temps de chargement
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      setLoadTime(((endTime - startTime) / 1000).toFixed(2));
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-dev-dark text-gray-300 pt-28 sm:pt-32 pb-12">
      {/* En-tête avec ASCII art */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
      >
        <div className="flex justify-center overflow-x-auto">
          <pre className="text-dev-accent font-mono text-[0.5rem] sm:text-xs md:text-sm dev-scrollbar text-center whitespace-pre">
{`
     ██╗███████╗ █████╗ ███╗   ██╗      ██████╗  █████╗ ██╗   ██╗██╗██████╗ 
     ██║██╔════╝██╔══██╗████╗  ██║      ██╔══██╗██╔══██╗██║   ██║██║██╔══██╗
     ██║█████╗  ███████║██╔██╗ ██║█████╗██║  ██║███████║██║   ██║██║██║  ██║
██   ██║██╔══╝  ██╔══██║██║╚██╗██║╚════╝██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║
╚█████╔╝███████╗██║  ██║██║ ╚████║      ██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝
 ╚════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝      ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝ 
                                                                              
           > ON THE WAY TO BECOME A BETTER DEVELOPER <
`}
          </pre>
        </div> 
        

      </motion.section>

      {/* Statistiques techniques */}
      <motion.section
        id="stats"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-mono text-dev-accent mb-6 sm:mb-8"
        >
          {'// Statistiques Techniques'}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Carte Build Time */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, borderColor: '#00ff41' }}
            className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-dev-accent/30 transition-all"
          >
            <FaChartBar className="text-dev-accent text-2xl sm:text-3xl mb-2 sm:mb-4" />
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 font-mono">Build Time</h3>
            <p className="text-lg sm:text-2xl font-bold text-dev-accent font-mono">
              {techStats.buildTime}
            </p>
          </motion.div>

          {/* Carte Bundle Size */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, borderColor: '#00ff41' }}
            className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-dev-accent/30 transition-all"
          >
            <FaCode className="text-dev-accent text-2xl sm:text-3xl mb-2 sm:mb-4" />
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 font-mono">Bundle Size</h3>
            <p className="text-lg sm:text-2xl font-bold text-dev-accent font-mono">
              {techStats.bundleSize}
            </p>
          </motion.div>

          {/* Carte Components */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, borderColor: '#00ff41' }}
            className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-dev-accent/30 transition-all"
          >
            <FaTerminal className="text-dev-accent text-2xl sm:text-3xl mb-2 sm:mb-4" />
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 font-mono">Components</h3>
            <p className="text-lg sm:text-2xl font-bold text-dev-accent font-mono">
              {techStats.components}
            </p>
          </motion.div>

          {/* Carte Lines of Code */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, borderColor: '#00ff41' }}
            className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-dev-accent/30 transition-all"
          >
            <FaGithub className="text-dev-accent text-2xl sm:text-3xl mb-2 sm:mb-4" />
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 font-mono">Lignes de code</h3>
            <p className="text-lg sm:text-2xl font-bold text-dev-accent font-mono">
              {techStats.linesOfCode.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Technologies utilisées */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-dev-accent/30"
        >
          <h3 className="text-lg sm:text-xl font-mono text-dev-accent mb-3 sm:mb-4">
            {'// Tech Stack'}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            {techStats.technologies.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{tech.logo}</span>
                <span className="text-gray-300 font-mono text-xs sm:text-sm">{tech.name}</span>
                <span className="text-dev-accent text-[0.65rem] sm:text-xs">{tech.version}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Section Projets avec code */}
      <motion.section
        id="code"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-mono text-dev-accent mb-6 sm:mb-8"
        >
          {'// Projets'}
        </motion.h2>

        {/* Sélecteur de projet */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer"
              >
                <ProjectCard
                  project={project}
                  isDevMode={true}
                  delay={index * 0.05}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Affichage du code du projet sélectionné */}
        {selectedProject && (
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8"
          >
            <CodeDisplay
              code={selectedProject.code}
              language="jsx"
              title={`${selectedProject.title}.jsx`}
            />
          </motion.div>
        )}
      </motion.section>

      {/* Section Terminal */}
      <motion.section
        id="terminal"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-mono text-dev-accent mb-6 sm:mb-8"
        >
          {'// Terminal'}
        </motion.h2>

        <motion.div variants={itemVariants}>
          <Terminal />
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dev-accent/30"
      >
        <p className="text-center text-gray-500 font-mono text-xs sm:text-sm">
          {''}
        </p>
        <p className="text-center text-dev-accent font-mono text-xs mt-2">
          Temps de chargement: {loadTime}s
        </p>
      </motion.footer>
    </div>
  );
};

export default DevFace;
