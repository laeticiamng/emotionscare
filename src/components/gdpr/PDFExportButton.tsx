// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, AlertTriangle, Users, FileBarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface PDFExportButtonProps {
  auditId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  auditId,
  variant = 'default',
  size = 'default',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [includeGraphs, setIncludeGraphs] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeCategoryDetails, setIncludeCategoryDetails] = useState(true);

  const exportReport = async (reportType: 'audit' | 'violations' | 'dsar' | 'full') => {
    setIsExporting(true);

    try {
      // Récupérer les données via l'edge function
      const { data, error } = await supabase.functions.invoke('generate-audit-pdf', {
        body: {
          auditId,
          reportType,
          includeGraphs,
          includeRecommendations,
          includeCategoryDetails,
          reportTitle: getTitleForType(reportType),
        },
      });

      if (error) throw error;

      // Créer un HTML pour l'impression
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup bloquée - veuillez autoriser les popups pour ce site');
      }

      printWindow.document.write(data.htmlContent);
      printWindow.document.close();

      // Attendre que le contenu soit chargé puis lancer l'impression
      printWindow.onload = () => {
        printWindow.print();
      };

      toast({
        title: 'Rapport généré',
        description: 'La fenêtre d\'impression va s\'ouvrir. Sélectionnez "Enregistrer au format PDF" comme destination.',
      });

      logger.info('PDF report exported', { reportType, auditId }, 'GDPR');
    } catch (error) {
      logger.error('Error exporting PDF', { error }, 'GDPR');
      toast({
        title: 'Erreur d\'export',
        description: error.message || 'Impossible de générer le rapport',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getTitleForType = (type: string): string => {
    switch (type) {
      case 'audit':
        return 'Rapport d\'Audit de Conformité RGPD';
      case 'violations':
        return 'Rapport des Violations RGPD';
      case 'dsar':
        return 'Rapport des Demandes DSAR';
      case 'full':
        return 'Rapport RGPD Complet';
      default:
        return 'Rapport RGPD';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Export en cours...' : 'Exporter PDF'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Type de rapport</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {auditId && (
          <DropdownMenuItem onClick={() => exportReport('audit')}>
            <FileText className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>Audit de Conformité</span>
              <span className="text-xs text-muted-foreground">
                Score, catégories et recommandations
              </span>
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => exportReport('violations')}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Violations RGPD</span>
            <span className="text-xs text-muted-foreground">
              Liste et statistiques des violations
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportReport('dsar')}>
          <Users className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Demandes DSAR</span>
            <span className="text-xs text-muted-foreground">
              Requêtes d'accès et de suppression
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportReport('full')}>
          <FileBarChart className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Rapport Complet</span>
            <span className="text-xs text-muted-foreground">
              Vue d'ensemble complète RGPD
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Options d'export</DropdownMenuLabel>
        
        <DropdownMenuCheckboxItem
          checked={includeGraphs}
          onCheckedChange={setIncludeGraphs}
        >
          Inclure les graphiques
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={includeRecommendations}
          onCheckedChange={setIncludeRecommendations}
        >
          Inclure les recommandations
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={includeCategoryDetails}
          onCheckedChange={setIncludeCategoryDetails}
        >
          Détails par catégorie
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PDFExportButton;
