
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import ModeToggle from '@/components/theme/ModeToggle';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/choose-mode');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">EmotionsCare</div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <Button onClick={() => navigate(getModeDashboardPath(userMode))}>
              Mon Tableau de Bord
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/choose-mode')}>
              Se connecter
            </Button>
          )}
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <motion.div 
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl text-muted-foreground">
            Une solution complète pour gérer vos émotions, que vous soyez un particulier
            ou un professionnel.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={handleGetStarted}>
              Commencer
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/b2c/login')}>
              Espace Personnel
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 mt-10 md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-primary/10 p-8 rounded-lg aspect-square max-w-md mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🧠</div>
              <div className="text-xl font-medium">Votre bien-être, notre priorité</div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Nos fonctionnalités</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Analyse d'émotions",
              description: "Suivez vos émotions quotidiennes et identifiez des tendances",
              icon: "🔍"
            },
            {
              title: "Espace social",
              description: "Connectez-vous avec d'autres utilisateurs et partagez votre parcours",
              icon: "👥"
            },
            {
              title: "Dashboard personnel",
              description: "Visualisez vos données et suivez votre progression",
              icon: "📊"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-card border rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel
            grâce à notre plateforme.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Commencer maintenant
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
