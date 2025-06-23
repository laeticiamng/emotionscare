
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Brain, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  console.log('Home component is rendering'); // Debug log
  
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Plus de 15,000 professionnels nous font confiance
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
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

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Une approche révolutionnaire du bien-être
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez nos modules innovants conçus spécialement pour les professionnels de santé
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-lg border shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Scan Émotionnel IA</h3>
              <p className="text-muted-foreground">
                Analysez votre état émotionnel en temps réel grâce à notre IA avancée
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Coach Personnel</h3>
              <p className="text-muted-foreground">
                Un accompagnement personnalisé pour votre développement émotionnel
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sécurité Totale</h3>
              <p className="text-muted-foreground">
                Vos données sont protégées selon les plus hauts standards de sécurité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui ont déjà amélioré leur qualité de vie
          </p>
          <Button size="lg" asChild>
            <Link to="/choose-mode">
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
