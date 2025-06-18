
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-green-950 dark:to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <Building className="mx-auto w-16 h-16 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Espace Entreprise
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choisissez votre type d'accès à la plateforme EmotionsCare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collaborateur */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full border-2 hover:border-blue-500 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
                <CardDescription>
                  Accédez à vos outils de bien-être personnels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Scanner émotionnel quotidien
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Sessions VR de relaxation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Musicothérapie personnalisée
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Coach IA personnel
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Journal émotionnel privé
                  </li>
                </ul>
                <div className="pt-4">
                  <Link to="/b2b/user/login" className="w-full">
                    <Button className="w-full">
                      Accéder comme collaborateur
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Administrateur RH */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full border-2 hover:border-purple-500 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Administrateur RH</CardTitle>
                <CardDescription>
                  Gérez le bien-être de vos équipes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Tableaux de bord analytiques
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Rapports de bien-être d'équipe
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Gestion des utilisateurs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Événements et campagnes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Optimisation des parcours
                  </li>
                </ul>
                <div className="pt-4">
                  <Link to="/b2b/admin/login" className="w-full">
                    <Button variant="secondary" className="w-full">
                      Accéder comme administrateur
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vous êtes un particulier ?{' '}
            <Link to="/b2c/login" className="text-blue-600 hover:underline">
              Accédez à l'espace personnel
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BSelectionPage;
