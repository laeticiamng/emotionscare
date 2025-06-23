
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, User, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              EmotionsCare
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel pour particuliers et entreprises
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option B2C */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Particulier
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accédez à vos outils de bien-être personnel, suivez vos émotions et découvrez des ressources adaptées à vos besoins.
              </p>
              <Link to="/b2c/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Commencer mon parcours
                </Button>
              </Link>
            </div>
          </div>

          {/* Option B2B */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Entreprise
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Solutions de bien-être pour vos équipes avec suivi des performances et outils de gestion RH.
              </p>
              <Link to="/b2b/selection">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Découvrir nos solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            Déjà un compte ? 
            <Link to="/choose-mode" className="text-blue-600 hover:text-blue-700 ml-1">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
