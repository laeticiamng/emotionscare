import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Page d'index simplifiée pour démontrer EmotionsCare
 * Cette page fonctionne sans les composants problématiques
 */
export default function SimpleIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Navigation simple */}
      <nav className="border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">EmotionsCare</div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Connexion</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            🧠 Plateforme de bien-être émotionnel
          </Badge>
          
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Votre Coach IA Personnel
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            EmotionsCare combine intelligence artificielle, réalité augmentée et musique thérapeutique 
            pour vous accompagner dans votre développement personnel et votre bien-être émotionnel.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link to="/dashboard">Découvrir maintenant</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8">
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Fonctionnalités principales */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Modules Intégrés
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  🧠
                </div>
                <CardTitle>Coach IA Empathique</CardTitle>
                <CardDescription>
                  Assistant intelligent pour votre accompagnement émotionnel quotidien
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Conversations naturelles, analyse des émotions et recommandations personnalisées 
                  basées sur vos besoins spécifiques.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  🎭
                </div>
                <CardTitle>Filtres AR Émotionnels</CardTitle>
                <CardDescription>
                  Reconnaissance faciale et expériences immersives en réalité augmentée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Détection d'émotions en temps réel avec filtres thérapeutiques 
                  et feedback visuel interactif.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  🎵
                </div>
                <CardTitle>Musique Adaptative</CardTitle>
                <CardDescription>
                  Compositions musicales qui s'adaptent automatiquement à vos émotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyse émotionnelle en temps réel avec génération de musique 
                  thérapeutique personnalisée.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  🎮
                </div>
                <CardTitle>Jeux Thérapeutiques</CardTitle>
                <CardDescription>
                  Boss Level, Ambition Arcade et autres modules gamifiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Développez votre résilience et motivation avec des défis progressifs 
                  et un système de récompenses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  📊
                </div>
                <CardTitle>Analytics Avancées</CardTitle>
                <CardDescription>
                  Suivi détaillé et prédictions IA de votre progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tableaux de bord personnalisés, rapports détaillés et 
                  recommandations basées sur vos données.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  🥽
                </div>
                <CardTitle>Réalité Virtuelle</CardTitle>
                <CardDescription>
                  Méditation immersive et exercices de relaxation 3D
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Environnements virtuels apaisants avec exercices de respiration 
                  et visualisations guidées.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">12+</div>
              <div className="text-muted-foreground">Modules intégrés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">IA</div>
              <div className="text-muted-foreground">Powered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Disponible</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Sécurisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez la plateforme de développement personnel la plus complète
          </p>
          <Button size="lg" className="h-12 px-8" asChild>
            <Link to="/dashboard">Commencer gratuitement</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-lg font-semibold text-primary mb-4">EmotionsCare</div>
          <p className="text-sm text-muted-foreground">
            Votre partenaire technologique pour un bien-être émotionnel optimal
          </p>
        </div>
      </footer>
    </div>
  );
}