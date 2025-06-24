
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Brain, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <Heart className="h-12 w-12 text-blue-600" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                EmotionsCare
              </h1>
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            La plateforme de bien-être émotionnel dédiée aux professionnels de santé
          </p>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            Découvrez une solution complète avec IA Coach, scan émotionnel, musicothérapie et suivi personnalisé 
            pour prendre soin de votre santé mentale au quotidien.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/choose-mode">
              <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700">
                Commencer maintenant
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              En savoir plus
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Pour les professionnels</h3>
              <p className="text-gray-600">Adapté aux besoins spécifiques du secteur médical</p>
            </div>
            <div className="flex flex-col items-center">
              <Brain className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">IA Avancée</h3>
              <p className="text-gray-600">Coach personnel intelligent et analyse émotionnelle</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Suivi Personnel</h3>
              <p className="text-gray-600">Tableaux de bord et insights personnalisés</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
