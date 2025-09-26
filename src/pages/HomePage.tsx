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
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EmotionsCare</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Inscription</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Votre bien-être émotionnel,{' '}
            <span className="text-primary">notre priorité</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez une plateforme d'intelligence émotionnelle qui vous accompagne 
            vers un mieux-être personnel et professionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Commencer gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/app">Accéder à l'application</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/debug">Diagnostic de connexion</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Scan className="h-6 w-6 text-primary" />
                <CardTitle>Scan Émotionnel</CardTitle>
              </div>
              <CardDescription>
                Analysez vos émotions en temps réel avec notre technologie IA avancée
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <CardTitle>Coach IA</CardTitle>
              </div>
              <CardDescription>
                Recevez des conseils personnalisés de notre intelligence artificielle
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Music className="h-6 w-6 text-primary" />
                <CardTitle>Thérapie Musicale</CardTitle>
              </div>
              <CardDescription>
                Musiques thérapeutiques générées selon vos besoins émotionnels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>Journal Émotionnel</CardTitle>
              </div>
              <CardDescription>
                Suivez votre parcours émotionnel avec des insights personnalisés
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>Exercices Flash</CardTitle>
              </div>
              <CardDescription>
                Techniques d'apaisement rapide pour les moments difficiles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary" />
                <CardTitle>Suivi VR</CardTitle>
              </div>
              <CardDescription>
                Expériences de réalité virtuelle pour la relaxation profonde
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-muted/50">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Commencer maintenant</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 EmotionsCare. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;