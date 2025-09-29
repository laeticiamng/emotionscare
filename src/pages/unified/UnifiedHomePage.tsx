/**
 * UNIFIED HOME PAGE - Page d'accueil simplifiée
 * Version épurée pour éviter les erreurs de build
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout";
import { 
  ArrowRight, 
  Heart, 
  Brain, 
  Music,
  Camera,
  MessageCircle,
  Star,
  Play,
  Sparkles,
  Activity,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";

interface UnifiedHomePageProps {
  variant?: 'full' | 'b2c-simple';
}

export default function UnifiedHomePage({ variant = 'full' }: UnifiedHomePageProps) {
  
  // Version B2C Simple
  if (variant === 'b2c-simple') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">EmotionsCare</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link to="/signup">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" tabIndex={-1}>
          {/* Hero Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Prenez soin de votre bien-être émotionnel
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Découvrez une approche innovante du bien-être mental avec nos outils 
                d'analyse émotionnelle, de méditation guidée et de coaching personnalisé.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/signup">
                  <Button size="lg" className="px-8">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link to="/entreprise">
                  <Button size="lg" variant="outline" className="px-8">
                    Solutions entreprise
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Nos fonctionnalités phares
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Scan émotionnel IA</h3>
                    <p className="text-gray-600">
                      Analysez vos émotions en temps réel grâce à notre intelligence artificielle
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Music className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Musique Thérapeutique</h3>
                    <p className="text-gray-600">
                      Des expériences musicales personnalisées pour améliorer votre humeur
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Coach personnel IA</h3>
                    <p className="text-gray-600">
                      Un accompagnement personnalisé pour votre développement personnel
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Prêt à transformer votre bien-être ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="px-8">
                  Créer mon compte gratuit
                </Button>
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-bold">EmotionsCare</span>
            </div>
            <p className="text-gray-400">
              La plateforme de référence pour le bien-être émotionnel
            </p>
            <div className="mt-8 text-gray-400">
              <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Version Full Marketing
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content" tabIndex={-1} role="main">
        {/* Hero Section Enhanced */}
        <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-background via-background/80 to-primary/5">
          <div className="container relative z-10">
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    ✨ Nouveau : Assistant IA Nyvée disponible
                  </Badge>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                    EmotionsCare
                  </span>
                  <br />
                  <span className="text-3xl lg:text-5xl text-foreground/90 font-medium">
                    L'IA qui comprend vos émotions
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Découvrez la première plateforme d'intelligence émotionnelle pilotée par l'IA. 
                  <strong className="text-foreground"> Transformez votre bien-être</strong> avec des outils scientifiquement validés.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg" asChild>
                  <Link to="/b2c">
                    <Play className="h-5 w-5 mr-2" />
                    <span>Essai gratuit 30 jours</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50 px-8 py-4 text-lg" asChild>
                  <Link to="/entreprise">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <span>Solutions Entreprise</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Des outils révolutionnaires pour votre bien-être
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explorez notre écosystème complet d'outils d'IA émotionnelle, 
                conçus pour transformer votre quotidien personnel et professionnel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Scanner Émotionnel */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="space-y-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      Scanner Émotionnel
                      <Badge variant="secondary" className="text-xs">IA</Badge>
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Analysez vos émotions en temps réel avec notre technologie avancée
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Reconnaissance micro-expressions
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Analyse en continu
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Graphiques détaillés
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to="/app/scan">
                      Essayer maintenant
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Musique Thérapeutique */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="space-y-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      Musique Thérapeutique
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Compositions générées par IA selon votre état émotionnel
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Génération en temps réel
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Binaural beats
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Playlist adaptatives
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to="/app/music">
                      Découvrir
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Coach IA */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="space-y-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      Coach IA
                      <Badge variant="secondary" className="text-xs">Nyvée</Badge>
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Votre assistant personnel pour améliorer votre bien-être
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Conversations naturelles
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Conseils personnalisés
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Disponible 24/7
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to="/app/coach">
                      Commencer
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">25K+</div>
                <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">150K+</div>
                <div className="text-sm text-muted-foreground">Sessions quotidiennes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">98.7%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Disponibilité</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Prêt à transformer votre bien-être ?
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Rejoignez des milliers d'utilisateurs qui ont déjà révolutionné 
                leur approche du bien-être émotionnel avec EmotionsCare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
                  <Link to="/b2c">
                    <Play className="h-5 w-5 mr-2" />
                    Commencer gratuitement
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/entreprise">
                    <Building2 className="h-5 w-5 mr-2" />
                    Solutions entreprise
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}