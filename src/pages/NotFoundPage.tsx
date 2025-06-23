
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('%c[NotFound] Page mounted', 'color:orange');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Page introuvable
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            La page que vous cherchez n'existe pas ou a été déplacée. 
            Retournez à l'accueil pour continuer votre navigation.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Accueil
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>EmotionsCare - Votre plateforme de bien-être émotionnel</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
