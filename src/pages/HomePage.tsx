
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Building2, Sparkles, User, ChevronRight, Shield, Music, HeartHandshake } from 'lucide-react';
import { UserModeSelector } from '@/components/ui/user-mode-selector';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Si l'utilisateur est authentifié, on le redirige vers son tableau de bord
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Shell>
      <div className="container px-4 py-8 mx-auto">
        {/* Hero Section */}
        <motion.section 
          className="relative py-16 mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block p-2 rounded-full bg-primary/10 mb-4"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Prenez soin de votre bien-être émotionnel
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez nos solutions de gestion du stress et d'amélioration du bien-être 
              adaptées à vos besoins personnels et professionnels
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg gap-2 group"
                onClick={() => navigate('/b2c/login')}
              >
                <User className="h-5 w-5" />
                Espace Particulier
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg gap-2 group"
                onClick={() => navigate('/b2b/selection')}
              >
                <Building2 className="h-5 w-5" />
                Espace Entreprise
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </motion.section>
        
        {/* Features Section */}
        <motion.section 
          className="py-12 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos fonctionnalités principales</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils innovants pour vous aider à comprendre et à gérer vos émotions au quotidien
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Musicothérapie</h3>
              <p className="text-muted-foreground">
                Découvrez des playlists personnalisées pour chaque émotion et moment de la journée
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HeartHandshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coach émotionnel</h3>
              <p className="text-muted-foreground">
                Un assistant IA pour vous guider dans vos moments difficiles et célébrer vos victoires
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi sécurisé</h3>
              <p className="text-muted-foreground">
                Visualisez votre progression et identifiez des schémas pour améliorer votre bien-être
              </p>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Testimonials */}
        <motion.section 
          className="py-12 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce qu'ils en disent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment EmotionsCare a transformé la vie de nos utilisateurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full text-primary flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">JP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jean Pierre</h4>
                  <p className="text-sm text-muted-foreground">Utilisateur particulier</p>
                </div>
              </div>
              <p className="italic">
                "Depuis que j'utilise EmotionsCare, je gère beaucoup mieux mon stress au quotidien.
                La musicothérapie m'aide énormément à me recentrer."
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full text-primary flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">SM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sophie Martin</h4>
                  <p className="text-sm text-muted-foreground">Responsable RH</p>
                </div>
              </div>
              <p className="italic">
                "Un outil indispensable pour notre entreprise. Nous avons constaté une nette amélioration
                du bien-être de nos collaborateurs depuis son déploiement."
              </p>
            </div>
          </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          className="py-16 mb-8 bg-primary/5 rounded-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre parcours ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez notre communauté et prenez soin de votre bien-être émotionnel dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="gap-2"
                size="lg" 
                onClick={() => navigate('/register')}
              >
                Créer un compte
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/about')}
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </motion.section>
        
        {/* User mode selector (for testing purposes) */}
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2">
            [Version démo] Accès rapide par mode :
          </p>
          <div className="flex justify-center">
            <UserModeSelector />
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default HomePage;
