
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Heart, Glasses, MessageSquare, Users, Check } from 'lucide-react';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import { useUserMode } from '@/contexts/UserModeContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  const features = [
    {
      title: "Scan émotionnel",
      description: "Analysez et comprenez vos émotions en temps réel",
      icon: <Heart className="h-8 w-8 text-primary" />,
      path: "/scan"
    },
    {
      title: "Réalité virtuelle",
      description: "Immergez-vous dans des environnements apaisants",
      icon: <Glasses className="h-8 w-8 text-primary" />,
      path: "/vr"
    },
    {
      title: "Coach virtuel",
      description: "Bénéficiez d'un accompagnement personnalisé",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      path: "/coach"
    },
    {
      title: "Communauté",
      description: "Échangez avec d'autres utilisateurs engagés",
      icon: <Users className="h-8 w-8 text-primary" />,
      path: "/social"
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/b2c/login');
    }
  };

  const handleBusinessAccess = () => {
    navigate('/b2b/selection');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-24 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-slate-900"></div>
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-800 dark:text-blue-300 mb-6">
              Prenez soin de votre <span className="text-blue-600 dark:text-blue-400">bien-être émotionnel</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-lg md:text-xl text-blue-700/80 dark:text-blue-400/80 max-w-3xl mx-auto mb-8">
              Découvrez comment notre plateforme utilise l'intelligence artificielle pour analyser vos émotions et vous proposer des solutions personnalisées pour améliorer votre bien-être quotidien.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-6 text-lg"
            >
              Commencer maintenant
            </Button>
            <Button 
              onClick={handleBusinessAccess}
              variant="outline" 
              size="lg"
              className="border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-8 py-6 text-lg"
            >
              Solutions entreprise
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos fonctionnalités</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche complète pour améliorer votre bien-être émotionnel avec des outils innovants et scientifiquement prouvés.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-card border rounded-lg p-6 h-full hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button 
                    variant="link" 
                    className="p-0 flex items-center gap-1 text-primary"
                    onClick={() => navigate(feature.path)}
                  >
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Les avantages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre approche intégrée offre des résultats mesurables pour votre bien-être émotionnel et mental.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Réduction du stress quotidien",
              "Amélioration de la santé mentale",
              "Meilleure gestion émotionnelle",
              "Hausse de la productivité",
              "Diminution de l'anxiété",
              "Relations interpersonnelles améliorées"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              Commencer votre parcours
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer votre bien-être émotionnel ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie grâce à notre plateforme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
              >
                Créer mon compte
              </Button>
              <Button 
                onClick={() => navigate('/b2c/login')}
                variant="outline"
                size="lg"
              >
                Se connecter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer with links to important pages */}
      <footer className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4">EmotionsCare</h3>
            <p className="text-muted-foreground max-w-sm">
              Une approche innovante pour le bien-être émotionnel et mental.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium mb-4">Parcours</h4>
              <ul className="space-y-2">
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/scan')}
                  >
                    Scan émotionnel
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/vr')}
                  >
                    Réalité virtuelle
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/social')}
                  >
                    Communauté
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Comptes</h4>
              <ul className="space-y-2">
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/b2c/login')}
                  >
                    Particulier
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/b2b/user/login')}
                  >
                    Collaborateur
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/b2b/admin/login')}
                  >
                    Administrateur
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Plus d'infos</h4>
              <ul className="space-y-2">
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/b2b/selection')}
                  >
                    Solutions B2B
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/contact')}
                  >
                    Contact
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/about')}
                  >
                    À propos
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-muted">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
