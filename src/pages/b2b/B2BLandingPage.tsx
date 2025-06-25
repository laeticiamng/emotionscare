
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Shield, Calendar, TrendingUp, Heart, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const B2BLandingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'business' | 'enterprise'>('business');

  const plans = {
    starter: {
      name: 'Starter',
      price: '49€',
      period: '/mois',
      users: 'Jusqu\'à 50 utilisateurs',
      features: ['Dashboard basique', 'Scan émotionnel', 'Rapports mensuels', 'Support email']
    },
    business: {
      name: 'Business',
      price: '149€',
      period: '/mois',
      users: 'Jusqu\'à 200 utilisateurs',
      features: ['Dashboard avancé', 'Analytics RH', 'Intégrations API', 'Support prioritaire', 'Coaching IA']
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Sur mesure',
      period: '',
      users: 'Utilisateurs illimités',
      features: ['Solution personnalisée', 'Déploiement on-premise', 'Support 24/7', 'Formation équipe', 'Audit conformité']
    }
  };

  const stats = [
    { label: 'Entreprises clientes', value: '250+', icon: Building2 },
    { label: 'Utilisateurs actifs', value: '15K+', icon: Users },
    { label: 'Réduction stress', value: '35%', icon: TrendingUp },
    { label: 'Satisfaction RH', value: '92%', icon: Heart },
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <Badge variant="secondary" className="mb-4">
            <Building2 className="w-4 h-4 mr-2" />
            Solution B2B EmotionsCare
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transformez le bien-être en entreprise
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Plateforme complète de gestion du bien-être émotionnel pour vos équipes. 
            Analytics RH, coaching IA et outils de prévention du burnout.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Calendar className="w-4 h-4 mr-2" />
              Réserver une démo
            </Button>
            <Button size="lg" variant="outline">
              Essai gratuit 14 jours
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Tabs */}
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics RH</TabsTrigger>
            <TabsTrigger value="wellness">Bien-être</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="integration">Intégration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Dashboard Analytics RH
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Bien-être global</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement équipe</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Risque burnout</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2 bg-red-100" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Tableaux de bord temps réel, alertes proactives et rapports détaillés pour accompagner vos décisions RH.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Modules Bien-être
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Zap className="w-6 h-6 mb-2 text-orange-500" />
                    <h3 className="font-medium mb-2">Coaching IA personnalisé</h3>
                    <p className="text-sm text-muted-foreground">Assistant virtuel adapté à chaque collaborateur</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Heart className="w-6 h-6 mb-2 text-red-500" />
                    <h3 className="font-medium mb-2">Scan émotionnel</h3>
                    <p className="text-sm text-muted-foreground">Analyse en temps réel du climat émotionnel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Conformité & Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-green-600 border-green-600">✓ RGPD</Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">✓ ISO 27001</Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">✓ HDS</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Données hébergées en France, chiffrement end-to-end, anonymisation automatique des données sensibles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intégrations natives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded text-center">Microsoft Teams</div>
                  <div className="p-3 border rounded text-center">Slack</div>
                  <div className="p-3 border rounded text-center">Workday</div>
                  <div className="p-3 border rounded text-center">SAP SuccessFactors</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pricing Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choisissez votre plan</CardTitle>
            <p className="text-muted-foreground">Tarification transparente, sans engagement</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([key, plan]) => (
                <div 
                  key={key}
                  className={`p-6 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan === key ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(key as any)}
                >
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.users}</p>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={selectedPlan === key ? 'default' : 'outline'}>
                      {key === 'enterprise' ? 'Nous contacter' : 'Commencer'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre entreprise ?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez plus de 250 entreprises qui font confiance à EmotionsCare pour le bien-être de leurs équipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Réserver une démo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Télécharger la brochure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BLandingPage;
