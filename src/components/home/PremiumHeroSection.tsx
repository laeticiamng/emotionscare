
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-sm font-medium tracking-wider text-blue-600 uppercase">
              Bienvenue sur EmotionsCare
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
        </motion.div>

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
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate('/b2c/login')}
            size="lg"
            className="group px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Espace Particulier
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button
            onClick={() => navigate('/b2b/selection')}
            variant="outline"
            size="lg"
            className="group px-8 py-6 text-lg border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
          >
            Solutions Entreprise
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-slate-400 dark:text-slate-500 font-light tracking-wider">
            🌟 Découvrez, vivez, partagez l'expérience émotionnelle. EmotionsCare SASU.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumHeroSection;
