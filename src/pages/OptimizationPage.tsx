import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, PieChart, Users, Building2, BarChart2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface OptimizationMetric {
  id: number;
  name: string;
  score: number;
  improvement: number;
  status: 'improving' | 'declining' | 'stable';
}

const OptimizationPage: React.FC = () => {
  // Données de démo
  const [metrics, setMetrics] = useState<OptimizationMetric[]>([
    {
      id: 1,
      name: 'Bien-être général',
      score: 78,
      improvement: 6,
      status: 'improving'
    },
    {
      id: 2,
      name: 'Engagement',
      score: 65,
      improvement: -2,
      status: 'declining'
    },
    {
      id: 3,
      name: 'Productivité',
      score: 82,
      improvement: 4,
      status: 'improving'
    },
    {
      id: 4,
      name: 'Satisfaction',
      score: 71,
      improvement: 0,
      status: 'stable'
    },
    {
      id: 5,
      name: 'Communication',
      score: 69,
      improvement: 5,
      status: 'improving'
    }
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-green-500';
      case 'declining': return 'text-red-500';
      case 'stable': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return '↑';
    if (improvement < 0) return '↓';
    return '→';
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Lightbulb className="h-7 w-7" />
          Optimisation et Recommandations
        </h1>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres d'optimisation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">78%</CardTitle>
            <CardDescription>Score d'optimisation global</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progression mensuelle</span>
              <span className="text-sm font-medium text-green-500">+5%</span>
            </div>
            <Progress value={78} className="h-2 mt-1" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Recommandations actives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recommandations suivies</span>
              <span className="text-sm font-medium">7 / 12</span>
            </div>
            <Progress value={58} className="h-2 mt-1" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Actions prioritaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Impact potentiel</span>
              <span className="text-sm font-medium text-amber-500">Moyen à élevé</span>
            </div>
            <Progress value={85} className="h-2 mt-1" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Équipes
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organisation
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Métriques d'optimisation</CardTitle>
              <CardDescription>Suivez les métriques clés et leur évolution</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {metrics.map(metric => (
                  <motion.div 
                    key={metric.id} 
                    variants={itemVariants}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{metric.name}</h3>
                        <p className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                          {getImprovementIcon(metric.improvement)} {metric.improvement > 0 ? '+' : ''}{metric.improvement}% ce mois
                        </p>
                      </div>
                      <div className="text-xl font-semibold">{metric.score}%</div>
                    </div>
                    <Progress value={metric.score} className="h-2 mt-2" />
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Recommandations personnalisées</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Planifiez des sessions de feedback régulières pour améliorer l'engagement.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Encouragez l'utilisation des outils de bien-être pendant les heures de travail.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Organisez des événements de cohésion d'équipe pour renforcer les relations.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Optimisation par équipe</CardTitle>
              <CardDescription>Analysez les performances et le bien-être par équipe</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Graphiques d'optimisation par équipe (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Vision organisationnelle</CardTitle>
              <CardDescription>Optimisez votre structure organisationnelle</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Organigramme et recommandations (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Rapports personnalisés</CardTitle>
              <CardDescription>Générez des rapports d'optimisation</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Générateur de rapports (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationPage;
