
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Users, Zap } from 'lucide-react';

const TestHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel pour une vie plus épanouie et des équipes plus performantes
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/choose-mode">
              <Button size="lg" className="px-8 py-3">
                Commencer maintenant
              </Button>
            </Link>
            <Link to="/home">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Découvrir la plateforme
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Scan émotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Analysez votre état émotionnel en temps réel grâce à notre technologie avancée
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <CardTitle>Coach IA</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bénéficiez de conseils personnalisés avec votre coach virtuel disponible 24h/24
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <CardTitle>Communauté</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Rejoignez une communauté bienveillante et partagez vos expériences
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <CardTitle>Thérapies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Accédez à diverses thérapies : musicothérapie, VR, méditation et plus
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Explorez nos fonctionnalités
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { path: '/scan', label: 'Scan' },
              { path: '/journal', label: 'Journal' },
              { path: '/coach', label: 'Coach' },
              { path: '/music', label: 'Musique' },
              { path: '/vr', label: 'VR' },
              { path: '/meditation', label: 'Méditation' },
              { path: '/community', label: 'Communauté' },
              { path: '/gamification', label: 'Défis' },
              { path: '/settings', label: 'Paramètres' },
              { path: '/teams', label: 'Équipes' }
            ].map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="outline" className="w-full h-12">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t text-center text-gray-600">
          <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default TestHome;
