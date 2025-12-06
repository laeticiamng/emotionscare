import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Settings, Shield, Crown, Zap, Target } from 'lucide-react';

const B2BAdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Crown className="w-4 h-4 mr-2" />
            Mode Administrateur RH
          </Badge>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Console d'Administration EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Gérez et analysez le bien-être émotionnel de votre organisation avec des outils RH avancés
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="management">Gestion</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collaborateurs Actifs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">+12% ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Score Bien-être Moyen</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7.8/10</div>
                  <p className="text-xs text-muted-foreground">+0.3 ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessions Musicothérapie</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,432</div>
                  <p className="text-xs text-muted-foreground">+28% ce mois</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités Administrateur</CardTitle>
                <CardDescription>Outils de gestion et d'analyse avancés</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    Analytiques Avancées
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Tableaux de bord personnalisables</li>
                    <li>• Rapports d'équipe détaillés</li>
                    <li>• Tendances émotionnelles historiques</li>
                    <li>• Alertes automatiques de bien-être</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Gestion Sécurisée
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Contrôle d'accès granulaire</li>
                    <li>• Anonymisation des données</li>
                    <li>• Conformité RGPD intégrée</li>
                    <li>• Audit trails complets</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques Détaillées</CardTitle>
                <CardDescription>Insights sur le bien-être organisationnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tableaux de Bord Avancés</h3>
                  <p className="text-muted-foreground mb-6">
                    Accédez à des analytics en temps réel sur le bien-être de vos équipes
                  </p>
                  <Button>Voir les Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Équipes</CardTitle>
                <CardDescription>Outils de management et d'intervention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Management Intelligent</h3>
                  <p className="text-muted-foreground mb-6">
                    Gérez vos équipes avec des outils RH intelligents et respectueux
                  </p>
                  <Button>Accéder à la Gestion</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Organisation</CardTitle>
                <CardDescription>Configuration et personnalisation de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configuration Avancée</h3>
                  <p className="text-muted-foreground mb-6">
                    Personnalisez EmotionsCare selon les besoins de votre organisation
                  </p>
                  <Button>Configurer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BAdminPage;