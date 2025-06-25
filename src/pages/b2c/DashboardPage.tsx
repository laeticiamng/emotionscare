import React from 'react';
import { 
  Heart, 
  Brain, 
  Music, 
  Camera, 
  MessageCircle, 
  Gamepad2, 
  Headphones,
  BookOpen,
  Settings 
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6" data-testid="page-root">
      
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Votre espace bien-être personnalisé
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez des outils innovants pour améliorer votre santé mentale
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Heart className="w-12 h-12 text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Scanner d'émotions</h3>
            <p className="text-gray-600 mb-4">Analysez votre humeur en temps réel</p>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
              Commencer
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Music className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Musicothérapie</h3>
            <p className="text-gray-600 mb-4">Musique adaptée à votre état d'esprit</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Écouter
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Brain className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coach IA</h3>
            <p className="text-gray-600 mb-4">Accompagnement personnalisé</p>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
              Discuter
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Headphones className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">VR Thérapie</h3>
            <p className="text-gray-600 mb-4">Expériences immersives apaisantes</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Explorer
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Gamepad2 className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Jeux thérapeutiques</h3>
            <p className="text-gray-600 mb-4">Mini-jeux pour le bien-être</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Jouer
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <BookOpen className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Journal numérique</h3>
            <p className="text-gray-600 mb-4">Exprimez vos pensées</p>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
              Écrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
