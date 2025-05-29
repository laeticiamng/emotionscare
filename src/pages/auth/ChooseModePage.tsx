
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, Users } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Bienvenue sur EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choisissez votre mode d'accès à la plateforme
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-pink-100 dark:bg-pink-900 rounded-full w-fit">
                <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="text-2xl">Espace Personnel</CardTitle>
              <CardDescription>
                Accès individuel pour votre bien-être émotionnel personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Journal émotionnel privé</li>
                <li>• Scanner d'émotions personnalisé</li>
                <li>• Musique thérapeutique adaptée</li>
                <li>• Sessions VR de relaxation</li>
                <li>• Coach IA personnel</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2c/login')} 
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Accéder à l'espace personnel
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
              <CardDescription>
                Solutions pour le bien-être de vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Tableau de bord administrateur</li>
                <li>• Gestion des équipes</li>
                <li>• Analyses et rapports</li>
                <li>• Événements d'équipe</li>
                <li>• Cocon social sécurisé</li>
              </ul>
              <Button 
                onClick={() => navigate('/b2b/selection')} 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Accéder à l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte ? <Button variant="link" onClick={() => navigate(-1)}>Retour</Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
