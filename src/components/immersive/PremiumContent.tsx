
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PremiumOptionCard from './PremiumOptionCard';

interface PremiumContentProps {
  greeting: string;
}

const PremiumContent: React.FC<PremiumContentProps> = ({ greeting }) => {
  return (
    <div className="premium-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="premium-header"
      >
        <motion.h1 
          className="premium-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          EmotionsCare
        </motion.h1>
        <motion.p 
          className="premium-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {greeting}, votre espace de bien-être émotionnel
        </motion.p>
      </motion.div>

      <motion.div 
        className="premium-options"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <AnimatePresence>
          <PremiumOptionCard
            title="Espace Particulier"
            description="Accédez à votre espace personnel pour explorer vos émotions, gérer votre journal et suivre votre progression."
            icon={Sparkles}
            linkTo="/b2c/login"
            buttonText="Accéder à mon espace"
            delay={1}
            initialX={-40}
          />

          <PremiumOptionCard
            title="Espace Entreprise"
            description="Solutions de bien-être professionnel pour les collaborateurs et outils d'analyse pour les responsables RH."
            icon={Sparkles}
            linkTo="/b2b/selection"
            buttonText="Accéder à l'espace pro"
            buttonVariant="secondary"
            delay={1.1}
            initialX={40}
          />
        </AnimatePresence>
      </motion.div>

      <motion.div 
        className="premium-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EmotionsCare • <Link to="/privacy-policy" className="hover:underline">Confidentialité</Link> • <Link to="/terms" className="hover:underline">Conditions d'utilisation</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default PremiumContent;
