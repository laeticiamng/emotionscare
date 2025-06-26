
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, Heart } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page introuvable</h1>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Votre bien-être nous tient à cœur</h3>
            <p className="text-sm text-gray-600">
              Continuez votre parcours de bien-être en explorant nos fonctionnalités.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Page précédente
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Raccourcis utiles</h4>
          <div className="space-y-2">
            <Link to="/scan" className="block text-sm text-blue-700 hover:underline">
              🧠 Scanner émotionnel
            </Link>
            <Link to="/music" className="block text-sm text-blue-700 hover:underline">
              🎵 Musicothérapie
            </Link>
            <Link to="/journal" className="block text-sm text-blue-700 hover:underline">
              📝 Journal personnel
            </Link>
            <Link to="/coach" className="block text-sm text-blue-700 hover:underline">
              🤖 Coach IA
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Code d'erreur: 404 - Page non trouvée
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
