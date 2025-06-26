
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import UnifiedActionButtons from '@/components/home/UnifiedActionButtons';
import CallToAction from '@/components/home/CallToAction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Shield, Users, Zap, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              La plateforme de bien-être émotionnel pour tous
            </p>
            
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              Découvrez une solution complète avec IA Coach, scan émotionnel, musicothérapie et suivi personnalisé 
              pour prendre soin de votre santé mentale au quotidien.
            </p>
            
            {/* Boutons d'accès unifiés B2B/B2C */}
            <UnifiedActionButtons />
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Particuliers & Entreprises</h3>
                <p className="text-gray-600">Solutions adaptées à tous les besoins</p>
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

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants pour votre bien-être émotionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Scan Émotionnel</CardTitle>
                <CardDescription>
                  Analyse instantanée de votre état émotionnel
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Musicothérapie</CardTitle>
                <CardDescription>
                  Musiques adaptées à votre humeur et vos besoins
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Coach IA</CardTitle>
                <CardDescription>
                  Accompagnement personnalisé par intelligence artificielle
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Suivi Personnalisé</CardTitle>
                <CardDescription>
                  Tableaux de bord détaillés et analytics avancés
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Gestion d'Équipe</CardTitle>
                <CardDescription>
                  Outils RH pour le bien-être de vos collaborateurs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Sécurité & Confidentialité</CardTitle>
                <CardDescription>
                  Protection maximale de vos données sensibles
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre parcours bien-être ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur vie émotionnelle
          </p>
          <UnifiedActionButtons />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
