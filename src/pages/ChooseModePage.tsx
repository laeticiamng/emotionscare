
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre mode d'accès</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sélectionnez le type de compte qui vous correspond
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Particuliers (B2C)</CardTitle>
              <CardDescription className="text-base">
                Accès personnel pour votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Scanner émotionnel personnel</li>
                <li>• Journal de bord privé</li>
                <li>• Musicothérapie adaptée</li>
                <li>• Coach IA personnel</li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                size="lg"
                onClick={() => navigate('/b2c/login')}
              >
                Accès Particuliers
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">Entreprises (B2B)</CardTitle>
              <CardDescription className="text-base">
                Solutions pour les organisations et équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Tableau de bord équipe</li>
                <li>• Analytics et rapports</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Support dédié</li>
              </ul>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                size="lg"
                onClick={() => navigate('/b2b/selection')}
              >
                Accès Entreprises
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-gray-600 dark:text-gray-400"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
