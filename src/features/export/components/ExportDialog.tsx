/**
 * ExportDialog - Interface d'export multi-format
 * Permet l'export en PNG, PDF, CSV, JSON
 */

import React, { memo, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileImage, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

type ExportFormat = 'png' | 'pdf' | 'csv' | 'json';

interface ExportOptions {
  format: ExportFormat;
  filename: string;
  includeMetadata: boolean;
  dateRange?: { start: string; end: string };
  quality?: 'low' | 'medium' | 'high';
}

interface ExportDialogProps {
  title?: string;
  description?: string;
  data?: unknown;
  elementRef?: React.RefObject<HTMLElement>;
  onExport?: (options: ExportOptions) => Promise<void>;
  availableFormats?: ExportFormat[];
  defaultFilename?: string;
  trigger?: React.ReactNode;
}

const FORMAT_CONFIG: Record<ExportFormat, { 
  label: string; 
  IconComponent: React.ComponentType<{ className?: string }>; 
  description: string;
  extension: string;
}> = {
  png: {
    label: 'Image PNG',
    IconComponent: FileImage,
    description: 'Capture visuelle haute qualité',
    extension: '.png'
  },
  pdf: {
    label: 'Document PDF',
    IconComponent: FileText,
    description: 'Rapport formaté imprimable',
    extension: '.pdf'
  },
  csv: {
    label: 'Tableur CSV',
    IconComponent: FileSpreadsheet,
    description: 'Données tabulaires pour Excel',
    extension: '.csv'
  },
  json: {
    label: 'Données JSON',
    IconComponent: FileJson,
    description: 'Format technique structuré',
    extension: '.json'
  }
};

export const ExportDialog = memo<ExportDialogProps>(({
  title = 'Exporter les données',
  description = 'Choisissez le format et les options d\'export',
  data,
  onExport,
  availableFormats = ['png', 'pdf', 'csv', 'json'],
  defaultFilename = 'export',
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>(availableFormats[0]);
  const [filename, setFilename] = useState(defaultFilename);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExport = useCallback(async () => {
    setExporting(true);
    setStatus('exporting');
    setProgress(0);
    setErrorMessage('');

    try {
      // Simuler progression
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 100);

      const options: ExportOptions = {
        format,
        filename: `${filename}${FORMAT_CONFIG[format].extension}`,
        includeMetadata,
        quality
      };

      if (onExport) {
        await onExport(options);
      } else {
        // Export par défaut
        await defaultExport(format, data, filename, includeMetadata);
      }

      clearInterval(progressInterval);
      setProgress(100);
      setStatus('success');
      
      // Fermer après succès
      setTimeout(() => {
        setOpen(false);
        setStatus('idle');
        setProgress(0);
      }, 1500);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  }, [format, filename, includeMetadata, quality, onExport, data]);

  const defaultExport = async (
    fmt: ExportFormat, 
    exportData: unknown, 
    name: string,
    withMeta: boolean
  ) => {
    const timestamp = new Date().toISOString();
    const dataToExport = withMeta 
      ? { data: exportData, exportedAt: timestamp, format: fmt }
      : exportData;

    let blob: Blob;

    switch (fmt) {
      case 'json':
        blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        break;
      case 'csv':
        const csvContent = convertToCSV(exportData);
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        break;
      default:
        blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
    }

    // Télécharger
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}${FORMAT_CONFIG[fmt].extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (obj: unknown): string => {
    if (!obj || typeof obj !== 'object') return '';
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '';
      const headers = Object.keys(obj[0] as object);
      const rows = obj.map(item => 
        headers.map(h => JSON.stringify((item as Record<string, unknown>)[h] ?? '')).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    }
    
    const entries = Object.entries(obj as object);
    return entries.map(([key, value]) => `${key},${JSON.stringify(value)}`).join('\n');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sélection du format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format d'export</Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as ExportFormat)}
              className="grid grid-cols-2 gap-3"
            >
              {availableFormats.map((fmt) => {
                const config = FORMAT_CONFIG[fmt];
                const IconComp = config.IconComponent;
                
                return (
                  <div key={fmt}>
                    <RadioGroupItem
                      value={fmt}
                      id={`format-${fmt}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`format-${fmt}`}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                        transition-all hover:border-primary/50
                        peer-checked:border-primary peer-checked:bg-primary/5
                      `}
                    >
                      <IconComp className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Nom du fichier */}
          <div className="space-y-2">
            <Label htmlFor="filename">Nom du fichier</Label>
            <div className="flex items-center gap-2">
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="export"
              />
              <Badge variant="outline" className="whitespace-nowrap">
                {FORMAT_CONFIG[format].extension}
              </Badge>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
              />
              <Label htmlFor="metadata" className="text-sm cursor-pointer">
                Inclure les métadonnées (date, source)
              </Label>
            </div>

            {(format === 'png' || format === 'pdf') && (
              <div className="space-y-2">
                <Label className="text-sm">Qualité</Label>
                <RadioGroup
                  value={quality}
                  onValueChange={(v) => setQuality(v as typeof quality)}
                  className="flex gap-4"
                >
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <div key={q} className="flex items-center space-x-2">
                      <RadioGroupItem value={q} id={`quality-${q}`} />
                      <Label htmlFor={`quality-${q}`} className="text-sm capitalize">
                        {q === 'low' ? 'Basse' : q === 'medium' ? 'Moyenne' : 'Haute'}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Progression */}
          {status !== 'idle' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {status === 'exporting' && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                <span className="text-sm">
                  {status === 'exporting' && 'Export en cours...'}
                  {status === 'success' && 'Export réussi !'}
                  {status === 'error' && errorMessage}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={exporting}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={exporting || !filename}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ExportDialog.displayName = 'ExportDialog';

export default ExportDialog;
