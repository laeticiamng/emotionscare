/**
 * GDPR Data Export Page
 * Allows users to export all their personal data (GDPR Article 20 - Right to Data Portability)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  FileJson,
  FileText,
  Shield,
  Info,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GDPRExportService } from '@/services/gdpr/GDPRExportService';
import { logger } from '@/lib/logger';

export default function GDPRDataExportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStats, setExportStats] = useState<{
    totalExports: number;
    lastExportDate: string | null;
    exportTypes: Record<string, number>;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadExportStats();
    }
  }, [user?.id]);

  const loadExportStats = async () => {
    if (!user?.id) return;

    setIsLoadingStats(true);
    try {
      const stats = await GDPRExportService.getExportStats(user.id);
      setExportStats(stats);
    } catch (error) {
      logger.error('Failed to load export stats', error, 'GDPR');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleExportJSON = async () => {
    if (!user?.id) return;

    setIsExporting(true);
    try {
      await GDPRExportService.exportAsJSON(user.id);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été exportées au format JSON',
      });

      // Reload stats
      await loadExportStats();
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter vos données',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!user?.id) return;

    setIsExporting(true);
    try {
      await GDPRExportService.exportAsPDF(user.id);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été exportées au format PDF',
      });

      // Reload stats
      await loadExportStats();
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter vos données',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Export de vos données</h1>
          <p className="text-muted-foreground mt-2">
            Conformément au RGPD (Article 20 - Droit à la portabilité), vous pouvez télécharger
            une copie complète de toutes vos données personnelles.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">
                Qu'est-ce qui est inclus dans l'export ?
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Informations de profil (nom, email, préférences)</li>
                <li>Toutes vos entrées de journal</li>
                <li>Historique de vos scans émotionnels</li>
                <li>Sessions d'activité et modules utilisés</li>
                <li>Consentements et paramètres de confidentialité</li>
                <li>Historique des exports précédents</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Statistics */}
      {!isLoadingStats && exportStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total des exports</p>
                <p className="text-2xl font-bold mt-1">{exportStats.totalExports}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Dernier export</p>
                <p className="text-lg font-semibold mt-1">
                  {exportStats.lastExportDate
                    ? new Date(exportStats.lastExportDate).toLocaleDateString('fr-FR')
                    : 'Jamais'}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Types d'export</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {Object.entries(exportStats.exportTypes).map(([type, count]) => (
                    <Badge key={type} variant="outline">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON Export */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileJson className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Export JSON</CardTitle>
                <CardDescription>Format structuré et réutilisable</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Données complètes et structurées</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Facile à réimporter dans d'autres systèmes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Format universel et lisible</span>
              </div>
            </div>

            <Separator />

            <Button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="w-full gap-2"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Télécharger JSON
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* PDF Export */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Export PDF</CardTitle>
                <CardDescription>Format imprimable et lisible</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Rapport formaté et organisé</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Facile à lire et à archiver</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Compatible avec tous les appareils</span>
              </div>
            </div>

            <Separator />

            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full gap-2"
              size="lg"
              variant="outline"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Télécharger PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Legal Information */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-base">Informations légales</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            ✓ Vos données sont exportées de manière sécurisée et chiffrée
          </p>
          <p>
            ✓ L'export est conforme au RGPD (Règlement Général sur la Protection des Données)
          </p>
          <p>
            ✓ Vous pouvez exporter vos données autant de fois que vous le souhaitez
          </p>
          <p>
            ✓ Aucune donnée n'est partagée avec des tiers lors de l'export
          </p>
          <p className="pt-2 border-t">
            Pour toute question concernant vos données, contactez-nous à{' '}
            <a href="mailto:privacy@emotionscare.com" className="text-primary hover:underline">
              privacy@emotionscare.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
