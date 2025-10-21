// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useOrgStore } from '@/store/org.store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { logger } from '@/lib/logger';

export const ExportControls: React.FC = () => {
  const filters = useOrgStore(state => state.filters);

  const handleExportCSV = async () => {
    try {
      const { range, groupBy, site, bu, minN } = filters;
      
      const { data, error } = await supabase.functions.invoke('org-dashboard-export', {
        body: {
          range,
          group_by: groupBy,
          site,
          bu,
          min_n: minN,
          format: 'csv'
        }
      });

      if (error) throw error;

      // Create and download CSV
      const blob = new Blob([data.csv_content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `heatmap-vibes-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Export CSV téléchargé');
    } catch (error) {
      logger.error('Export error', error as Error, 'SYSTEM');
      toast.error('Erreur lors de l\'export');
    }
  };

  const handlePrint = () => {
    // Add print-specific styles
    const printStyles = `
      @media print {
        .no-print { display: none !important; }
        @page { 
          size: A4 landscape; 
          margin: 1cm; 
        }
        body { 
          print-color-adjust: exact; 
          -webkit-print-color-adjust: exact; 
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    window.print();
    
    // Clean up
    setTimeout(() => {
      document.head.removeChild(styleSheet);
    }, 1000);
  };

  return (
    <div className="flex items-center gap-2 no-print">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExportCSV}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};