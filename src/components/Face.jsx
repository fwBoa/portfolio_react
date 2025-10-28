import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaTimes, FaDownload } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import avatar from '../assets/Img/avatarportfoliobackgroundremove.png';
import cv from '../assets/doc/cv_alternance.pdf';

/**
 * Composant Face - Version normale du portfolio pour les recruteurs
 */
const Face = () => {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const formRef = useRef();

  // Fonction pour gérer l'envoi du formulaire avec EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');

    // Récupération des clés depuis les variables d'environnement
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
        console.log('Email envoyé avec succès:', result.text);
        setFormStatus('success');
        formRef.current.reset();
        
        // Réinitialiser le statut après 5 secondes
        setTimeout(() => setFormStatus('idle'), 5000);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi:', error.text);
        setFormStatus('error');
        
        // Réinitialiser le statut après 5 secondes
        setTimeout(() => setFormStatus('idle'), 5000);
      });
  };

  // Animation variants pour les sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-minimal-bg pt-28 sm:pt-32 pb-12">
      {/* Section À propos */}
      <motion.section
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 mb-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Photo de profil */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <div className="w-48 h-58">
                <img
                  src={avatar}
                  alt="Jean-David"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Texte de présentation */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-minimal-text mb-4">
                Jean-David Zamblezie
              </h1>
              <h2 className="text-2xl text-gray-600 mb-6">
                Développeur web
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
               Passionné par le web et les nouvelles technologies, j'aime donner vie à des idées à travers le code.
               Chaque projet est pour moi une nouvelle occasion d'apprendre, d'expérimenter et de concevoir 
               des solutions modernes et centrées sur l'utilisateur.
              </p>

              {/* Bouton télécharger CV */}
              <div className="mb-6">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={cv}
                  download="CV_Jean-David_Zamblezie.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-minimal-text text-white rounded-lg hover:bg-[#2a5159] transition-colors font-medium shadow-md"
                >
                  <FaDownload size={18} />
                  Télécharger mon CV
                </motion.a>
              </div>

              {/* Liens sociaux */}
              <div className="flex gap-4 justify-center md:justify-start">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/fwboa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-minimal-text text-white rounded-full flex items-center justify-center hover:bg-[#2a5159] transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.linkedin.com/in/jean-david-zamblezie-84410b258/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:jeandavidzamblezie@outlook.fr"
                  className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label="Email"
                >
                  <FaEnvelope size={24} />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Projets */}
      <motion.section
        id="projects"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container mx-auto px-6 mb-20"
      >
        <h2 className="text-4xl font-bold text-minimal-text text-center mb-12">
          Projets 
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDevMode={false}
              delay={index * 0.1}
            />
          ))}
        </div>      
      </motion.section>

      {/* Section Contact */}
      <motion.section
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="container mx-auto px-6"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-minimal-text text-center mb-8">
            Contactez-moi !
          </h2>
          <p className="text-center text-gray-700 mb-12 text-lg">
            Vous avez un projet en tête ? N'hésitez pas à me contacter !
          </p>

          {/* Formulaire de contact */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-minimal-text font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="from_name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-minimal-text transition-all"
                placeholder="Votre nom"
                disabled={formStatus === 'sending'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-minimal-text font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="from_email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-minimal-text transition-all"
                placeholder="votre@email.com"
                disabled={formStatus === 'sending'}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-minimal-text font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-minimal-text transition-all resize-none"
                placeholder="Votre message..."
                disabled={formStatus === 'sending'}
              />
            </div>

            {/* Message de statut */}
            {formStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
              >
                ✅ Message envoyé avec succès ! Je vous répondrai bientôt.
              </motion.div>
            )}

            {formStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
              >
                ❌ Erreur lors de l'envoi. Veuillez réessayer ou me contacter directement par email.
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: formStatus === 'sending' ? 1 : 1.02 }}
              whileTap={{ scale: formStatus === 'sending' ? 1 : 0.98 }}
              type="submit"
              disabled={formStatus === 'sending'}
              className={`w-full px-8 py-4 rounded-lg text-lg font-medium transition-all ${
                formStatus === 'sending'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-minimal-text hover:bg-[#2a5159] text-white'
              }`}
            >
              {formStatus === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
            </motion.button>
          </form>
        </div>
      </motion.section>

      {/* Footer simplifié */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="container mx-auto px-6 mt-20 pt-8 border-t border-gray-300"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            © {new Date().getFullYear()} Jean-David Zamblezie. Tous droits réservés.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLegalModal(true)}
            className="text-sm text-gray-500 hover:text-minimal-text underline transition-colors"
          >
            Mentions légales
          </motion.button>
        </div>
      </motion.footer>

      {/* Modal des mentions légales */}
      <AnimatePresence>
        {showLegalModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLegalModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowLegalModal(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden"
              >
                {/* Header fixe */}
                <div className="bg-minimal-text text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                  <h2 className="text-2xl font-bold">Mentions légales</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLegalModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Fermer"
                  >
                    <FaTimes size={24} />
                  </motion.button>
                </div>

                {/* Contenu scrollable */}
                <div className="px-6 py-8 overflow-y-auto max-h-[70vh]">
                  <div className="space-y-6 text-gray-700">
                    {/* Éditeur */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        📝 Éditeur du site
                      </h3>
                      <p className="leading-relaxed">
                        <strong>Nom :</strong> Jean-David Zamblezie<br />
                        <strong>Statut :</strong> Développeur web <br />
                        <strong>Email :</strong> jeandavidzamblezie@outlook.fr
                      </p>
                    </div>

                    {/* Hébergement */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        🌐 Hébergement
                      </h3>
                      <p className="leading-relaxed">
                        <strong>Vercel</strong><br />
                        340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
                      </p>
                    </div>

                    {/* Propriété intellectuelle */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        ⚖️ Propriété intellectuelle
                      </h3>
                      <p className="leading-relaxed">
                        L'ensemble du contenu de ce site (textes, images, code source, design) est la propriété exclusive. 
                        Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, 
                        quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de l'auteur.
                      </p>
                    </div>

                    {/* Données personnelles (RGPD) */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        🔒 Protection des données personnelles (RGPD)
                      </h3>
                      <p className="leading-relaxed mb-3">
                        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                        vous disposez des droits suivants concernant vos données personnelles :
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Droit d'accès et de rectification</li>
                        <li>Droit à l'effacement (droit à l'oubli)</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit à la portabilité des données</li>
                        <li>Droit d'opposition</li>
                      </ul>
                      <p className="leading-relaxed mt-3">
                        <strong>Collecte de données :</strong> Les informations recueillies via le formulaire de contact 
                        (nom, email, message) sont utilisées uniquement pour répondre à vos demandes et ne sont jamais 
                        transmises à des tiers ni utilisées à des fins commerciales.
                      </p>
                      <p className="leading-relaxed mt-2">
                        Pour exercer vos droits, contactez : <strong>jeandavidzamblezie@outlook.fr</strong>
                      </p>
                    </div>

                    {/* Cookies */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        🍪 Cookies
                      </h3>
                      <p className="leading-relaxed">
                        Ce site n'utilise pas de cookies de tracking, de publicité ou d'analyse de comportement. 
                        Seuls des cookies techniques strictement nécessaires au fonctionnement du site peuvent être utilisés 
                        (session, préférences d'affichage). Ces cookies ne collectent aucune donnée personnelle.
                      </p>
                    </div>

                    {/* Responsabilité */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        ⚠️ Limitation de responsabilité
                      </h3>
                      <p className="leading-relaxed">
                        L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. 
                        Toutefois, il ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. 
                        L'éditeur ne pourra être tenu responsable des erreurs, omissions ou résultats obtenus par l'utilisation de ces informations.
                      </p>
                    </div>

                    {/* Liens externes */}
                    <div>
                      <h3 className="text-lg font-bold text-minimal-text mb-2">
                        🔗 Liens externes
                      </h3>
                      <p className="leading-relaxed">
                        Ce site peut contenir des liens vers d'autres sites internet. L'éditeur n'exerce aucun contrôle sur ces sites 
                        et décline toute responsabilité quant à leur contenu.
                      </p>
                    </div>

                    {/* Date de mise à jour */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 italic">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer fixe du modal */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLegalModal(false)}
                    className="px-8 py-3 bg-minimal-text text-white rounded-lg hover:bg-[#2a5159] transition-colors font-medium"
                  >
                    Fermer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Face;
