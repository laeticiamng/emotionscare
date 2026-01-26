import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, FileSpreadsheet, Loader2, Printer } from 'lucide-react';
import { downloadExcel, generatePrintablePDF } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface ExportPerformanceReportProps {
  testData: any[];
  metricsData: any[];
  mlPredictions?: any[];
  chartsContainerRef?: React.RefObject<HTMLDivElement>;
}

export const ExportPerformanceReport: React.FC<ExportPerformanceReportProps> = ({
  testData,
  metricsData,
  mlPredictions = [],
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);

  const generateMLRecommendations = (): string[] => {
    const recommendations: string[] = [];

    // Analyze test data
    const significantTests = testData.filter(t => 
      t.metadata?.confidence >= (t.confidence_level || 0.95)
    );

    if (significantTests.length > 0) {
      recommendations.push(
        `${significantTests.length} test(s) A/B ont atteint la significativité statistique. Déployez les variants gagnants pour améliorer les performances.`
      );
    }

    // Analyze metrics trends
    if (metricsData.length >= 3) {
      const recentMetrics = metricsData.slice(-3);
      const avgAccuracy = recentMetrics.reduce((sum, m) => sum + (m.escalation_accuracy || 0), 0) / recentMetrics.length;
      
      if (avgAccuracy < 70) {
        recommendations.push(
          `La précision moyenne des escalades est de ${avgAccuracy.toFixed(1)}%. Analysez les règles d'escalade pour identifier les opportunités d'optimisation.`
        );
      } else if (avgAccuracy > 90) {
        recommendations.push(
          `Excellente précision d'escalade (${avgAccuracy.toFixed(1)}%). Documentez les meilleures pratiques pour maintenir cette performance.`
        );
      }

      const avgResolutionTime = recentMetrics.reduce((sum, m) => sum + (m.avg_resolution_time_minutes || 0), 0) / recentMetrics.length;
      if (avgResolutionTime > 60) {
        recommendations.push(
          `Le temps de résolution moyen est de ${avgResolutionTime.toFixed(0)} minutes. Envisagez d'augmenter les ressources ou d'optimiser les processus.`
        );
      }
    }

    // Analyze ML predictions
    if (mlPredictions.length > 0) {
      const recentPredictions = mlPredictions.slice(0, 3);
      recentPredictions.forEach(pred => {
        if (pred.prediction_data?.recommendations) {
          recommendations.push(...pred.prediction_data.recommendations);
        }
      });
    }

    // Running tests recommendations
    const runningTests = testData.filter(t => t.status === 'running');
    if (runningTests.length > 0) {
      recommendations.push(
        `${runningTests.length} test(s) A/B en cours. Surveillez régulièrement les résultats pour détecter la significativité rapidement.`
      );
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        'Aucune recommandation spécifique pour le moment. Continuez à monitorer les performances et lancez de nouveaux tests A/B pour optimiser le système.',
        'Consultez régulièrement les patterns d\'erreurs pour identifier les tendances récurrentes.',
        'Configurez des alertes automatiques pour les métriques critiques afin d\'être notifié proactivement.'
      );
    }

    return recommendations.slice(0, 10); // Limit to top 10
  };

  const prepareExportData = () => {
    // Combine test data and metrics
    const exportData = testData.map(test => ({
      'Nom du test': test.name,
      'Statut': test.status,
      'Date création': new Date(test.created_at).toLocaleDateString('fr-FR'),
      'Échantillon': test.metadata?.sample_size || 0,
      'Gagnant': test.metadata?.current_winner || 'N/A',
      'Confiance': test.metadata?.confidence ? `${(test.metadata.confidence * 100).toFixed(1)}%` : 'N/A',
      'Taux contrôle': test.metadata?.control_metrics?.resolution_rate 
        ? `${(test.metadata.control_metrics.resolution_rate * 100).toFixed(1)}%` 
        : 'N/A',
      'Taux variant': test.metadata?.variant_metrics?.resolution_rate 
        ? `${(test.metadata.variant_metrics.resolution_rate * 100).toFixed(1)}%` 
        : 'N/A',
    }));

    return exportData;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const data = prepareExportData();
      const recommendations = includeRecommendations ? generateMLRecommendations() : [];

      generatePrintablePDF({
        title: 'Rapport de Performance A/B Tests & Escalades',
        subtitle: `Période: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')} - ${new Date().toLocaleDateString('fr-FR')}`,
        data,
        mlRecommendations: recommendations,
      });

      toast.success('Fenêtre d\'impression ouverte - Enregistrez comme PDF');
      setIsDialogOpen(false);
    } catch (error) {
      logger.error('Export PDF error:', error, 'COMPONENT');
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const data = prepareExportData();
      const recommendations = includeRecommendations ? generateMLRecommendations() : [];

      downloadExcel(
        {
          title: 'Rapport de Performance A/B Tests & Escalades',
          data,
          mlRecommendations: recommendations,
        },
        `rapport-performance-${new Date().toISOString().split('T')[0]}.xlsx`
      );

      toast.success('Rapport Excel généré avec succès');
      setIsDialogOpen(false);
    } catch (error) {
      logger.error('Export Excel error:', error, 'COMPONENT');
      toast.error('Erreur lors de la génération du fichier Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const stats = {
    totalTests: testData.length,
    significantTests: testData.filter(t => t.metadata?.confidence >= 0.95).length,
    recommendations: generateMLRecommendations().length,
    avgPerformance: metricsData.length > 0
      ? Math.round(metricsData.reduce((sum, m) => sum + (m.escalation_accuracy || 0), 0) / metricsData.length)
      : 0
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FileDown className="h-4 w-4" />
          Exporter le Rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exporter le Rapport de Performance</DialogTitle>
          <DialogDescription>
            Générez un rapport PDF ou Excel avec les graphiques, données et recommandations ML
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistics Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aperçu du Rapport</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tests A/B</p>
                <p className="text-2xl font-bold">{stats.totalTests}</p>
                <Badge variant="secondary" className="mt-1">
                  {stats.significantTests} significatifs
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance Moyenne</p>
                <p className="text-2xl font-bold">{stats.avgPerformance}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Recommandations ML</p>
                <p className="text-xl font-bold">{stats.recommendations} insights générés</p>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Options d'export</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-charts"
                checked={includeCharts}
                onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
              />
              <label
                htmlFor="include-charts"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Inclure les graphiques (PDF uniquement)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-recommendations"
                checked={includeRecommendations}
                onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
              />
              <label
                htmlFor="include-recommendations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Inclure les recommandations ML
              </label>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              Imprimer/PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              disabled={isExporting}
              variant="outline"
              className="flex-1 gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Exporter en Excel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            💡 Le PDF s'ouvre dans une fenêtre d'impression (Ctrl+P). 
            L'Excel contient les données brutes avec plusieurs feuilles.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
