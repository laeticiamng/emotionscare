/**
 * QuickExportButton - Bouton d'export rapide PDF/JSON
 * Pour export des données utilisateur (RGPD Art. 20)
 * @version 1.0.0
 */

import React, { useState, memo } from 'react';
import { Download, FileText, FileJson, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface QuickExportButtonProps {
  dataType: 'journal' | 'emotions' | 'sessions' | 'all';
  userId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const QuickExportButton: React.FC<QuickExportButtonProps> = ({
  dataType,
  userId,
  variant = 'outline',
  size = 'sm'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExported, setLastExported] = useState<'pdf' | 'json' | null>(null);

  const handleExport = async (format: 'pdf' | 'json') => {
    setIsExporting(true);
    
    try {
      logger.info('export.started', { dataType, format }, 'EXPORT');
      
      // Simulate export (in production, call edge function)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock file download
      const filename = `emotionscare_${dataType}_${new Date().toISOString().split('T')[0]}.${format}`;
      
      if (format === 'json') {
        const mockData = {
          exportedAt: new Date().toISOString(),
          dataType,
          version: '1.0',
          data: {
            message: 'Export data would appear here'
          }
        };
        const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // PDF export would use a proper PDF library
        toast.info('Export PDF en cours de développement');
      }
      
      setLastExported(format);
      toast.success(`Export ${format.toUpperCase()} terminé !`);
      
      // Reset success state after 3s
      setTimeout(() => setLastExported(null), 3000);
      
    } catch (error) {
      logger.error('export.failed', { error, dataType, format }, 'EXPORT');
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting} className="gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : lastExported ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('json')} className="gap-2">
          <FileJson className="h-4 w-4" />
          Export JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
          <FileText className="h-4 w-4" />
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(QuickExportButton);
