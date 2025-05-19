
import React, { useEffect } from 'react';
import PremiumContent from '@/components/immersive/PremiumContent';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import '../styles/animations.css';

const ImmersiveHome: React.FC = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    console.log('🏠 ImmersiveHome: Composant monté');
    document.body.classList.add('overflow-hidden');
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-slate-900 to-blue-900' 
        : 'bg-gradient-to-b from-blue-50 to-purple-100'
    }`}>
      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              EC
            </div>
          </motion.div>
        </div>
        
        <ThemeToggle />
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center relative z-10">
        <PremiumContent greeting="Prenez soin de votre bien-être émotionnel avec une approche personnalisée" />
      </main>

      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 -left-[30%] w-[60%] aspect-square bg-blue-500 rounded-full blur-[120px] mix-blend-multiply"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-[30%] -right-[20%] w-[50%] aspect-square bg-purple-500 rounded-full blur-[130px] mix-blend-multiply"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute -bottom-[10%] left-[20%] w-[40%] aspect-square bg-pink-400 rounded-full blur-[120px] mix-blend-multiply"
        />
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-blue-600/60 dark:text-blue-300/60 z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          © {new Date().getFullYear()} EmotionsCare · Tous droits réservés
        </motion.p>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
