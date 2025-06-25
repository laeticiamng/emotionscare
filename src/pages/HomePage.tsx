
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, Shield, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel. Découvrez un accompagnement personnalisé 
            pour améliorer votre santé mentale au quotidien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" onClick={() => navigate('/b2c')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-pink-500" />
              </div>
              <CardTitle className="text-2xl">Espace Particulier</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accédez à votre espace personnel pour un suivi individualisé de votre bien-être émotionnel.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Scan émotionnel personnalisé</li>
                <li>• Coach virtuel 24h/24</li>
                <li>• Musicothérapie adaptative</li>
                <li>• Journal émotionnel</li>
              </ul>
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                Accéder à l'espace particulier
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" onClick={() => navigate('/b2b/selection')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 className="h-16 w-16 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Solutions professionnelles pour le bien-être de vos collaborateurs et l'amélioration du climat de travail.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Tableau de bord RH</li>
                <li>• Analyses d'équipe</li>
                <li>• Rapports de bien-être</li>
                <li>• Gestion des utilisateurs</li>
              </ul>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Accéder à l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Sécurisé & Confidentiel</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Technologie IA avancée</span>
            </div>
          </div>
          
          <div className="space-x-4">
            <Button 
              onClick={() => navigate('/choose-mode')} 
              variant="outline"
              size="lg"
            >
              En savoir plus
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
