import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  FileText, 
  Package, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const exportButtonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        card: "flex-col p-4 border rounded-lg hover:bg-accent/50"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "default"
    }
  }
);

export interface ExportFormat {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<any>;
  size?: string;
  disabled?: boolean;
}

interface ExportJob {
  id?: string;
  status: 'idle' | 'exporting' | 'ready' | 'error';
  progress?: number;
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
}

interface UnifiedExportButtonProps extends VariantProps<typeof exportButtonVariants> {
  formats?: ExportFormat[];
  job?: ExportJob;
  onExport?: (format: ExportFormat) => void | Promise<void>;
  onDownload?: (job: ExportJob) => void;
  onCancel?: () => void;
  showStatus?: boolean;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const defaultFormats: ExportFormat[] = [
  {
    id: 'csv',
    label: 'Export CSV',
    description: 'Données tabulaires',
    icon: FileText,
    size: '~2 MB'
  },
  {
    id: 'zip',
    label: 'Archive complète',
    description: 'Tous les fichiers',
    icon: Package,
    size: '~5 MB'
  }
];

const UnifiedExportButton: React.FC<UnifiedExportButtonProps> = ({
  formats = defaultFormats,
  job = { status: 'idle' },
  onExport,
  onDownload,
  onCancel,
  showStatus = true,
  className,
  disabled = false,
  variant,
  size,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isExporting = job.status === 'exporting';
  const isReady = job.status === 'ready';
  const hasError = job.status === 'error';
  const isIdle = job.status === 'idle';

  const handleExport = async (format: ExportFormat) => {
    if (format.disabled || !onExport) return;
    
    try {
      setIsOpen(false);
      await onExport(format);
      toast.success(`Export ${format.label} démarré`);
    } catch (error) {
      toast.error(`Erreur lors de l'export: ${error}`);
    }
  };

  const handleDownload = () => {
    if (!onDownload || !isReady) return;
    onDownload(job);
    toast.success('Téléchargement démarré');
  };

  const getStatusIcon = () => {
    if (isExporting) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isReady) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Download className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isExporting) return job.progress ? `Export en cours (${job.progress}%)` : 'Export en cours...';
    if (isReady) return 'Export prêt';
    if (hasError) return job.error || 'Erreur export';
    return 'Exporter';
  };

  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Status card si export en cours */}
        {showStatus && !isIdle && (
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-medium">{getStatusText()}</p>
              {job.expiresAt && isReady && (
                <p className="text-sm text-muted-foreground">
                  Disponible jusqu'au {new Date(job.expiresAt).toLocaleString()}
                </p>
              )}
            </div>
            {isReady && (
              <Button onClick={handleDownload} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            )}
            {isExporting && onCancel && (
              <Button onClick={onCancel} variant="outline" size="sm">
                Annuler
              </Button>
            )}
          </div>
        )}

        {/* Export options */}
        <div className="grid gap-2">
          {formats.map((format) => (
            <Button
              key={format.id}
              variant="outline"
              disabled={disabled || isExporting || format.disabled}
              onClick={() => handleExport(format)}
              className="justify-start h-auto p-4"
            >
              <format.icon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">{format.label}</div>
                {format.description && (
                  <div className="text-sm text-muted-foreground">{format.description}</div>
                )}
              </div>
              {format.size && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format.size}
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Status indicator */}
      {showStatus && !isIdle && (
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
          {isExporting && onCancel && (
            <Button
              variant="link"
              size="sm"
              onClick={onCancel}
              className="p-0 h-auto text-muted-foreground"
            >
              Annuler
            </Button>
          )}
        </div>
      )}

      {/* Export dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className={cn(exportButtonVariants({ variant, size }), className)}
            disabled={disabled || isExporting}
            aria-busy={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {children || 'Exporter'}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Formats d'export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {formats.map((format) => (
            <DropdownMenuItem 
              key={format.id}
              onClick={() => handleExport(format)}
              disabled={disabled || isExporting || format.disabled}
              className="cursor-pointer"
            >
              <format.icon className="w-4 h-4 mr-2" />
              <div className="flex-1">
                <div>{format.label}</div>
                {format.description && (
                  <div className="text-xs text-muted-foreground">{format.description}</div>
                )}
              </div>
              {format.size && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {format.size}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { UnifiedExportButton, exportButtonVariants };
export type { UnifiedExportButtonProps, ExportFormat, ExportJob };