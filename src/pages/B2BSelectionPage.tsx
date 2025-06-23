
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Espace B2B - EmotionsCare</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choisissez votre type d'accès professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                <UserCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Collaborateur</CardTitle>
              <CardDescription className="text-base">
                Accès employé aux outils de bien-être
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Scanner émotionnel</li>
                <li>• Journal personnel</li>
                <li>• Activités de groupe</li>
                <li>• Suivi de progression</li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={() => navigate('/b2b/user/login')}
              >
                Connexion Collaborateur
              </Button>
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                size="sm"
                onClick={() => navigate('/b2b/user/register')}
              >
                Créer un compte
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900 rounded-full w-fit">
                <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl">Administrateur</CardTitle>
              <CardDescription className="text-base">
                Gestion et supervision d'équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Tableau de bord équipe</li>
                <li>• Analytics avancés</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Rapports détaillés</li>
              </ul>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                size="lg"
                onClick={() => navigate('/b2b/admin/login')}
              >
                Connexion Administrateur
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/choose-mode')}
            className="text-gray-600 dark:text-gray-400"
          >
            ← Retour au choix de mode
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BSelectionPage;
