
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Users } from 'lucide-react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const B2BSelectionPage = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800/50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">
              Espace Entreprise
            </h1>
            <p className="text-lg text-blue-600/80 dark:text-blue-400/80 max-w-2xl mx-auto">
              Sélectionnez votre profil pour accéder aux fonctionnalités adaptées à votre rôle
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <Card className="h-full bg-white dark:bg-gray-800/90 border-blue-100 dark:border-blue-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    Administrateur RH
                  </CardTitle>
                  <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Gérez vos équipes et accédez aux données d'analyse
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4 items-center pt-4">
                  <ul className="text-sm text-left space-y-2 w-full mb-6 text-blue-700/80 dark:text-blue-300/80">
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Tableaux de bord analytiques
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Suivi du bien-être des équipes
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Gestion des accès utilisateurs
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Rapports et statistiques
                    </li>
                  </ul>
                  <div className="pt-2 w-full grid gap-4">
                    <Button 
                      onClick={() => navigate('/b2b/admin/login')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      Se connecter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <Card className="h-full bg-white dark:bg-gray-800/90 border-blue-100 dark:border-blue-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    Collaborateur
                  </CardTitle>
                  <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Accédez à vos outils de bien-être personnalisés
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4 items-center pt-4">
                  <ul className="text-sm text-left space-y-2 w-full mb-6 text-blue-700/80 dark:text-blue-300/80">
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Analyse de vos émotions
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Recommendations personnalisées
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Musique adaptative
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      Suivi de votre bien-être
                    </li>
                  </ul>
                  <div className="pt-2 w-full grid gap-4">
                    <Button 
                      onClick={() => navigate('/b2b/user/login')}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
                      variant="secondary"
                    >
                      Se connecter
                    </Button>
                    <Button 
                      onClick={() => navigate('/b2b/user/register')}
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 text-blue-600"
                    >
                      Créer un compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Retour à l'accueil
            </Button>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default B2BSelectionPage;
