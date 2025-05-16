
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Building, Shield } from 'lucide-react';
import Shell from '@/Shell';

const B2BSelectionPage = () => {
  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/30 p-4">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300 mb-2">
              Espace Entreprise
            </h1>
            <p className="text-lg text-blue-700/70 dark:text-blue-400/70 max-w-2xl mx-auto">
              Choisissez votre profil pour accéder à votre espace dédié
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30, x: -30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-blue-200 dark:border-blue-800/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-blue-800 dark:text-blue-300">
                    Collaborateur
                  </CardTitle>
                  <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Accédez à vos sessions, exercices et ressources
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow">
                  <ul className="space-y-2 text-sm text-blue-700/80 dark:text-blue-300/80">
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Journal émotionnel personnalisé
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Sessions de coaching assignées
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Ressources de bien-être émotionnel
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Accès SocialCocon d'entreprise
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/b2b/user/login" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                      Espace Collaborateur
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, x: 30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-blue-200 dark:border-blue-800/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-blue-800 dark:text-blue-300">
                    Administrateur
                  </CardTitle>
                  <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Gérez les utilisateurs et suivez les analyses
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow">
                  <ul className="space-y-2 text-sm text-blue-700/80 dark:text-blue-300/80">
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Gestion des utilisateurs
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Tableaux de bord analytiques
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Assignation des sessions
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="mr-2">✓</span> Paramètres de confidentialité avancés
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/b2b/admin/login" className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30"
                    >
                      Console d'administration
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-8"
          >
            <Link to="/" className="text-blue-600/70 dark:text-blue-400/70 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
              Retour à l'accueil
            </Link>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default B2BSelectionPage;
