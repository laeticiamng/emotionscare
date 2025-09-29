import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Page d'accueil moderne pour EmotionsCare
 * Design premium avec tous les modules existants mis en valeur
 */
export default function ModernHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-14 pb-20 sm:px-8 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-sm">
              ✨ Plateforme de bien-être émotionnel
            </Badge>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Une expérience complète pour votre santé mentale avec IA, réalité augmentée, 
              musique thérapeutique et outils de développement personnel.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8">
                Commencer maintenant
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                Découvrir
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modules en vedette */}
      <section className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modules disponibles
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tous les outils dont vous avez besoin pour votre bien-être
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Coach IA */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  🧠
                </div>
                <CardTitle>Coach IA Empathique</CardTitle>
                <CardDescription>
                  Assistant IA personnalisé pour votre accompagnement émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Conversations naturelles</li>
                  <li>• Analyse des émotions</li>
                  <li>• Recommandations personnalisées</li>
                </ul>
              </CardContent>
            </Card>

            {/* Réalité Augmentée */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  🎭
                </div>
                <CardTitle>Filtres AR Émotionnels</CardTitle>
                <CardDescription>
                  Expérience immersive avec reconnaissance faciale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Détection d'émotions</li>
                  <li>• Filtres thérapeutiques</li>
                  <li>• Feedback visuel</li>
                </ul>
              </CardContent>
            </Card>

            {/* Musique Thérapeutique */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  🎵
                </div>
                <CardTitle>Musique Adaptative</CardTitle>
                <CardDescription>
                  Compositions musicales qui s'adaptent à vos émotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Analyse en temps réel</li>
                  <li>• Musique générative</li>
                  <li>• Playlists thérapeutiques</li>
                </ul>
              </CardContent>
            </Card>

            {/* Jeux Thérapeutiques */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  🎮
                </div>
                <CardTitle>Boss Level & Ambition</CardTitle>
                <CardDescription>
                  Jeux pour développer la résilience et la motivation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Défis progressifs</li>
                  <li>• Système de récompenses</li>
                  <li>• Suivi des progrès</li>
                </ul>
              </CardContent>
            </Card>

            {/* Analytics & Rapports */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  📊
                </div>
                <CardTitle>Analytics Avancées</CardTitle>
                <CardDescription>
                  Suivi détaillé de votre progression émotionnelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tableaux de bord</li>
                  <li>• Rapports personnalisés</li>
                  <li>• Prédictions IA</li>
                </ul>
              </CardContent>
            </Card>

            {/* VR & Méditation */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  🥽
                </div>
                <CardTitle>Expériences Immersives</CardTitle>
                <CardDescription>
                  Méditation et relaxation en réalité virtuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Environnements 3D</li>
                  <li>• Exercices de respiration</li>
                  <li>• Visualisations guidées</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">12+</div>
              <div className="text-sm text-muted-foreground">Modules intégrés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">AI</div>
              <div className="text-sm text-muted-foreground">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Sécurisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Rejoignez la plateforme de bien-être émotionnel la plus complète
          </p>
          <div className="mt-10">
            <Button size="lg" className="h-12 px-8">
              Créer votre compte gratuit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}