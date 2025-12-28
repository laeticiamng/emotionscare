import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logger';
import {
  Download, FileJson, FileText, FileUp, Copy, Share2,
  CheckCircle2, AlertCircle, Loader2, History, BarChart3,
  Calendar, TrendingUp, Clock
} from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import { useScanSettings, ExportRecord } from '@/hooks/useScanSettings';
import {
  exportAsJSON,
  exportAsCSV,
  exportAsPDF,
  generateTextSummary,
  copyToClipboard,
  shareData
} from '@/lib/scan/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

type ExportFormat = 'json' | 'csv' | 'pdf' | 'all';

const ExportOption: React.FC<{
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  isLoading: boolean;
  onClick: () => void;
}> = ({ format, label, description, icon, isLoading, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
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
  </motion.button>
);

export const ScanExportPanel: React.FC = () => {
  const { data: history = [] } = useScanHistory(100);
  const { toast } = useToast();
  const { exportHistory, addExportRecord } = useScanSettings();
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);
  const [lastExport, setLastExport] = useState<ExportFormat | null>(null);
  const [activeTab, setActiveTab] = useState('export');
  const [localExportHistory, setLocalExportHistory] = useState<ExportRecord[]>(exportHistory);

  // Sync from hook
  useEffect(() => {
    setLocalExportHistory(exportHistory);
  }, [exportHistory]);

  const saveExportRecord = useCallback((format: ExportFormat, itemCount: number) => {
    addExportRecord({
      format,
      date: new Date().toISOString(),
      itemCount
    });
  }, [addExportRecord]);

  // Statistics - calculées dynamiquement
  const stats = useMemo(() => {
    if (history.length === 0) return null;
    
    const firstDate = new Date(history[history.length - 1].created_at);
    const lastDate = new Date(history[0].created_at);
    const daySpan = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    
    // Calculer les émotions uniques depuis les summaries
    const uniqueEmotionsSet = new Set(
      history
        .map(s => s.summary?.toLowerCase().trim())
        .filter(Boolean)
    );
    
    // Calculer la confiance moyenne - utiliser valence comme proxy si confiance non disponible
    const confidenceValues = history
      .map(s => {
        const meta = s as any;
        // Prioriser confidence, sinon calculer à partir de la valence absolue
        const conf = meta?.confidence ?? meta?.metadata?.confidence;
        if (typeof conf === 'number' && conf > 0) return conf;
        // Proxy: valence élevée = plus de confiance dans la détection
        if (typeof s.valence === 'number') {
          return Math.min(95, 50 + Math.abs(s.valence) * 0.4);
        }
        return null;
      })
      .filter((c): c is number => typeof c === 'number' && c > 0);
    
    const avgConfidence = confidenceValues.length > 0
      ? Math.round(confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length)
      : 75; // Valeur par défaut si aucune donnée
    
    return {
      totalScans: history.length,
      uniqueEmotions: uniqueEmotionsSet.size,
      avgConfidence,
      daySpan,
      avgPerDay: (history.length / daySpan).toFixed(1),
      totalExports: exportHistory.length
    };
  }, [history, exportHistory]);

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
          exportAsJSON(history);
          exportAsCSV(history);
          await exportAsPDF(history);
        }

        saveExportRecord(format, history.length);
        setLastExport(format);
        toast({
          title: 'Export réussi',
          description: `Vos données ont été exportées en format ${format.toUpperCase()}.`,
          duration: 3000
        });
      } catch (error) {
        logger.error('Erreur lors de l\'export:', error, 'COMPONENT');
        toast({
          title: 'Erreur d\'export',
          description: 'Une erreur s\'est produite lors de l\'export.',
          variant: 'destructive'
        });
      } finally {
        setLoadingFormat(null);
      }
    },
    [history, toast, saveExportRecord]
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4 mt-4">
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
          <AnimatePresence>
            {lastExport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3 dark:bg-green-900/20 dark:border-green-800"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-green-900 dark:text-green-100">Export réussi</h4>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Votre fichier a été téléchargé. Vérifiez votre dossier Téléchargements.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistiques globales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-primary/10 text-center"
                  >
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.totalScans}</div>
                    <div className="text-xs text-muted-foreground">Scans totaux</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-lg bg-accent/10 text-center"
                  >
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="text-2xl font-bold">{stats.uniqueEmotions}</div>
                    <div className="text-xs text-muted-foreground">Émotions uniques</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-lg bg-green-500/10 text-center"
                  >
                    <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
                    <div className="text-xs text-muted-foreground">Confiance moy.</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-lg bg-blue-500/10 text-center"
                  >
                    <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{stats.daySpan}</div>
                    <div className="text-xs text-muted-foreground">Jours de suivi</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-lg bg-amber-500/10 text-center"
                  >
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                    <div className="text-2xl font-bold">{stats.avgPerDay}</div>
                    <div className="text-xs text-muted-foreground">Scans/jour</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-lg bg-purple-500/10 text-center"
                  >
                    <Download className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{stats.totalExports}</div>
                    <div className="text-xs text-muted-foreground">Exports réalisés</div>
                  </motion.div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucune donnée disponible
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des exports
              </CardTitle>
              <CardDescription>
                Vos 20 derniers exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exportHistory.length > 0 ? (
                <div className="space-y-2">
                  {exportHistory.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{record.format.toUpperCase()}</Badge>
                        <span className="text-sm">{record.itemCount} scans</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(record.date).toLocaleString('fr-FR')}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun export réalisé
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations de confidentialité */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3 dark:bg-blue-900/20 dark:border-blue-800">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Confidentialité</h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Ces données sont sensibles et contiennent des informations personnelles. Stockez-les de manière sécurisée et ne les partagez qu'avec des personnes de confiance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanExportPanel;
