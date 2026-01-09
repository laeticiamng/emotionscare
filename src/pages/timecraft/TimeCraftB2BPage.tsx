/**
 * TimeCraftB2BPage - Module TIMECRAFT pour organisations (B2B)
 * Design du temps collectif & charge humaine
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock,
  Building2,
  Users,
  BarChart3,
  GitCompare,
  AlertTriangle,
  Shield,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Play,
  Pause,
  Zap,
  Moon,
  Target,
  Brain,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

// Métriques agrégées exemple
const mockMetrics = {
  totalEmployees: 0,
  avgRecoveryTime: 0,
  avgConstraintTime: 0,
  riskZones: 0,
  weeklyTrend: 0,
};

const departments = [
  { id: 'all', name: 'Toute l\'organisation' },
  { id: 'tech', name: 'Technique' },
  { id: 'sales', name: 'Commercial' },
  { id: 'support', name: 'Support' },
  { id: 'hr', name: 'Ressources Humaines' },
];

export default function TimeCraftB2BPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  usePageSEO({
    title: 'TimeCraft Organisation - Design du temps collectif | EmotionsCare',
    description: 'Visualisez et optimisez la structure temporelle de votre organisation. Données agrégées et anonymisées.',
  });

  return (
    <main className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">TimeCraft</h1>
                <Badge>Organisation</Badge>
              </div>
              <p className="text-muted-foreground">
                Design du temps collectif & pilotage humain
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm">
                <GitCompare className="h-4 w-4 mr-2" />
                Nouveau scénario
              </Button>
            </div>
          </div>

          {/* Disclaimer éthique */}
          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Données agrégées & anonymisées</AlertTitle>
            <AlertDescription>
              Aucune donnée individuelle n'est accessible. Seules les tendances collectives sont visibles.
              Outil de pilotage humain, pas de contrôle social.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-4"
        >
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[200px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{mockMetrics.totalEmployees}</div>
              <div className="text-sm text-muted-foreground">Collaborateurs</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Moon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{mockMetrics.avgRecoveryTime}h</div>
              <div className="text-sm text-muted-foreground">Récupération moy.</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{mockMetrics.avgConstraintTime}h</div>
              <div className="text-sm text-muted-foreground">Contrainte moy.</div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{mockMetrics.riskZones}</div>
              <div className="text-sm text-muted-foreground">Zones à risque</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{mockMetrics.weeklyTrend}%</div>
              <div className="text-sm text-muted-foreground">Évolution</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Vue globale
            </TabsTrigger>
            <TabsTrigger value="heatmap">
              <Calendar className="h-4 w-4 mr-2" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="scenarios">
              <GitCompare className="h-4 w-4 mr-2" />
              Scénarios
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Rapports
            </TabsTrigger>
          </TabsList>

          {/* Vue globale */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Distribution des types de temps */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribution temporelle collective</CardTitle>
                  <CardDescription>Répartition moyenne par type de bloc</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Données insuffisantes</p>
                    <p className="text-sm mt-2">Minimum 5 collaborateurs requis pour l'agrégation</p>
                  </div>
                </CardContent>
              </Card>

              {/* Zones à surveiller */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Zones de vigilance
                  </CardTitle>
                  <CardDescription>Périodes ou équipes à surveiller</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune zone critique détectée</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Corrélation temps-émotion */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Corrélation temps ↔ bien-être
                </CardTitle>
                <CardDescription>
                  Mise en relation des données temporelles et émotionnelles agrégées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p>Les corrélations apparaîtront avec plus de données</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Heatmap */}
          <TabsContent value="heatmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Heatmap temporelle</CardTitle>
                <CardDescription>
                  Visualisation des zones de charge par équipe et période
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Heatmap en cours de génération...</p>
                  <p className="text-sm mt-2">Nécessite des données agrégées</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scénarios */}
          <TabsContent value="scenarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" />
                  Simulation de scénarios
                </CardTitle>
                <CardDescription>
                  "Et si on modifie le rythme ?" - Outil d'aide à la décision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="font-medium mb-1">Organisation actuelle</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        État présent de la structure temporelle
                      </p>
                      <Badge variant="outline">Référence</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-primary/30 bg-primary/5">
                    <CardContent className="p-6 text-center">
                      <Play className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h3 className="font-medium mb-1">Créer un scénario</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Simuler une réorganisation temporelle
                      </p>
                      <Button size="sm">
                        Nouveau scénario
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rapports */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Rapports stratégiques
                </CardTitle>
                <CardDescription>
                  Export pour Direction, RH, Comités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Rapport mensuel</div>
                          <div className="text-sm text-muted-foreground">
                            Synthèse des tendances temporelles
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Générer
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <div>
                          <div className="font-medium">Rapport zones à risque</div>
                          <div className="text-sm text-muted-foreground">
                            Alertes et recommandations préventives
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Générer
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
