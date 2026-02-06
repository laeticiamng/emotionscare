/**
 * TimeCraftB2BPage - Module TIMECRAFT pour organisations (B2B)
 * Design du temps collectif & charge humaine
 */

import React, { useState, useCallback } from 'react';
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
  Zap,
  Moon,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

// Hooks TIMECRAFT
import { useOrgTimeAggregates } from '@/hooks/timecraft';

// Composants TIMECRAFT B2B
import { OrgHeatmap } from '@/components/timecraft/OrgHeatmap';
import { ScenarioSimulator } from '@/components/timecraft/ScenarioSimulator';
import { ReportExporter } from '@/components/timecraft/ReportExporter';

// Mock org ID pour la démo - à remplacer par le contexte B2B réel
const DEMO_ORG_ID = null; // Sera fourni par le contexte d'organisation

const departments = [
  { id: 'all', name: 'Toute l\'organisation' },
  { id: 'tech', name: 'Technique' },
  { id: 'sales', name: 'Commercial' },
  { id: 'support', name: 'Support' },
  { id: 'hr', name: 'Ressources Humaines' },
];

export default function TimeCraftB2BPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Hook données organisationnelles
  const {
    currentWeekStats,
    departmentStats,
    scenarios,
    heatmapData,
    isLoading,
    createScenario,
    simulateScenario,
    hasEnoughData,
    minimumCohortSize,
  } = useOrgTimeAggregates(DEMO_ORG_ID);

  usePageSEO({
    title: 'TimeCraft Organisation - Design du temps collectif | EmotionsCare',
    description: 'Visualisez et optimisez la structure temporelle de votre organisation. Données agrégées et anonymisées.',
  });

  // Calcul des métriques pour l'affichage
  const metrics = currentWeekStats?.aggregated_data || {
    totalEmployees: 0,
    avgRecoveryHours: 0,
    avgConstraintHours: 0,
    riskZoneCount: 0,
    weeklyTrend: 0,
  };

  const handleGenerateReport = useCallback(async (reportType: string, sections: string[]) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('generate-executive-report', {
        body: {
          reportType,
          sections,
          period: selectedPeriod,
          departmentId: selectedDepartment
        }
      });
      
      if (error) throw error;
      
      // Download the generated PDF
      if (data?.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      }
    } catch (error) {
      logger.error('Error generating report', error, 'TIMECRAFT');
    }
  }, [selectedPeriod, selectedDepartment]);

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
              <Button variant="outline" size="sm" onClick={() => setActiveTab('reports')}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm" onClick={() => setActiveTab('scenarios')}>
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
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : metrics.totalEmployees}
              </div>
              <div className="text-sm text-muted-foreground">Collaborateurs</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Moon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{metrics.avgRecoveryHours}h</div>
              <div className="text-sm text-muted-foreground">Récupération moy.</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{metrics.avgConstraintHours}h</div>
              <div className="text-sm text-muted-foreground">Contrainte moy.</div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{metrics.riskZoneCount}</div>
              <div className="text-sm text-muted-foreground">Zones à risque</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {metrics.weeklyTrend > 0 ? '+' : ''}{metrics.weeklyTrend}%
              </div>
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
            <OrgHeatmap
              heatmapData={heatmapData}
              departmentStats={departmentStats}
              hasEnoughData={hasEnoughData}
              minimumCohortSize={minimumCohortSize}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Heatmap */}
          <TabsContent value="heatmap" className="space-y-4">
            <OrgHeatmap
              heatmapData={heatmapData}
              departmentStats={departmentStats}
              hasEnoughData={hasEnoughData}
              minimumCohortSize={minimumCohortSize}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Scénarios */}
          <TabsContent value="scenarios" className="space-y-4">
            <ScenarioSimulator
              scenarios={scenarios}
              currentStats={currentWeekStats?.aggregated_data ? {
                avgRecoveryHours: currentWeekStats.aggregated_data.avgRecoveryHours,
                avgConstraintHours: currentWeekStats.aggregated_data.avgConstraintHours,
                avgEmotionalLoad: currentWeekStats.aggregated_data.avgEmotionalLoad,
              } : null}
              onSimulate={simulateScenario}
              onSaveScenario={createScenario}
              hasEnoughData={hasEnoughData}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Rapports */}
          <TabsContent value="reports" className="space-y-4">
            <ReportExporter
              hasEnoughData={hasEnoughData}
              onGenerateReport={handleGenerateReport}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
