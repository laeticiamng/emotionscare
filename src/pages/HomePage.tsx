/**
 * HomePage - Page d'accueil EmotionsCare
 * Page d'accueil simple et fonctionnelle
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Music, Scan, BookOpen, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  console.log('🏠 HomePage rendering...');
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">EmotionsCare</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Connexion
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/signup">Inscription</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-gray-900">
            Votre bien-être émotionnel,{' '}
            <span className="text-blue-600">notre priorité</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez une plateforme d'intelligence émotionnelle qui vous accompagne 
            vers un mieux-être personnel et professionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/signup">Commencer gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="bg-gray-100 text-gray-900 hover:bg-gray-200">
              <Link to="/app">Accéder à l'application</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <Link to="/debug">Diagnostic de connexion</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Scan className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-gray-900">Scan Émotionnel</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Analysez vos émotions en temps réel avec notre technologie IA avancée
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-gray-900">Coach IA</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Recevez des conseils personnalisés de notre intelligence artificielle
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Music className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-gray-900">Thérapie Musicale</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Musiques thérapeutiques générées selon vos besoins émotionnels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-gray-900">Journal Émotionnel</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Suivez votre parcours émotionnel avec des insights personnalisés
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-gray-900">Exercices Flash</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Techniques d'apaisement rapide pour les moments difficiles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-gray-900">Suivi VR</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Expériences de réalité virtuelle pour la relaxation profonde
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gray-50">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-gray-600 mb-6">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
          </p>
          <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700">
            <Link to="/signup">Commencer maintenant</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            © 2024 EmotionsCare. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;