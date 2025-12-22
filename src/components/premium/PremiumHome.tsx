/**
 * PremiumHome - Page d'accueil mobile-first premium
 * Design Apple-like, ton apaisant et enveloppant
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Lock } from 'lucide-react';

const PremiumHome: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[hsl(var(--calm-mist))] to-[hsl(var(--warmth-cream))] dark:from-background dark:via-background dark:to-background">
      {/* Header minimal */}
      <header className="header-mobile">
        <div className="container-mobile flex h-14 items-center justify-between">
          <Link 
            to="/" 
            className="font-premium text-lg font-semibold tracking-tight text-foreground"
          >
            EmotionsCare
          </Link>
          
          {isAuthenticated ? (
            <Link to="/app/home">
              <Button variant="ghost" size="sm" className="gap-1.5 text-sm font-medium">
                Mon espace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Se connecter
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section - Question émotionnelle */}
      <motion.main 
        className="container-mobile pt-16 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting personnalisé */}
        {isAuthenticated && user && (
          <motion.div variants={itemVariants} className="mb-8">
            <span className="text-sm text-muted-foreground">
              Bonjour, {user.email?.split('@')[0] || 'toi'}
            </span>
          </motion.div>
        )}

        {/* Question principale - Accroche émotionnelle incarnée */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="font-premium text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-foreground mb-4">
            Comment tu te sens,
            <br />
            <span className="text-primary">là, maintenant ?</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            Tu peux prendre ce moment pour toi.
            <br />
            <span className="text-muted-foreground/70">Rien n'est enregistré sans ton accord.</span>
          </p>
        </motion.div>

        {/* CTA Principal */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Link to="/app/scan" className="block">
            <Button 
              size="lg" 
              className="w-full h-14 text-base font-medium rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Commencer une session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          {/* Microcopy rassurant */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Confidentiel
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Sans jugement
            </span>
          </div>
        </motion.div>

        {/* Cards actions rapides */}
        <motion.div 
          variants={itemVariants} 
          className="mt-16 grid gap-3"
        >
          <p className="text-sm font-medium text-foreground mb-2">
            Besoin d'intervenir vite ?
          </p>
          
          <QuickActionCard
            title="Stopper une montée"
            description="Interrompre l'anxiété en cours"
            href="/app/scan?mode=stop"
            gradient="from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
            iconColor="text-red-500"
          />
          
          <QuickActionCard
            title="Reset express"
            description="Récupérer en 3 minutes"
            href="/app/scan?mode=reset"
            gradient="from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20"
            iconColor="text-amber-500"
          />
          
          <QuickActionCard
            title="Arrêt mental"
            description="Couper le cerveau pour dormir"
            href="/app/scan?mode=mental-stop"
            gradient="from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20"
            iconColor="text-indigo-500"
          />
        </motion.div>

        {/* Section confiance */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Prendre soin de celles et ceux qui prennent soin.
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground/70">
            <span>Étudiants en santé</span>
            <span>•</span>
            <span>Soignants</span>
            <span>•</span>
            <span>Aidants</span>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

// Composant carte d'action rapide
interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  gradient: string;
  iconColor: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  href,
  gradient,
  iconColor,
}) => (
  <Link to={href}>
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r ${gradient} border border-border/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-foreground text-sm mb-0.5">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className={`h-5 w-5 ${iconColor} opacity-60`} />
      </div>
    </motion.div>
  </Link>
);

export default PremiumHome;
