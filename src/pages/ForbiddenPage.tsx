/**
 * 🚫 PAGE 403 EMOTIONSCARE
 * Page d'accès refusé avec options de connexion
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, UserX, Home, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-8"
        >
          {/* Icône d'erreur */}
          <motion.div
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="w-full h-full bg-destructive/10 rounded-full flex items-center justify-center">
              <Shield className="h-16 w-16 text-destructive" />
            </div>
            
            <motion.div className="absolute top-4 right-4 bg-destructive/20 p-2 rounded-full">
              <Lock className="h-4 w-4 text-destructive" />
            </motion.div>
          </motion.div>

          {/* Message principal */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-destructive">
              403
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold">
              Accès refusé
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Vous n'avez pas les autorisations nécessaires pour accéder à cette page. 
              Connectez-vous ou vérifiez vos permissions.
            </p>
          </motion.div>

          {/* Solutions proposées */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold">Solutions suggérées</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Connexion */}
              <Link to="/login">
                <Card className="p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group h-full">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg mx-auto w-fit group-hover:bg-primary/20 transition-colors">
                      <LogIn className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        Se connecter
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Accédez à votre compte existant
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Inscription */}
              <Link to="/signup">
                <Card className="p-4 hover:shadow-md hover:border-secondary/20 transition-all duration-200 cursor-pointer group h-full">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-secondary/10 rounded-lg mx-auto w-fit group-hover:bg-secondary/20 transition-colors">
                      <UserPlus className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-secondary transition-colors">
                        Créer un compte
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Rejoignez EmotionsCare gratuitement
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* Actions de navigation */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-base px-8">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              size="lg" 
              className="text-base px-8"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Page précédente
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForbiddenPage;