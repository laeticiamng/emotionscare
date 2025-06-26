
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Page précédente
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Vous cherchez quelque chose de spécifique ?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/choose-mode">
                <Button variant="ghost" size="sm">Se connecter</Button>
              </Link>
              <Link to="/coach">
                <Button variant="ghost" size="sm">IA Coach</Button>
              </Link>
              <Link to="/scan">
                <Button variant="ghost" size="sm">Scanner</Button>
              </Link>
              <Link to="/music">
                <Button variant="ghost" size="sm">Musique</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
