import React, { useRef } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/notification-system';
import { exportAuditReportToPDF } from '@/services/auditReportExportService';
import type { AuditExportFilters } from '@/services/roleAuditExportService';

interface AuditReportExporterProps {
  filters: AuditExportFilters;
  reportElementId?: string;
}

export const AuditReportExporter: React.FC<AuditReportExporterProps> = ({
  filters,
  reportElementId = 'audit-report-container',
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const toast = useToast();

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      const reportElement = document.getElementById(reportElementId);
      if (!reportElement) {
        throw new Error('Élément de rapport introuvable');
      }

      await exportAuditReportToPDF(reportElement, filters);
      
      toast.success('Rapport exporté', 'Le rapport PDF a été téléchargé avec succès.');
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
        <CardTitle>Export du rapport</CardTitle>
        <CardDescription>
          Téléchargez un rapport PDF contenant les graphiques et statistiques
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleExportPDF}
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
              <FileDown className="mr-2 h-4 w-4" />
              Exporter en PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
