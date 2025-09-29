import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * Dashboard unifié qui regroupe tous les modules EmotionsCare
 * Vue d'ensemble complète de l'activité utilisateur
 */
export default function UnifiedDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre parcours bien-être
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            🌟 Niveau 5
          </Badge>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humeur Moyenne</CardTitle>
              <span className="text-2xl">😊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2/10</div>
              <p className="text-xs text-muted-foreground">
                +0.5 depuis la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Coach IA</CardTitle>
              <span className="text-2xl">🧠</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                3 cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Musique</CardTitle>
              <span className="text-2xl">🎵</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12h</div>
              <p className="text-xs text-muted-foreground">
                2h aujourd'hui
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Défis Complétés</CardTitle>
              <span className="text-2xl">🎯</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/20</div>
              <p className="text-xs text-muted-foreground">
                75% de réussite
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activités récentes et modules actifs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activités récentes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activités Récentes</CardTitle>
              <CardDescription>
                Vos dernières interactions avec la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  🧠
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Session Coach IA</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Complétée
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  🎭
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Filtre AR Émotionnel</p>
                  <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Joie détectée
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  🎵
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Playlist Relaxation</p>
                  <p className="text-xs text-muted-foreground">Hier</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  45 min
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  🎮
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Boss Level - Défi</p>
                  <p className="text-xs text-muted-foreground">Hier</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  +50 XP
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progression et modules */}
          <div className="space-y-6">
            
            {/* Progression hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression</CardTitle>
                <CardDescription>Cette semaine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Objectifs atteints</span>
                    <span>3/5</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Temps bien-être</span>
                    <span>8h/12h</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Accès rapide aux modules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modules Favoris</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  🧠 Coach IA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎵 Musique Adaptive
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎭 Filtres AR
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📊 Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modules disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Tous les Modules</CardTitle>
            <CardDescription>
              Explorez tous les outils disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Coach IA", icon: "🧠", status: "active" },
                { name: "AR Filters", icon: "🎭", status: "active" },
                { name: "Musique", icon: "🎵", status: "active" },
                { name: "Boss Level", icon: "🎮", status: "active" },
                { name: "Analytics", icon: "📊", status: "active" },
                { name: "VR/Méditation", icon: "🥽", status: "active" },
                { name: "Journal", icon: "📝", status: "active" },
                { name: "Bubble Beat", icon: "🫧", status: "active" },
                { name: "Flash Glow", icon: "⚡", status: "active" },
                { name: "Breathwork", icon: "🫁", status: "active" },
                { name: "Story Synth", icon: "📚", status: "active" },
                { name: "Bounce Back", icon: "🏀", status: "active" }
              ].map((module) => (
                <Button
                  key={module.name}
                  variant="outline"
                  className="h-20 flex-col space-y-2 relative"
                >
                  <span className="text-2xl">{module.icon}</span>
                  <span className="text-xs text-center">{module.name}</span>
                  {module.status === "active" && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}