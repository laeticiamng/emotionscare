/**
 * Export PDF du rapport émotionnel
 * Génère un rapport téléchargeable
 */

import { memo, useState } from 'react';
import { 
  Download, 
  FileText, 
  Loader2,
  Check,
  Calendar,
  TrendingUp,
  Heart,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface ScanReportData {
  userId: string;
  dateRange: { start: Date; end: Date };
  emotionScans: Array<{
    date: Date;
    emotions: { name: string; score: number }[];
    dominantEmotion: string;
    valence: number;
    arousal: number;
  }>;
  summary: {
    totalScans: number;
    averageValence: number;
    dominantEmotions: string[];
    trend: 'improving' | 'stable' | 'declining';
  };
}

interface ScanExportPDFProps {
  reportData?: ScanReportData;
  onExport?: (options: ExportOptions) => Promise<void>;
  className?: string;
}

interface ExportOptions {
  period: '7days' | '30days' | '90days' | 'custom';
  sections: {
    summary: boolean;
    dailyDetails: boolean;
    emotionChart: boolean;
    trends: boolean;
    recommendations: boolean;
  };
  format: 'pdf' | 'csv';
}

const DEFAULT_OPTIONS: ExportOptions = {
  period: '30days',
  sections: {
    summary: true,
    dailyDetails: true,
    emotionChart: true,
    trends: true,
    recommendations: true,
  },
  format: 'pdf',
};

export const ScanExportPDF = memo(function ScanExportPDF({
  reportData,
  onExport,
  className
}: ScanExportPDFProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>(DEFAULT_OPTIONS);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport(options);
      } else {
        // Simulation d'export
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      toast({
        title: 'Export réussi',
        description: `Votre rapport ${options.format.toUpperCase()} a été téléchargé`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible de générer le rapport',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSection = (key: keyof ExportOptions['sections']) => {
    setOptions(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: !prev.sections[key],
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Download className="h-4 w-4 mr-2" />
          Exporter le rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Exporter le rapport émotionnel
          </DialogTitle>
          <DialogDescription>
            Personnalisez votre rapport avant de le télécharger
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Période */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Période
            </Label>
            <RadioGroup
              value={options.period}
              onValueChange={(value) => setOptions(prev => ({ ...prev, period: value as ExportOptions['period'] }))}
              className="grid grid-cols-2 gap-2"
            >
              {[
                { value: '7days', label: '7 derniers jours' },
                { value: '30days', label: '30 derniers jours' },
                { value: '90days', label: '3 derniers mois' },
                { value: 'custom', label: 'Personnalisé' },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sections à inclure */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Sections à inclure
            </Label>
            <div className="space-y-2">
              {[
                { key: 'summary' as const, label: 'Résumé global', icon: TrendingUp },
                { key: 'dailyDetails' as const, label: 'Détails quotidiens', icon: Calendar },
                { key: 'emotionChart' as const, label: 'Graphiques émotionnels', icon: Heart },
                { key: 'trends' as const, label: 'Tendances et patterns', icon: TrendingUp },
                { key: 'recommendations' as const, label: 'Recommandations IA', icon: Brain },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={key}
                    checked={options.sections[key]}
                    onCheckedChange={() => toggleSection(key)}
                  />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor={key} className="text-sm cursor-pointer flex-1">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format de sortie</Label>
            <RadioGroup
              value={options.format}
              onValueChange={(value) => setOptions(prev => ({ ...prev, format: value as 'pdf' | 'csv' }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="text-sm cursor-pointer">PDF (visuel)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="text-sm cursor-pointer">CSV (données)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
