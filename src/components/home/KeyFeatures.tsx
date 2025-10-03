
import React from 'react';
import { Heart, Headphones, MessageCircle, Video } from 'lucide-react';

const KeyFeatures: React.FC = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">Fonctionnalités clés</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="bg-rose-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
            <Heart className="h-8 w-8 text-rose-500 transition-all duration-300 hover:scale-110" />
          </div>
          <h3 className="text-xl font-medium mb-2">Analyse émotionnelle</h3>
          <p className="text-gray-600">
            Analyse avancée par IA de vos émotions à travers le texte et la voix
          </p>
        </div>
        
        <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="bg-blue-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
            <Headphones className="h-8 w-8 text-blue-500 transition-all duration-300 hover:scale-110" />
          </div>
          <h3 className="text-xl font-medium mb-2">Musicothérapie</h3>
          <p className="text-gray-600">
            Musique adaptative générée en fonction de votre état émotionnel
          </p>
        </div>
        
        <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="bg-amber-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
            <MessageCircle className="h-8 w-8 text-amber-500 transition-all duration-300 hover:scale-110" />
          </div>
          <h3 className="text-xl font-medium mb-2">Coaching IA</h3>
          <p className="text-gray-600">
            Conseils personnalisés pour améliorer votre bien-être émotionnel
          </p>
        </div>
        
        <div className="text-center transform transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="bg-emerald-100 mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform duration-300 hover:scale-110">
            <Video className="h-8 w-8 text-emerald-500 transition-all duration-300 hover:scale-110" />
          </div>
          <h3 className="text-xl font-medium mb-2">VR thérapeutique</h3>
          <p className="text-gray-600">
            Expériences immersives pour calmer l'esprit et réduire l'anxiété
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
