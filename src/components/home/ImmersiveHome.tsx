// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Building2, Sparkles, Users, Target, Lightbulb } from 'lucide-react';
import WelcomeMessage from './WelcomeMessage';
import ActionButtons from './ActionButtons';
import AnimatedBackground3D from './AnimatedBackground3D';
import { routes } from '@/routerV2';
import '@/components/home/immersive-home.css';

export const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="immersive-bg">
        <AnimatedBackground3D />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen container-mobile py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-4xl mx-auto"
          >
            <motion.h1 
              className="immersive-title text-responsive font-bold mb-2 sm:mb-4 md:mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              EmotionsCare
            </motion.h1>
            
            <motion.p 
              className="text-responsive text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Votre compagnon de bien-être émotionnel powered by AI
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8 md:mb-12"
            >
              <WelcomeMessage className="px-1 sm:px-2" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="w-full px-1 sm:px-2"
            >
              <ActionButtons />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Philosophy Introduction */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white/90 to-blue-50/30 dark:from-slate-900/90 dark:to-slate-800/30">
        <div className="container-mobile">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center mb-6"
            >
              <Sparkles className="h-12 w-12 text-purple-500" />
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 font-light italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="font-medium">Bienvenue sur EmotionsCare.</span> Le bien-être ne s'explique pas, il se vit.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-lg border border-white/20"
            >
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Notre ambition : <span className="font-semibold text-purple-600 dark:text-purple-400">offrir à chacun une parenthèse pour soi, à chaque équipe une énergie partagée.</span>
              </p>
              
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve dans l'énergie partagée.
              </p>
              
              <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300">
                Rejoignez-nous pour explorer une nouvelle vision du bien-être : 
                <span className="text-purple-600 dark:text-purple-400"> simple, essentielle, humaine, élégante.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Path Selector */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50/30 to-white dark:from-slate-800/30 dark:to-slate-900">
        <div className="container-mobile">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Choisissez votre parcours
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Deux univers, une même vision : votre bien-être au cœur de nos priorités
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Section Entreprises */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-3xl border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Entreprises</h3>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Votre structure est unique. Vos collaborateurs sont précieux. Leurs émotions comptent.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    L'élan de se dépasser, l'envie de s'engager
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Des relations humaines vivantes, authentiques
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Un accompagnement sur-mesure qui évolue avec vous
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/entreprise')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3"
              >
                Découvrir l'espace Entreprise
              </Button>
            </motion.div>

            {/* Section Particuliers */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 rounded-3xl border border-pink-200/30 hover:border-pink-300/50 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-pink-600 mr-3" />
                <h3 className="text-2xl font-bold text-pink-900 dark:text-pink-100">Particuliers</h3>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Ouvrez une parenthèse. Un instant pour vous. Le luxe, c'est de prendre le temps.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Une expérience sensorielle, élégante, apaisante
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Un cocon digital, discret, précieux
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Le plaisir d'un bien-être sur-mesure, sans pression
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/login?segment=b2c')}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full py-3"
              >
                Découvrir l'espace Personnel
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 bg-gradient-to-r from-purple-900 to-blue-900 text-white"
      >
        <div className="container-mobile text-center">
          <motion.p 
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            🌟 Découvrez, vivez, partagez l'expérience émotionnelle
          </motion.p>
          <p className="text-lg md:text-xl font-semibold text-purple-200">
            EmotionsCare SASU
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default ImmersiveHome;
