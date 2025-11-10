// @ts-nocheck
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'json' | 'csv';
  audit_id?: string;
  template?: 'standard' | 'executive' | 'technical' | 'minimal';
  include_history?: boolean;
  date_range?: { start: string; end: string };
}

export const useMultiFormatExport = () => {
  const exportMutation = useMutation({
    mutationFn: async (options: ExportOptions) => {
      const startTime = Date.now();
      console.log('Exporting with options:', options);

      if (options.format === 'pdf') {
        // Use existing PDF generation
        const { data, error } = await supabase.functions.invoke('generate-audit-pdf', {
          body: {
            audit_id: options.audit_id,
            include_history: options.include_history,
            template: options.template,
          },
        });

        if (error) throw error;

        // Download PDF
        const link = document.createElement('a');
        link.href = data.pdf_url;
        link.download = `rgpd-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return data;
      } else {
        // Use GDPR report export function for CSV/JSON
        const { data, error } = await supabase.functions.invoke('gdpr-report-export', {
          body: {
            format: options.format,
            startDate: options.date_range?.start,
            endDate: options.date_range?.end,
            includeAlerts: true,
            includeConsents: true,
            includeExports: true,
            includeAuditLogs: options.include_history,
          },
        });

        if (error) throw error;

        // Create blob and download
        const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data)], {
          type: options.format === 'json' ? 'application/json' : 'text/csv',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rgpd-report-${new Date().toISOString().split('T')[0]}.${options.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true, size: blob.size };
      }
    },
    onSuccess: async (data, variables) => {
      const duration = Date.now();
      
      // Log export for analytics
      await supabase.from('export_logs').insert({
        format: variables.format,
        template: variables.template,
        file_size: data.size || 0,
        duration_ms: duration,
      });

      toast.success(`Export ${variables.format.toUpperCase()} généré avec succès`);
    },
    onError: (error: Error) => {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export: ${error.message}`);
    },
  });

  return {
    exportData: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
  };
};
