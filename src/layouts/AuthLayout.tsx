import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Heart, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout pour les pages d'authentification
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="emotions-care-theme">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        {/* Éléments d'arrière-plan animés */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Header avec logo */}
        <header className="relative z-10 p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <motion.div
                className="p-2 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="h-8 w-8 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  EmotionsCare
                </h1>
                <p className="text-sm text-muted-foreground">
                  Votre bien-être digital
                </p>
              </div>
            </Link>

            <ThemeToggle />
          </div>
        </header>

        {/* Contenu principal */}
        <main className="relative z-10 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Card d'authentification */}
            <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
              {children}
            </div>

            {/* Message d'encouragement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <p className="text-sm">
                  Prenez soin de votre bien-être émotionnel
                </p>
                <Sparkles className="h-4 w-4" />
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 p-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EmotionsCare. Votre santé mentale est notre priorité.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;