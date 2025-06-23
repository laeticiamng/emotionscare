
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Plus de 15,000 professionnels nous font confiance
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Transformez votre
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
              bien-être émotionnel
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            La première plateforme IA dédiée aux professionnels de santé pour 
            gérer le stress, prévenir le burnout et cultiver la résilience émotionnelle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl"
              asChild
            >
              <Link to="/choose-mode">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-white border-white/30 hover:bg-white/10 px-8 py-4 text-lg"
              asChild
            >
              <Link to="/browsing">
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">94%</div>
              <div className="text-sm text-white/70">Réduction du stress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">15K+</div>
              <div className="text-sm text-white/70">Utilisateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-white/70">Support IA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
