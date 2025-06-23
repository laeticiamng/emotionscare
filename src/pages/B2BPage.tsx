
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Settings, BarChart3 } from 'lucide-react';

const B2BPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EmotionsCare B2B
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Solutions d'accompagnement émotionnel pour les entreprises
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Espace Collaborateur</h2>
            <p className="text-gray-600 mb-6">
              Accédez à votre espace personnel de bien-être et développement émotionnel.
            </p>
            <div className="space-y-3">
              <Link
                to="/b2b/user/login"
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Connexion Collaborateur
              </Link>
              <Link
                to="/b2b/user/register"
                className="block w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg text-center hover:bg-blue-50 transition-colors"
              >
                Inscription Collaborateur
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
            <Settings className="h-8 w-8 text-purple-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Espace Administration</h2>
            <p className="text-gray-600 mb-6">
              Gérez votre organisation et suivez le bien-être de vos équipes.
            </p>
            <div className="space-y-3">
              <Link
                to="/b2b/admin/login"
                className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg text-center hover:bg-purple-700 transition-colors"
              >
                Connexion Administrateur
              </Link>
              <Link
                to="/b2b/selection"
                className="block w-full border border-purple-600 text-purple-600 py-3 px-6 rounded-lg text-center hover:bg-purple-50 transition-colors"
              >
                Sélection de rôle
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <BarChart3 className="h-8 w-8 text-green-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Fonctionnalités B2B</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Gestion d'équipes</h3>
              <p className="text-sm text-gray-600">Organisez et suivez vos collaborateurs</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Rapports détaillés</h3>
              <p className="text-sm text-gray-600">Analyses et métriques complètes</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Configuration avancée</h3>
              <p className="text-sm text-gray-600">Personnalisez votre plateforme</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BPage;
