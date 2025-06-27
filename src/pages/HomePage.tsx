
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Users, Building2, ArrowRight } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo et titre */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <Heart className="h-12 w-12 text-blue-600" />
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                  EmotionsCare
                </h1>
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            
            {/* Description principale */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              La plateforme de bien-être émotionnel dédiée aux professionnels de santé
            </p>
            
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              Découvrez une solution complète avec IA Coach, scan émotionnel, musicothérapie et suivi personnalisé 
              pour prendre soin de votre santé mentale au quotidien.
            </p>
            
            {/* Boutons d'action unifiés */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center max-w-lg mx-auto px-2 sm:px-4 mb-16">
              <Button
                onClick={() => navigate(UNIFIED_ROUTES.B2C_LOGIN)}
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Espace Personnel</span>
              </Button>
              
              <Button
                onClick={() => navigate(UNIFIED_ROUTES.B2B_SELECTION)}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold rounded-full transition-all duration-300"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Espace Entreprise</span>
              </Button>
            </div>

            {/* Boutons supplémentaires */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={() => navigate('/choose-mode')}
                size="lg" 
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                En savoir plus
              </Button>
            </div>
            
            {/* Fonctionnalités clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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

      {/* Section CTA finale */}
      <section className="py-24 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à prendre soin de votre bien-être émotionnel ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers de professionnels de santé qui utilisent déjà EmotionsCare 
              pour améliorer leur qualité de vie au travail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/choose-mode')}
                size="lg" 
                variant="secondary" 
                className="px-8 py-4 text-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
              >
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
