/**
 * ModernHomePage - Version premium Apple-like
 * UI/UX: Entrée émotionnelle calme, rassurante, enveloppante
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Lock, Heart } from 'lucide-react';

const ModernHomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate('/app/scan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header minimaliste */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-semibold text-xl tracking-tight text-slate-900 dark:text-white"
          >
            EmotionsCare
          </Link>
          
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/app/home">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Mon espace
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Se connecter
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    Commencer
                  </motion.button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - Entrée émotionnelle */}
      <main className="pt-16">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Badge discret */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 rounded-full"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Pour ceux qui prennent soin des autres</span>
            </motion.div>

            {/* Question principale */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              Comment tu te sens{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                maintenant
              </span>
              <span className="text-slate-400 dark:text-slate-500"> ?</span>
            </h1>

            {/* Sous-titre empathique */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
              Prends un instant pour toi. Dépose ce que tu ressens, sans jugement. 
              On t'accompagne en douceur.
            </p>

            {/* CTA Principal */}
            <motion.button
              onClick={handleStartSession}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Commencer une session
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Indicateurs de confiance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-500 dark:text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Données chiffrées</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Confidentiel</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Sans jugement</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section utilisateur connecté */}
        {isAuthenticated && user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="py-16 px-4 sm:px-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                    {(user.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      Bonjour, {user.email?.split('@')[0] || 'toi'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ravi de te revoir
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link to="/app/scan">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/30 cursor-pointer"
                    >
                      <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                        Nouvelle session
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Exprimer ce que tu ressens
                      </p>
                    </motion.div>
                  </Link>

                  <Link to="/app/journal">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/30 cursor-pointer"
                    >
                      <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                        Journal
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Ton historique émotionnel
                      </p>
                    </motion.div>
                  </Link>

                  <Link to="/app/music">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/30 cursor-pointer"
                    >
                      <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                        Musique
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Un moment pour toi
                      </p>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Footer minimaliste */}
        <footer className="py-8 px-4 sm:px-6 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto text-center text-sm text-slate-500 dark:text-slate-500">
            <p>EmotionsCare — Pour ceux qui prennent soin des autres</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ModernHomePage;
