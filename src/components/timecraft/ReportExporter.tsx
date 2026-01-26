/**
 * ReportExporter - Export de rapports stratégiques B2B
 */
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Download,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  sections: string[];
}

interface ReportExporterProps {
  hasEnoughData: boolean;
  onGenerateReport?: (reportType: string, sections: string[]) => Promise<void>;
  isLoading?: boolean;
}

const reportTypes: ReportType[] = [
  {
    id: 'monthly',
    title: 'Rapport mensuel',
    description: 'Synthèse des tendances temporelles du mois',
    icon: Calendar,
    color: 'text-blue-600',
    sections: ['overview', 'trends', 'departments', 'recommendations'],
  },
  {
    id: 'risk',
    title: 'Rapport zones à risque',
    description: 'Alertes et recommandations préventives',
    icon: AlertTriangle,
    color: 'text-orange-600',
    sections: ['risk-zones', 'alerts', 'prevention', 'action-plan'],
  },
  {
    id: 'executive',
    title: 'Rapport direction',
    description: 'Vue stratégique pour le comité de direction',
    icon: TrendingUp,
    color: 'text-purple-600',
    sections: ['kpis', 'trends', 'scenarios', 'strategic-recommendations'],
  },
  {
    id: 'hr',
    title: 'Rapport RH',
    description: 'Données pour les ressources humaines',
    icon: Users,
    color: 'text-green-600',
    sections: ['wellbeing', 'workload', 'department-analysis', 'recommendations'],
  },
];

export const ReportExporter = memo(function ReportExporter({
  hasEnoughData,
  onGenerateReport,
}: ReportExporterProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenDialog = (report: ReportType) => {
    setSelectedReport(report);
    setSelectedSections(report.sections);
  };

  const handleCloseDialog = () => {
    setSelectedReport(null);
    setSelectedSections([]);
  };

  const handleToggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleGenerate = async () => {
    if (!selectedReport || !onGenerateReport) return;
    
    setIsGenerating(true);
    try {
      await onGenerateReport(selectedReport.id, selectedSections);
    } finally {
      setIsGenerating(false);
      handleCloseDialog();
    }
  };

  const sectionLabels: Record<string, string> = {
    overview: 'Vue d\'ensemble',
    trends: 'Tendances',
    departments: 'Analyse par département',
    recommendations: 'Recommandations',
    'risk-zones': 'Zones à risque identifiées',
    alerts: 'Alertes actives',
    prevention: 'Mesures préventives',
    'action-plan': 'Plan d\'action suggéré',
    kpis: 'KPIs stratégiques',
    scenarios: 'Scénarios simulés',
    'strategic-recommendations': 'Recommandations stratégiques',
    wellbeing: 'Indicateurs bien-être',
    workload: 'Charge de travail',
    'department-analysis': 'Analyse départementale',
  };

  return (
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
      <CardContent className="space-y-4">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-muted', report.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.description}
                      </div>
                    </div>
                  </div>
                  <Dialog
                    open={selectedReport?.id === report.id}
                    onOpenChange={(open) => open ? handleOpenDialog(report) : handleCloseDialog()}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!hasEnoughData}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Générer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Icon className={cn('h-5 w-5', report.color)} />
                          {report.title}
                        </DialogTitle>
                        <DialogDescription>
                          Sélectionnez les sections à inclure dans le rapport
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4 space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Période: {format(new Date(), 'MMMM yyyy', { locale: fr })}
                        </div>
                        
                        <div className="space-y-3">
                          {report.sections.map((section) => (
                            <div key={section} className="flex items-center space-x-3">
                              <Checkbox
                                id={section}
                                checked={selectedSections.includes(section)}
                                onCheckedChange={() => handleToggleSection(section)}
                              />
                              <Label
                                htmlFor={section}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {sectionLabels[section] || section}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                          Annuler
                        </Button>
                        <Button
                          onClick={handleGenerate}
                          disabled={selectedSections.length === 0 || isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Génération...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger PDF
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {!hasEnoughData && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Données insuffisantes pour générer des rapports
          </div>
        )}

        {/* Recent Reports */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Rapports récents</h4>
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun rapport généré</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ReportExporter;
