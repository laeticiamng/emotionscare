
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Shield, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Link to="/choose-mode" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au choix de mode
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Espace Entreprise
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choisissez votre type d'accès
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Collaborateur */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Collaborateur
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accès aux outils de bien-être pour les employés
              </p>
              <div className="space-y-3">
                <Link to="/b2b/user/login" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/b2b/user/register" className="block">
                  <Button variant="outline" className="w-full">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Administrateur */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Administrateur
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Gestion et administration de l'organisation
              </p>
              <Link to="/b2b/admin/login">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Accès administrateur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
