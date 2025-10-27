import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

/**
 * Composant ProjectCard - Carte de projet avec design adaptatif selon le mode
 * @param {object} project - Données du projet
 * @param {boolean} isDevMode - Mode développeur actif ou non
 * @param {number} delay - Délai pour l'animation
 */
const ProjectCard = ({ project, isDevMode = false, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10 }}
      className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isDevMode
          ? 'bg-dev-dark border border-dev-accent hover:shadow-dev-accent/50'
          : 'bg-white hover:shadow-2xl'
      }`}
    >
      {/* Image du projet */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay sur hover */}
        <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 ${
          isDevMode ? 'bg-dev-dark/90' : 'bg-minimal-text/90'
        }`}>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-full ${
              isDevMode ? 'bg-dev-accent text-dev-dark' : 'bg-white text-minimal-text'
            }`}
            aria-label="Voir sur GitHub"
          >
            <FaGithub size={24} />
          </motion.a>
          {project.demo && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full ${
                isDevMode ? 'bg-dev-accent text-dev-dark' : 'bg-white text-minimal-text'
              }`}
              aria-label="Voir la démo"
            >
              <FaExternalLinkAlt size={20} />
            </motion.a>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${
          isDevMode ? 'text-dev-accent font-mono' : 'text-minimal-text'
        }`}>
          {isDevMode ? `// ${project.title}` : project.title}
        </h3>
        
        <p className={`mb-4 ${
          isDevMode ? 'text-gray-300 font-mono text-sm' : 'text-gray-600'
        }`}>
          {project.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs rounded-full ${
                isDevMode
                  ? 'bg-dev-accent/20 text-dev-accent border border-dev-accent/50 font-mono'
                  : 'bg-gray-100 text-minimal-text'
              }`}
            >
              {isDevMode ? `${tag}` : tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
