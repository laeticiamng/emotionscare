
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>EmotionsCare - Prendre soin de son bien-être émotionnel</title>
        <meta name="description" content="Plateforme de bien-être émotionnel avec IA, coaching personnalisé et outils de développement personnel" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Votre plateforme de bien-être émotionnel avec intelligence artificielle,
            coaching personnalisé et outils de développement personnel.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link to="/choose-mode">Commencer</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/b2c/login">Se connecter</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nos solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-500" />
                  Scanner émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Analysez vos émotions en temps réel grâce à l'intelligence artificielle
                  et recevez des recommandations personnalisées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-500" />
                  Coach IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bénéficiez d'un accompagnement personnalisé 24h/24 avec notre
                  coach intelligent adapté à vos besoins.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-500" />
                  Solution B2B
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Améliorez le bien-être de vos équipes avec notre plateforme
                  dédiée aux entreprises et organisations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
