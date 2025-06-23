
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Brain, Music, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme premium de bien-être émotionnel pour une vie plus équilibrée
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/choose-mode">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Commencer maintenant
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
                Outils avancés pour gérer le stress et améliorer la santé mentale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Scanner émotionnel, journal personnalisé, musique thérapeutique et coaching IA.
              </p>
              <Link to="/scan">
                <Button variant="outline" size="sm">Explorer</Button>
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
                Conformité RGPD et protection maximale des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Vos données sont protégées avec les plus hauts standards de sécurité.
              </p>
              <Button variant="outline" size="sm">En savoir plus</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-500" />
                Solutions B2B & B2C
              </CardTitle>
              <CardDescription>
                Adapté aux particuliers et aux entreprises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Connectez-vous avec d'autres utilisateurs et bénéficiez d'un soutien communautaire.
              </p>
              <Link to="/choose-mode">
                <Button variant="outline" size="sm">Choisir le mode</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Accès rapide aux fonctionnalités</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/music" className="group">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-blue-300 transition-colors">
                <Music className="h-8 w-8 text-purple-500 group-hover:text-purple-600" />
                <div>
                  <h3 className="font-semibold">Musicothérapie</h3>
                  <p className="text-sm text-gray-600">Musique adaptée à vos émotions</p>
                </div>
              </div>
            </Link>

            <Link to="/coach" className="group">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-blue-300 transition-colors">
                <Brain className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
                <div>
                  <h3 className="font-semibold">Coach IA</h3>
                  <p className="text-sm text-gray-600">Assistant personnel intelligent</p>
                </div>
              </div>
            </Link>

            <Link to="/journal" className="group">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-blue-300 transition-colors">
                <BookOpen className="h-8 w-8 text-green-500 group-hover:text-green-600" />
                <div>
                  <h3 className="font-semibold">Journal émotionnel</h3>
                  <p className="text-sm text-gray-600">Suivez votre évolution</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre parcours ?</h2>
          <p className="text-lg mb-6 opacity-90">
            Choisissez votre mode d'accès et découvrez une nouvelle approche du bien-être émotionnel.
          </p>
          <Link to="/choose-mode">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Choisir mon mode d'accès
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
