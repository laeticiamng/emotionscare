import React, { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/notification-system';
import { exportToExcel } from '@/services/excelExportService';
import type { AuditExportFilters } from '@/services/roleAuditExportService';

interface ExcelExporterProps {
  filters: AuditExportFilters;
}

export const ExcelExporter: React.FC<ExcelExporterProps> = ({ filters }) => {
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(filters);
      toast.success('Export réussi', 'Le fichier Excel a été téléchargé avec succès.');
    } catch (error) {
      toast.error(
        'Erreur d\'export',
        error instanceof Error ? error.message : 'Impossible d\'exporter le rapport'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Excel Complet</CardTitle>
        <CardDescription>
          Téléchargez un rapport complet avec statistiques, logs détaillés et analyses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Le fichier Excel contient :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Statistiques générales et alertes de sécurité</li>
              <li>Logs détaillés de tous les changements</li>
              <li>Analyse temporelle hebdomadaire</li>
              <li>Activité des administrateurs</li>
            </ul>
          </div>
          
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exporter en Excel
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
