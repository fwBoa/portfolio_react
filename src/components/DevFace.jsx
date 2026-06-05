import React from 'react';
import { motion } from 'framer-motion';
import Terminal from './dev/Terminal';

const DevFace = () => {
  return (
    <div className="min-h-screen bg-dev-bg text-dev-green pt-20 px-4 pb-12 font-mono">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <pre className="text-[0.35rem] sm:text-xs md:text-sm text-dev-green leading-none select-none overflow-x-auto"
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
          <p className="text-dev-muted text-xs mt-2 text-center">
            Web Developer · AI Automation · Agentic Engineer
          </p>
        </motion.div>

        <Terminal />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-dev-muted text-xs"
        >
          <p>jean-david@portfolio:~$ exit</p>
          <p className="text-dev-green mt-1">logout</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default DevFace;
