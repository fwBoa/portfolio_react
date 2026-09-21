import { motion } from 'framer-motion';
import Terminal from './dev/Terminal';
import { site } from '../data/site';
import { skillGroups } from '../data/skills';

const stats = [
  { label: 'OS', value: 'Prometheus OS' },
  { label: 'Host', value: site.name },
  { label: 'Kernel', value: 'React + Vite' },
  { label: 'Shell', value: 'zsh' },
  { label: 'WM', value: 'Framer Motion' },
  { label: 'Theme', value: 'Monochrome' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const DevFace = () => {
  return (
    <div className="min-h-screen bg-dev-bg text-dev-green font-mono pt-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 py-12 sm:py-16 lg:py-20">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 sm:mb-14 lg:mb-20"
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-dev-muted font-medium font-display">
            Web Developer · AI Automation · Agentic Engineer
          </span>
        </motion.div>

        {/* ASCII Banner — responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-10 sm:mb-14 lg:mb-20"
        >
          <pre className="text-[0.4rem] sm:text-[0.5rem] md:text-xs lg:text-sm text-dev-green leading-[1.1] select-none overflow-x-auto whitespace-pre"
          >
{`
     ██╗███████╗ █████╗ ███╗   ██╗      ██████╗  █████╗ ██╗   ██╗██╗██████╗
     ██║██╔════╝██╔══██╗████╗  ██║      ██╔══██╗██╔══██╗██║   ██║██║██╔══██╗
     ██║█████╗  ███████║██╔██╗ ██║█████╗██║  ██║███████║██║   ██║██║██║  ██║
██   ██║██╔══╝  ██╔══██║██║╚██╗██║╚════╝██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║
╚█████╔╝███████╗██║  ██║██║ ╚████║      ██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝
 ╚════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝      ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝
`}
          </pre>
        </motion.div>

        {/* Main grid — stats left, terminal right on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-10 sm:gap-12 lg:gap-16"
        >
          {/* Left column — System info */}
          <div className="space-y-10 sm:space-y-14">
            {/* Stats */}
            <motion.div variants={itemVariants}>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-dev-muted font-medium font-display block mb-4 sm:mb-6">
                System Info
              </span>
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex justify-between items-baseline">
                    <span className="text-[10px] sm:text-xs text-dev-muted uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <span className="text-xs sm:text-sm text-dev-text font-medium">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skill groups */}
            <motion.div variants={itemVariants}>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-dev-muted font-medium font-display block mb-4 sm:mb-6">
                Capabilities
              </span>
              {skillGroups.map((group) => (
                <div key={group.title} className="mb-5 sm:mb-6">
                  <span className="text-[10px] sm:text-xs text-dev-green uppercase tracking-wider block mb-2">
                    {group.devTitle}
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {group.items.map((item) => (
                      <span key={item} className="text-[10px] sm:text-xs text-dev-muted">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Contact links */}
            <motion.div variants={itemVariants}>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-dev-muted font-medium font-display block mb-4 sm:mb-6">
                Contact
              </span>
              <div className="space-y-2">
                <a href={`mailto:${site.email}`} className="block text-xs sm:text-sm text-dev-text hover:text-dev-green transition-colors duration-300">
                  {site.email}
                </a>
                <a href={site.github} target="_blank" rel="noopener noreferrer" className="block text-xs sm:text-sm text-dev-text hover:text-dev-green transition-colors duration-300">
                  {site.githubLabel}
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="block text-xs sm:text-sm text-dev-text hover:text-dev-green transition-colors duration-300">
                  {site.linkedinLabel}
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right column — Terminal */}
          <div>
            <Terminal />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 sm:mt-20 lg:mt-24 pt-6 border-t border-dev-border"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs text-dev-muted">
              © {new Date().getFullYear()} {site.name}
            </span>
            <span className="text-[10px] sm:text-xs text-dev-muted">
              jean-david@portfolio:~$ exit → logout
            </span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default DevFace;
