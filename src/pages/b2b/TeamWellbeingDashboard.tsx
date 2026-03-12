/**
 * Team Wellbeing Dashboard for Ward Managers
 * Aggregate scores, heatmap, threshold alerts
 */
import React, { useState } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, Users, Calendar,
  BarChart3, Activity, Bell, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamWellbeingDashboard: React.FC = () => {
  usePageSEO({
    title: 'Dashboard Bien-être Équipe | EmotionsCare B2B',
    description: 'Tableau de bord de suivi du bien-être des équipes soignantes avec alertes et heatmap.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Dashboard Bien-être Équipe',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      description: 'Tableau de bord de suivi du bien-être des équipes soignantes avec scores anonymisés, heatmap et alertes seuils.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/ComingSoon' },
    },
  });

  const [period, setPeriod] = useState('3m');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/b2b/admin/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Bien-être Équipe
              </h1>
              <p className="text-sm text-muted-foreground">Suivi anonymisé • Seuil minimum : 5 répondants</p>
            </div>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 mois</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Empty state */}
        <Card className="mb-6">
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-semibold text-muted-foreground mb-2">Aucune donnée d'équipe disponible</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Les données de bien-être apparaîtront ici une fois que les membres de l'équipe auront commencé à renseigner leurs évaluations.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends" className="gap-2"><BarChart3 className="h-4 w-4" />Tendances</TabsTrigger>
            <TabsTrigger value="heatmap" className="gap-2"><Calendar className="h-4 w-4" />Heatmap</TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2"><Bell className="h-4 w-4" />Alertes</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution du score de bien-être</CardTitle>
                <CardDescription>Score agrégé anonymisé sur la période sélectionnée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                  Aucune donnée de tendance disponible
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Heatmap Shifts / Semaines</CardTitle>
                <CardDescription>Corrélation entre les créneaux et le bien-être collectif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                  Aucune donnée de heatmap disponible
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertes de seuil</CardTitle>
                <CardDescription>Notifications automatiques basées sur les variations de score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                  Aucune alerte active
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-8 pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Données anonymisées • Seuil de confidentialité : 5 répondants minimum • Aucune surveillance individuelle
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TeamWellbeingDashboard;
