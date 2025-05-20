
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { Button } from '@/components/ui/button';
import { Download, Play, Settings, Users } from 'lucide-react';

const B2BAdminOnboarding: React.FC = () => {
  return (
    <OnboardingProvider>
      <Helmet>
        <title>Formation & Onboarding | EmotionsCare Admin</title>
      </Helmet>
      
      <div className="container py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Formation & Onboarding</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les parcours de formation pour vos équipes et personnalisez l'onboarding
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </Button>
            <Button size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              <span>Commencer</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="team-onboarding">Onboarding équipe</TabsTrigger>
            <TabsTrigger value="materials">Ressources</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Formation RH</CardTitle>
                  <CardDescription>Formation complète au tableau de bord RH</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm">9 étapes</p>
                      <p className="text-2xl font-bold">15 min</p>
                    </div>
                    <Button>Lancer</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Onboarding collaborateur</CardTitle>
                  <CardDescription>Formation pour les nouveaux arrivants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm">7 étapes</p>
                      <p className="text-2xl font-bold">10 min</p>
                    </div>
                    <Button variant="outline">Modifier</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Personnaliser</CardTitle>
                  <CardDescription>Créer un parcours sur mesure</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button variant="ghost" className="w-full border border-dashed h-24">
                    + Nouveau parcours
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Progression de l'équipe</CardTitle>
                <CardDescription>Suivi de la formation des membres de votre équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>12 membres actifs</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      <span>Exporter</span>
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Onboarding RH terminé</h3>
                      <p className="text-sm text-muted-foreground">8/12 membres</p>
                    </div>
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Formation analytiques</h3>
                      <p className="text-sm text-muted-foreground">5/12 membres</p>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Module RGPD</h3>
                      <p className="text-sm text-muted-foreground">10/12 membres</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team-onboarding">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding de l'équipe</CardTitle>
                <CardDescription>Paramétrez le parcours d'intégration pour vos nouvelles recrues</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenu pour l'onboarding d'équipe...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Ressources de formation</CardTitle>
                <CardDescription>Accédez aux supports de formation et matériels pédagogiques</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenu pour les ressources de formation...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques de formation</CardTitle>
                <CardDescription>Suivez les métriques de progression et engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenu pour les analytiques de formation...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="fixed bottom-8 right-8">
          <OnboardingModal />
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default B2BAdminOnboarding;
