
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, DollarSign, TrendingUp, Battery, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const OptimizationPage: React.FC = () => {
  // Mock data for charts and metrics
  const performanceData = [
    { month: 'Jan', engagement: 65, wellbeing: 72 },
    { month: 'Fév', engagement: 68, wellbeing: 74 },
    { month: 'Mar', engagement: 72, wellbeing: 78 },
    { month: 'Avr', engagement: 70, wellbeing: 76 },
    { month: 'Mai', engagement: 74, wellbeing: 80 },
    { month: 'Jun', engagement: 78, wellbeing: 82 }
  ];
  
  const suggestions = [
    {
      id: '1',
      title: 'Séances de méditation',
      description: 'Ajoutez des séances de méditation hebdomadaires pour améliorer la concentration',
      impact: 'Impact élevé',
      roi: '23%',
      difficulty: 'Facile'
    },
    {
      id: '2',
      title: 'Réduction des réunions',
      description: 'Optimisez le temps des réunions pour libérer du temps productif',
      impact: 'Impact moyen',
      roi: '15%',
      difficulty: 'Moyen'
    },
    {
      id: '3',
      title: 'Sessions d\'exercice',
      description: 'Intégrez de courtes pauses actives pour améliorer l\'énergie',
      impact: 'Impact élevé',
      roi: '18%',
      difficulty: 'Facile'
    }
  ];

  return (
    <UnifiedLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Optimisation</h1>
            <p className="text-muted-foreground">
              Améliorez le bien-être et la productivité de votre organisation
            </p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Indice de bien-être',
              value: '78/100',
              change: '+5%',
              icon: <Battery className="h-5 w-5 text-green-500" />,
              color: 'bg-green-500/10'
            },
            { 
              title: 'Productivité',
              value: '82%',
              change: '+3%',
              icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
              color: 'bg-blue-500/10'
            },
            { 
              title: 'Retour sur investissement',
              value: '22%',
              change: '+8%',
              icon: <DollarSign className="h-5 w-5 text-purple-500" />,
              color: 'bg-purple-500/10'
            },
            { 
              title: 'Engagement',
              value: '73%',
              change: '+6%',
              icon: <Zap className="h-5 w-5 text-amber-500" />,
              color: 'bg-amber-500/10'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-full ${metric.color}`}>
                      {metric.icon}
                    </div>
                    <div className="text-xs font-medium text-green-600">
                      {metric.change}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {metric.value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <Tabs defaultValue="analytics" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="analytics" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Suggestions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance et bien-être</CardTitle>
                <CardDescription>
                  Évolution du bien-être et de l'engagement au cours des 6 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Graphique d'analyse des tendances de performance
                    </p>
                    <Button className="mt-4" variant="outline">
                      Afficher le rapport complet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">{suggestion.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-medium">{suggestion.impact}</div>
                          <div className="text-xs text-muted-foreground">Impact</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-600">{suggestion.roi}</div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                        <div>
                          <div className="font-medium">{suggestion.difficulty}</div>
                          <div className="text-xs text-muted-foreground">Difficulté</div>
                        </div>
                      </div>
                      <Button className="w-full">Mettre en œuvre</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default OptimizationPage;
