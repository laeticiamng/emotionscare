
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Building2, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/choose-mode');
    }
  };
  
  const featureAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            EmotionsCare vous accompagne pour améliorer votre équilibre émotionnel au quotidien, en entreprise comme dans votre vie personnelle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg"
              onClick={handleGetStarted}
            >
              Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg"
              onClick={() => navigate('/about')}
            >
              En savoir plus
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-8 w-full"
        >
          <div className="flex justify-center">
            <div className="animate-bounce">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos solutions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment EmotionsCare peut vous aider à améliorer votre bien-être émotionnel
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="bg-card rounded-lg p-6 border shadow-sm"
              variants={featureAnimation}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Particuliers</h3>
              <p className="text-muted-foreground text-center mb-4">
                Améliorez votre équilibre émotionnel au quotidien grâce à nos outils personnalisés.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Analyse émotionnelle personnalisée
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Coach virtuel accessible 24/7
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Méditations guidées et musique
                </li>
              </ul>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2c/login')}
                >
                  Espace particulier
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-lg p-6 border shadow-sm"
              variants={featureAnimation}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Entreprises</h3>
              <p className="text-muted-foreground text-center mb-4">
                Offrez à vos collaborateurs des outils pour améliorer leur bien-être au travail.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Suivi du bien-être des équipes
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Sessions collectives guidées
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Rapports et statistiques d'équipe
                </li>
              </ul>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2b/selection')}
                >
                  Espace entreprise
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-lg p-6 border shadow-sm"
              variants={featureAnimation}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Administrateurs</h3>
              <p className="text-muted-foreground text-center mb-4">
                Gérez et suivez le bien-être de l'ensemble de votre organisation.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Tableau de bord d'administration
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Gestion des utilisateurs
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary">✓</span> Analyse avancée des données
                </li>
              </ul>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  Espace administrateur
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre bien-être émotionnel ?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez EmotionsCare et commencez votre parcours vers un meilleur équilibre émotionnel dès aujourd'hui.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8"
            >
              Commencer maintenant
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">EmotionsCare</h3>
              <p className="text-sm text-muted-foreground">© 2023 Tous droits réservés</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/about')}>À propos</Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/contact')}>Contact</Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/privacy')}>Confidentialité</Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/terms')}>CGU</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
