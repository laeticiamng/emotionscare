
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Briefcase, Building } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400">
            EmotionsCare
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analysez et comprenez vos émotions pour améliorer votre bien-être et celui de votre équipe
          </p>
        </header>

        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* B2C Card */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Particuliers</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Analysez vos émotions personnelles et recevez des conseils adaptés pour votre bien-être
              </p>
              <div className="mt-auto space-y-3 w-full">
                <Button 
                  onClick={() => navigate('/b2c/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Connexion
                </Button>
                <Button 
                  onClick={() => navigate('/b2c/register')}
                  variant="outline" 
                  className="w-full"
                >
                  Inscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* B2B User Card */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Collaborateurs</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Suivez votre bien-être au travail et contribuez à l'amélioration de l'environnement professionnel
              </p>
              <div className="mt-auto space-y-3 w-full">
                <Button 
                  onClick={() => navigate('/b2b/user/login')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Connexion
                </Button>
                <Button 
                  onClick={() => navigate('/b2b/user/register')}
                  variant="outline" 
                  className="w-full"
                >
                  Inscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* B2B Admin Card */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Administrateurs</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Gérez les utilisateurs, analysez les données et pilotez le bien-être de votre organisation
              </p>
              <div className="mt-auto space-y-3 w-full">
                <Button 
                  onClick={() => navigate('/b2b/admin/login')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Connexion Admin
                </Button>
                <Button 
                  onClick={() => navigate('/b2b/selection')}
                  variant="outline" 
                  className="w-full"
                >
                  Sélection B2B
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with additional info */}
        <footer className="mt-20 text-center text-gray-500 dark:text-gray-400">
          <p>© 2025 EmotionsCare - Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
