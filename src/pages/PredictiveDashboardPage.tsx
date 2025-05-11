
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Brain, User, ArrowUpRight, Settings } from 'lucide-react';
import PredictiveFeatureList from '@/components/predictive/PredictiveFeatureList';
import PredictiveRecommendations from '@/components/predictive/PredictiveRecommendations';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import PredictiveAnalyticsDashboard from '@/components/admin/PredictiveAnalyticsDashboard';

const PredictiveDashboardPage: React.FC = () => {
  const { userMode } = useUserMode();
  const { user } = useAuth();
  const { isEnabled, setEnabled, generatePredictions } = usePredictiveAnalytics();
  
  // For B2B admin mode, show the admin dashboard
  if (userMode === 'b2b-admin') {
    return <PredictiveAnalyticsDashboard />;
  }
  
  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence prédictive</h1>
          <p className="text-muted-foreground">
            Une expérience ultra-personnalisée qui anticipe vos besoins
          </p>
        </div>
        <Button 
          onClick={() => generatePredictions()}
          className="gap-2 md:self-start"
        >
          <Sparkles className="h-4 w-4" />
          Actualiser les prédictions
        </Button>
      </div>
      
      <div className="mb-6 bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Intelligence prédictive {isEnabled ? 'activée' : 'désactivée'}</h2>
            <p className="text-muted-foreground">
              {isEnabled 
                ? "Votre expérience s'adapte automatiquement à vos besoins anticipés" 
                : "Activez l'intelligence prédictive pour une expérience ultra-personnalisée"}
            </p>
          </div>
        </div>
        <Button 
          variant={isEnabled ? "default" : "outline"}
          onClick={() => setEnabled(!isEnabled)}
        >
          {isEnabled ? "Désactiver" : "Activer"}
        </Button>
      </div>
      
      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-3 md:col-span-2">
              <PredictiveRecommendations className="h-full" />
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <div className="rounded-lg border p-4 h-full">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <User className="h-4 w-4" />
                  Votre profil prédictif
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Précision des prédictions</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Qualité des données</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Principales tendances</h4>
                    <div className="space-y-2">
                      <div className="bg-muted/40 p-2 rounded text-xs">
                        Période productive: 10h - 12h
                      </div>
                      <div className="bg-muted/40 p-2 rounded text-xs">
                        Préférence musicale: Ambient pour la concentration
                      </div>
                      <div className="bg-muted/40 p-2 rounded text-xs">
                        Motif détecté: Besoin de pauses toutes les 90min
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Voir le profil complet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features">
          <PredictiveFeatureList collapsible={false} />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres d'intelligence prédictive
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Fréquence d'analyse</h4>
                    <p className="text-sm text-muted-foreground">
                      Définit la fréquence à laquelle les prédictions sont générées
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      Toutes les heures
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Niveau de confidentialité</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure la sécurité et la vie privée
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="default">
                      Maximal
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Clarté des notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Définit le niveau de détail des insights prédictifs
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      Standard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Données d'apprentissage</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Le système d'intelligence prédictive utilise vos données pour améliorer ses prédictions. 
                Vous pouvez effacer ces données à tout moment.
              </p>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  Exporter mes données
                </Button>
                <Button variant="destructive" className="flex-1">
                  Effacer mes données
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveDashboardPage;
