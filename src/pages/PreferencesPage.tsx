
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

const PreferencesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Préférences</h1>
          <p className="text-gray-600">Personnalisez votre expérience EmotionsCare</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Profil</h2>
            </div>
            <p className="text-gray-600 mb-4">Gérez vos informations personnelles</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Modifier le profil
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <p className="text-gray-600 mb-4">Configurez vos alertes et rappels</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Paramétrer
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold">Confidentialité</h2>
            </div>
            <p className="text-gray-600 mb-4">Contrôlez la visibilité de vos données</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Gérer
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Palette className="h-6 w-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold">Apparence</h2>
            </div>
            <p className="text-gray-600 mb-4">Personnalisez l'interface</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Personnaliser
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
