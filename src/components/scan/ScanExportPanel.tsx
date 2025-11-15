import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download, FileJson, FileText, FileUp, Copy, Share2,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import {
  exportAsJSON,
  exportAsCSV,
  exportAsPDF,
  generateTextSummary,
  copyToClipboard,
  shareData
} from '@/lib/scan/exportUtils';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'json' | 'csv' | 'pdf' | 'all';

const ExportOption: React.FC<{
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  isLoading: boolean;
  onClick: () => void;
}> = ({ format, label, description, icon, isLoading, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="w-full text-left p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 text-muted-foreground">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">{label}</h4>
          <Badge variant="outline" className="text-xs">
            {format.toUpperCase()}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export const ScanExportPanel: React.FC = () => {
  const { data: history = [] } = useScanHistory(100);
  const { toast } = useToast();
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);
  const [lastExport, setLastExport] = useState<ExportFormat | null>(null);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (history.length === 0) {
        toast({
          title: 'Aucune donnée',
          description: 'Vous n\'avez pas encore de scans à exporter.',
          variant: 'destructive'
        });
        return;
      }

      try {
        setLoadingFormat(format);

        if (format === 'json') {
          exportAsJSON(history);
        } else if (format === 'csv') {
          exportAsCSV(history);
        } else if (format === 'pdf') {
          await exportAsPDF(history);
        } else if (format === 'all') {
          // Effectuer les exports les plus importants
          exportAsJSON(history);
          exportAsCSV(history);
          await exportAsPDF(history);
        }

        setLastExport(format);
        toast({
          title: 'Export réussi',
          description: `Vos données ont été exportées en format ${format.toUpperCase()}.`,
          duration: 3000
        });
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        toast({
          title: 'Erreur d\'export',
          description: 'Une erreur s\'est produite lors de l\'export.',
          variant: 'destructive'
        });
      } finally {
        setLoadingFormat(null);
      }
    },
    [history, toast]
  );

  const handleCopySummary = useCallback(async () => {
    if (history.length === 0) return;

    const summary = generateTextSummary(history);
    const success = await copyToClipboard(summary);

    if (success) {
      toast({
        title: 'Copié',
        description: 'Le résumé a été copié au presse-papiers.',
        duration: 2000
      });
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier au presse-papiers.',
        variant: 'destructive'
      });
    }
  }, [history, toast]);

  const handleShare = useCallback(async () => {
    if (history.length === 0) return;

    const success = await shareData(history);

    if (!success) {
      toast({
        title: 'Partage non disponible',
        description: 'Le partage n\'est pas disponible sur votre appareil.',
        variant: 'destructive'
      });
    }
  }, [history, toast]);

  const statsText = history.length > 0
    ? `${history.length} scans · ${new Date(history[history.length - 1].created_at).toLocaleDateString('fr-FR')} à ${new Date(history[0].created_at).toLocaleDateString('fr-FR')}`
    : 'Aucun scan à exporter';

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter vos données
          </CardTitle>
          <CardDescription>
            Téléchargez vos données émotionnelles en différents formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium">{statsText}</p>
            <p className="text-xs text-muted-foreground mt-2">
              ✓ Vos données sont chiffrées et sécurisées
              <br />
              ✓ Vous pouvez les supprimer à tout moment
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Options d'export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choisir un format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ExportOption
            format="json"
            label="JSON"
            description="Format technique, idéal pour l'intégration avec d'autres applications"
            icon={<FileJson className="w-5 h-5" />}
            isLoading={loadingFormat === 'json'}
            onClick={() => handleExport('json')}
          />

          <ExportOption
            format="csv"
            label="CSV (Excel)"
            description="Ouvrez dans Excel ou Google Sheets pour analyser vos données"
            icon={<FileText className="w-5 h-5" />}
            isLoading={loadingFormat === 'csv'}
            onClick={() => handleExport('csv')}
          />

          <ExportOption
            format="pdf"
            label="PDF"
            description="Rapport professionnel à imprimer ou partager"
            icon={<FileUp className="w-5 h-5" />}
            isLoading={loadingFormat === 'pdf'}
            onClick={() => handleExport('pdf')}
          />

          <ExportOption
            format="all"
            label="Tous les formats"
            description="Télécharge JSON, CSV et PDF en une seule action"
            icon={<Download className="w-5 h-5" />}
            isLoading={loadingFormat === 'all'}
            onClick={() => handleExport('all')}
          />
        </CardContent>
      </Card>

      {/* Autres actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Autres options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleCopySummary}
            disabled={history.length === 0}
          >
            <Copy className="w-4 h-4" />
            Copier le résumé
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleShare}
            disabled={history.length === 0}
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
        </CardContent>
      </Card>

      {/* Dernier export */}
      {lastExport && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-green-900">Export réussi</h4>
            <p className="text-xs text-green-700 mt-1">
              Votre fichier a été téléchargé. Vérifiez votre dossier Téléchargements.
            </p>
          </div>
        </div>
      )}

      {/* Informations de confidentialité */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-blue-900">Confidentialité</h4>
          <p className="text-xs text-blue-700 mt-1">
            Ces données sont sensibles et contiennent des informations personnelles. Stockez-les de manière sécurisée et ne les partagez qu'avec des personnes de confiance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanExportPanel;
