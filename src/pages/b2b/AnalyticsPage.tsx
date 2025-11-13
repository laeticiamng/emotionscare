import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, TrendingUp, Users, Activity, Clock } from 'lucide-react';

/**
 * Page d'analytics B2B pour les organisations
 */
export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart className="h-8 w-8" />
          Analytics Organisation
        </h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble des métriques et statistiques de votre organisation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">247</p>
                <p className="text-xs text-muted-foreground mt-1">+12% ce mois</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">1,834</p>
                <p className="text-xs text-muted-foreground mt-1">+8% ce mois</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temps moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">24m</p>
                <p className="text-xs text-muted-foreground mt-1">Par session</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">87%</p>
                <p className="text-xs text-muted-foreground mt-1">Taux d'adoption</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisation par module</CardTitle>
            <CardDescription>Répartition des sessions par fonctionnalité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Coach IA', value: 45, color: 'bg-blue-500' },
                { name: 'Journal', value: 30, color: 'bg-green-500' },
                { name: 'Music Therapy', value: 15, color: 'bg-purple-500' },
                { name: 'Scan Émotions', value: 10, color: 'bg-orange-500' },
              ].map((module) => (
                <div key={module.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{module.name}</span>
                    <span className="text-muted-foreground">{module.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${module.color} h-2 rounded-full transition-all`}
                      style={{ width: `${module.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances mensuelles</CardTitle>
            <CardDescription>Évolution de l'activité sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Graphique détaillé disponible prochainement
              </p>
              <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                <LineChart className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
