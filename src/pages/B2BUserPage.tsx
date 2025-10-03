import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Heart, Music, Brain, Shield } from 'lucide-react';

const B2BUserPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Mode Collaborateur
          </Badge>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            EmotionsCare pour les Équipes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Améliorez le bien-être émotionnel de vos collaborateurs avec notre plateforme IA complète
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Analyse Émotionnelle IA</CardTitle>
              <CardDescription>
                Détection avancée des émotions via Hume AI et OpenAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Analyse faciale en temps réel</li>
                <li>• Détection vocale des émotions</li>
                <li>• Analyse de texte comportementale</li>
                <li>• Rapports de bien-être personnalisés</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Musicothérapie IA</CardTitle>
              <CardDescription>
                Génération musicale personnalisée via Suno AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Compositions adaptées aux émotions</li>
                <li>• Playlists thérapeutiques automatiques</li>
                <li>• Sessions de relaxation guidées</li>
                <li>• Suivi de l'efficacité musicale</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Dashboard Équipe</CardTitle>
              <CardDescription>
                Vue d'ensemble du bien-être de l'équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Métriques d'équipe anonymisées</li>
                <li>• Alertes de bien-être</li>
                <li>• Recommandations d'amélioration</li>
                <li>• Intégration RH simplifiée</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary mr-3" />
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Prêt à améliorer le bien-être de votre équipe ?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Rejoignez des milliers d'entreprises qui font confiance à EmotionsCare
            </p>
            <Button size="lg" className="mr-4">
              Commencer l'essai gratuit
            </Button>
            <Button variant="outline" size="lg">
              Demander une démo
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserPage;