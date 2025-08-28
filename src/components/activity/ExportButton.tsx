import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Package, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useExportJob } from '@/hooks/useExportJob';
import { toast } from 'sonner';

export const ExportButton: React.FC = () => {
  const { 
    lastExport, 
    startExport, 
    isExporting, 
    isReady, 
    hasError 
  } = useExportJob();

  const handleExport = async (format: 'csv' | 'zip') => {
    try {
      await startExport();
      // Analytics would be tracked here
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getStatusIcon = () => {
    if (isExporting) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isReady) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Download className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isExporting) return 'Export en cours...';
    if (isReady) return 'Export prêt';
    if (hasError) return 'Erreur export';
    return 'Exporter';
  };

  const handleDownload = () => {
    // In a real implementation, this would download the file
    toast.success('Téléchargement démarré');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status indicator */}
      {lastExport && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
          {isReady && (
            <Button
              variant="link"
              size="sm"
              onClick={handleDownload}
              className="p-0 h-auto text-primary"
            >
              Télécharger
            </Button>
          )}
        </div>
      )}

      {/* Export dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            disabled={isExporting}
            aria-busy={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Exporter l'historique
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
            <span className="ml-auto text-xs text-muted-foreground">
              ~2 MB
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleExport('zip')}
            disabled={isExporting}
          >
            <Package className="w-4 h-4 mr-2" />
            Archive complète
            <span className="ml-auto text-xs text-muted-foreground">
              ~5 MB
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};