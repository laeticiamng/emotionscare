
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, Heart, Brain, Users, Target, Music } from 'lucide-react';

const PremiumHeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-sm font-medium tracking-wider text-blue-600 uppercase">
              ✨ Bienvenue sur EmotionsCare
            </span>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Le bien-être ne s'explique pas,{' '}
            <motion.span
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              il se vit
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-8">
              Notre ambition : offrir à chacun une parenthèse pour soi, 
              à chaque équipe une énergie partagée.
            </p>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve 
              dans l'énergie partagée. Rejoignez-nous pour explorer une nouvelle vision 
              du bien-être : <em className="italic text-blue-600">simple, essentielle, humaine, élégante.</em>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              onClick={() => navigate('/choose-mode')}
              size="lg"
              className="group px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Découvrir EmotionsCare
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Two-column layout for Particuliers and Entreprises */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Particuliers Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Heart className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">🌱 Particuliers</h2>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Ouvrez une parenthèse. Un instant pour vous. Le luxe, c'est de prendre le temps.
                Transformez chaque journée en petite respiration. Simplement.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                Avec EmotionsCare, vous retrouvez :
              </h3>
              <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Une expérience sensorielle, élégante, apaisante avec une interface sobre et des sons doux</span>
                </li>
                <li className="flex items-start">
                  <Brain className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Des ressources conçues pour vous accompagner : calme, énergie, confiance, inspiration</span>
                </li>
                <li className="flex items-start">
                  <Music className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Modules guidés, rituels courts, parcours personnalisés pour chaque pause</span>
                </li>
                <li className="flex items-start">
                  <Heart className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Le plaisir d'un bien-être sur-mesure, sans pression, sans objectif à atteindre</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button
                  onClick={() => navigate('/b2c/login')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3"
                >
                  Commencer mon expérience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Entreprises Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Building2 className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">🏢 Entreprises</h2>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Votre structure est unique. Votre équipe a son histoire. Vos collaborateurs sont précieux. 
                Leurs émotions comptent et nourrissent chaque jour la motivation, la créativité, la confiance et l'énergie.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                Avec EmotionsCare, vous offrez à vos équipes :
              </h3>
              <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                <li className="flex items-start">
                  <Target className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span>L'élan de se dépasser, l'envie de s'engager - l'énergie circule, l'enthousiasme renaît</span>
                </li>
                <li className="flex items-start">
                  <Brain className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>La sérénité face à la fatigue, la puissance face à la routine</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Des relations humaines vivantes, authentiques avec reconnaissance et écoute</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Un accompagnement sur-mesure qui évolue avec vous pour une énergie durable</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button
                  onClick={() => navigate('/b2b/selection')}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3"
                >
                  Découvrir nos solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl max-w-4xl mx-auto">
            <p className="text-lg font-light text-slate-700 dark:text-slate-300 italic mb-4">
              "Le luxe, c'est de prendre le temps. L'essentiel, retrouver une énergie partagée."
            </p>
            <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Révélez l'humain grâce aux émotions.
            </p>
          </div>
          
          <p className="text-sm text-slate-400 dark:text-slate-500 font-light tracking-wider mt-8">
            🌟 Découvrez, vivez, partagez l'expérience émotionnelle. EmotionsCare SASU.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumHeroSection;
