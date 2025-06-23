
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Plateforme de bien-être émotionnel pour les professionnels de santé et les entreprises
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/choose-mode">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Commencer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/scan">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Scanner émotionnel
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500" />
                Bien-être émotionnel
              </CardTitle>
              <CardDescription>
                Outils pour gérer le stress et améliorer la santé mentale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Scanner émotionnel, journal, musique thérapeutique et plus encore.
              </p>
              <Link to="/scan">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Découvrir →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-500" />
                Sécurisé et confidentiel
              </CardTitle>
              <CardDescription>
                Conformité RGPD et protection des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Vos données sont protégées avec les plus hauts standards de sécurité.
              </p>
              <Link to="/privacy">
                <Button variant="ghost" className="text-green-600 hover:text-green-700">
                  En savoir plus →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-500" />
                Communauté
              </CardTitle>
              <CardDescription>
                Connectez-vous avec d'autres professionnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Partagez vos expériences et soutenez-vous mutuellement.
              </p>
              <Link to="/social-cocon">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                  Rejoindre →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-8">Accès rapide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link to="/music" className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🎵</div>
              <div className="text-sm font-medium">Musique</div>
            </Link>
            <Link to="/journal" className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">Journal</div>
            </Link>
            <Link to="/coach" className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-sm font-medium">Coach</div>
            </Link>
            <Link to="/vr" className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🥽</div>
              <div className="text-sm font-medium">VR</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
