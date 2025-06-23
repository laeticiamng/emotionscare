
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';

const SocialCoconPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-pink-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Cocon</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez des liens authentiques et partagez votre parcours émotionnel en toute sécurité
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Communauté Bienveillante</h3>
            <p className="text-gray-600">
              Rejoignez une communauté de personnes partageant les mêmes valeurs de développement personnel
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Partage Sécurisé</h3>
            <p className="text-gray-600">
              Exprimez-vous librement dans un environnement modéré et bienveillant
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Support Mutuel</h3>
            <p className="text-gray-600">
              Donnez et recevez du soutien dans votre parcours de développement émotionnel
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Fonctionnalités à venir</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 rounded-full p-2">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Groupes thématiques</h3>
                <p className="text-gray-600 text-sm">
                  Rejoignez des groupes spécialisés selon vos centres d'intérêt et défis
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Événements virtuels</h3>
                <p className="text-gray-600 text-sm">
                  Participez à des sessions de méditation et ateliers collectifs
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-full p-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Messages privés</h3>
                <p className="text-gray-600 text-sm">
                  Connectez-vous en privé avec d'autres membres de la communauté
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 rounded-full p-2">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Défis collectifs</h3>
                <p className="text-gray-600 text-sm">
                  Participez à des défis de bien-être avec la communauté
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocialCoconPage;
