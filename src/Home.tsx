
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building2, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToB2C = () => {
    navigate('/b2c/login');
  };

  const handleNavigateToB2B = () => {
    navigate('/b2b/selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Votre plateforme de bien-être émotionnel. Analysez, comprenez et améliorez votre santé mentale 
            avec des outils innovants d'intelligence artificielle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToB2C}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Espace Personnel</CardTitle>
              <CardDescription className="text-base">
                Accédez à votre tableau de bord personnel pour suivre votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" onClick={handleNavigateToB2C}>
                Accéder à mon espace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Scanner d'émotions, journal personnel, coach IA, musique thérapeutique
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToB2B}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
              <CardDescription className="text-base">
                Solutions de bien-être pour les équipes et organisations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full" onClick={handleNavigateToB2B}>
                Découvrir nos solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Gestion d'équipe, analytics, programmes de bien-être
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Communauté bienveillante</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rejoignez une communauté qui se soucie de votre bien-être
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Intelligence émotionnelle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Développez votre intelligence émotionnelle avec l'IA
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">Solutions entreprise</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Améliorez le bien-être de vos équipes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
