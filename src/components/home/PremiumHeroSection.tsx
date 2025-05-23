
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Clock, Sparkles, ArrowRight } from 'lucide-react';

const PremiumHeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Philosophie principale */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Votre parenthèse bien-être commence ici
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Une parenthèse
            </span>
            <br />
            <span className="text-slate-800 dark:text-white">
              pour chacun
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
            Une <strong className="text-purple-600">énergie partagée</strong> pour chaque équipe.
            <br />
            Ici, le temps redevient un <strong className="text-blue-600">luxe accessible</strong>.
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-slate-500 dark:text-slate-400 italic"
          >
            L'essentiel se retrouve dans l'énergie partagée
          </motion.p>
        </motion.div>

        {/* Cards de valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <Clock className="h-8 w-8 text-blue-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Le temps retrouvé</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Redécouvrez le luxe de prendre du temps pour vous, sans culpabilité
            </p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <Users className="h-8 w-8 text-purple-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">L'énergie collective</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Cultivez ensemble une dynamique positive qui élève toute l'équipe
            </p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <Sparkles className="h-8 w-8 text-pink-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">L'accessible premium</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Une expérience d'exception, pensée pour être accessible à tous
            </p>
          </div>
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/choose-mode')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            Commencer ma parenthèse
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={() => navigate('/b2b/selection')}
            variant="outline"
            size="lg"
            className="border-2 border-purple-400 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-8 py-6 text-lg rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
          >
            Énergiser mon équipe
          </Button>
        </motion.div>

        {/* Citation inspirante */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <blockquote className="text-lg italic text-slate-500 dark:text-slate-400 border-l-4 border-purple-400 pl-6">
            "Dans un monde qui court, nous créons des espaces où l'on peut enfin respirer"
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumHeroSection;
