
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import { Heart, Brain, Users } from 'lucide-react';

/**
 * Page d'accueil immersive - Point d'entrée principal
 */
const ImmersiveHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              EmotionsCare
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Votre plateforme de bien-être émotionnel intelligente
            </p>
            <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
              Découvrez une approche révolutionnaire du bien-être grâce à l'IA, 
              la musicothérapie et l'analyse émotionnelle avancée.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={UNIFIED_ROUTES.CHOOSE_MODE}>
                <Button size="lg" className="text-lg px-8 py-3">
                  Commencer
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-gray-900">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pourquoi choisir EmotionsCare ?
            </h2>
            <p className="text-xl text-gray-300">
              Une approche holistique du bien-être émotionnel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-pink-500/20 rounded-full w-fit">
                  <Heart className="h-8 w-8 text-pink-400" />
                </div>
                <CardTitle className="text-xl">Intelligence Émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Analyse avancée de vos émotions par IA pour un accompagnement personnalisé.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-500/20 rounded-full w-fit">
                  <Brain className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-xl">Coach IA Personnel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Un assistant virtuel disponible 24/7 pour vous guider vers le bien-être.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-xl">Solutions Entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Outils RH avancés pour le bien-être et la productivité de vos équipes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 border-t border-white/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Prêt à transformer votre bien-être ?
          </h3>
          <p className="text-lg text-gray-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie.
          </p>
          <Link to={UNIFIED_ROUTES.CHOOSE_MODE}>
            <Button size="lg" className="text-lg px-8 py-3">
              Choisir mon mode d'accès
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
