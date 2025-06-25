
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building2, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Plateforme de bien-être émotionnel pour particuliers et entreprises. 
            Découvrez vos émotions, améliorez votre santé mentale et créez un environnement plus harmonieux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/b2c/login">
                <Heart className="h-5 w-5 mr-2" />
                Espace Particulier
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/b2b/selection">
                <Building2 className="h-5 w-5 mr-2" />
                Espace Entreprise
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Scan Émotionnel</CardTitle>
              <CardDescription>
                Analysez vos émotions en temps réel grâce à notre technologie avancée
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Coach Personnel</CardTitle>
              <CardDescription>
                Bénéficiez d'un accompagnement personnalisé avec notre IA coach
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Solutions Entreprise</CardTitle>
              <CardDescription>
                Outils de gestion du bien-être pour les équipes et organisations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Choisissez votre parcours et découvrez une nouvelle approche du bien-être émotionnel.
              </p>
              <Button asChild size="lg">
                <Link to="/choose-mode">
                  Commencer maintenant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
