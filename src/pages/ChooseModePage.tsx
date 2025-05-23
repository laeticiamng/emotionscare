
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Building2, Shield, ArrowRight } from "lucide-react";
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { getModeDashboardPath } from "@/utils/userModeHelpers";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
};

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { changeUserMode } = useUserMode();
  const { isAuthenticated } = useAuth();

  const handleSelectUserMode = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    changeUserMode(mode);
    
    if (isAuthenticated) {
      // Si l'utilisateur est déjà connecté, le rediriger vers le dashboard approprié
      const dashboardPath = getModeDashboardPath(mode);
      toast.success(`Mode ${mode === 'b2c' ? 'Particulier' : mode === 'b2b_user' ? 'Collaborateur' : 'Administrateur'} sélectionné`);
      navigate(dashboardPath);
    } else {
      // Sinon, rediriger vers la page de login correspondante
      if (mode === 'b2c') {
        toast.info("Mode Particulier sélectionné");
        navigate('/b2c/login');
      } else if (mode === 'b2b_user') {
        toast.info("Mode Collaborateur sélectionné");
        navigate('/b2b/user/login');
      } else {
        toast.info("Mode Administrateur sélectionné");
        navigate('/b2b/admin/login');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="text-center max-w-3xl mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bienvenue sur <span className="text-primary">EmotionsCare</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sélectionnez votre profil pour accéder à l'expérience adaptée à vos besoins.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={cardVariants}
          whileHover="hover"
          onClick={() => handleSelectUserMode('b2c')}
        >
          <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto bg-red-100 dark:bg-red-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl mb-2">Particulier</CardTitle>
              <CardDescription className="text-base">
                Prenez soin de votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Scanner émotionnel personnel
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Suivi de votre bien-être
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Recommandations personnalisées
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSelectUserMode('b2c')}>
                Accéder comme Particulier
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          whileHover="hover"
          onClick={() => handleSelectUserMode('b2b_user')}
        >
          <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl mb-2">Collaborateur</CardTitle>
              <CardDescription className="text-base">
                Améliorez votre bien-être au travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Accès aux outils de gestion émotionnelle
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Participation aux activités d'équipe
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Suivi professionnel du bien-être
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSelectUserMode('b2b_user')}>
                Accéder comme Collaborateur
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          whileHover="hover"
          onClick={() => handleSelectUserMode('b2b_admin')}
        >
          <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl mb-2">Administrateur</CardTitle>
              <CardDescription className="text-base">
                Gérez le bien-être de vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Tableau de bord analytique
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Gestion des collaborateurs
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Organisation d'événements d'entreprise
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSelectUserMode('b2b_admin')}>
                Accéder comme Administrateur
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          variant="link" 
          onClick={() => navigate('/')}
        >
          Retour à la page d'accueil
        </Button>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
