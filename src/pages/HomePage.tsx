
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Brain, Music, Scan, MessageCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel et de santé mentale
          </p>
          <Link to="/choose-mode">
            <Button size="lg" className="text-lg px-8 py-3">
              Commencer votre parcours
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-blue-600" />
                Scan Émotionnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Analysez vos émotions en temps réel grâce à notre technologie avancée
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-purple-600" />
                Musique Thérapeutique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Découvrez des playlists personnalisées pour améliorer votre humeur
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Coach IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bénéficiez d'un accompagnement personnalisé 24h/24
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-orange-600" />
                Journal Personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suivez votre évolution émotionnelle avec notre journal intelligent
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Solution B2B
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Améliorez le bien-être de vos équipes avec nos outils professionnels
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Communauté
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Rejoignez une communauté bienveillante pour partager et grandir
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Prêt à commencer ?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/b2c/login">
              <Button variant="outline" size="lg">
                Espace Particulier
              </Button>
            </Link>
            <Link to="/b2b/selection">
              <Button variant="outline" size="lg">
                Espace Professionnel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
