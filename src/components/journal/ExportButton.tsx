import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

export const ExportButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Request export job
      const { data: job, error } = await supabase.functions.invoke('journal-export', {
        body: { format: 'csv' }
      });

      if (error) throw error;

      // Poll for completion
      const pollForCompletion = async (jobId: string): Promise<string> => {
        const { data: status, error } = await supabase.functions.invoke('journal-export-status', {
          body: { job_id: jobId }
        });

        if (error) throw error;

        if (status.status === 'completed') {
          return status.download_url;
        } else if (status.status === 'failed') {
          throw new Error('Export failed');
        }

        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        return pollForCompletion(jobId);
      };

      const downloadUrl = await pollForCompletion(job.job_id);

      // Download the file
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `journal-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success('Export téléchargé avec succès');

    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Préparation...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Exporter mes notes
        </>
      )}
    </Button>
  );
};