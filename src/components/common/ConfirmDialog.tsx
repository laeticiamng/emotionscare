import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'info';
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

/**
 * Dialog de confirmation accessible avec :
 * - Focus management automatique
 * - Support clavier complet
 * - États de chargement
 * - Variants visuels contextuels
 * - Annonces pour lecteurs d'écran
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'default',
  onConfirm,
  loading = false
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const icons = {
    default: Info,
    destructive: AlertTriangle,
    info: CheckCircle
  };

  const colors = {
    default: 'text-primary',
    destructive: 'text-destructive',
    info: 'text-info'
  };

  const Icon = icons[variant];

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      logger.error('Erreur lors de la confirmation', { error });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isProcessing && !loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onKeyDown={handleKeyDown}
        aria-describedby="confirm-dialog-description"
      >
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors[variant]}`} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription 
          id="confirm-dialog-description"
          className="text-muted-foreground leading-relaxed py-4"
        >
          {description}
        </DialogDescription>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing || loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isProcessing || loading}
            className="w-full sm:w-auto min-w-[100px]"
          >
            {isProcessing || loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                />
                Traitement...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook utilitaire pour simplifier l'usage
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    variant?: 'default' | 'destructive' | 'info';
    confirmLabel?: string;
    onConfirm?: () => void | Promise<void>;
  }>({
    open: false,
    title: '',
    description: ''
  });

  const showConfirm = React.useCallback((config: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive' | 'info';
    confirmLabel?: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    setDialogState({
      open: true,
      ...config
    });
  }, []);

  const hideConfirm = React.useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  const ConfirmDialogComponent = React.useCallback(() => (
    <ConfirmDialog
      open={dialogState.open}
      onOpenChange={hideConfirm}
      title={dialogState.title}
      description={dialogState.description}
      variant={dialogState.variant}
      confirmLabel={dialogState.confirmLabel}
      onConfirm={dialogState.onConfirm || (() => {})}
    />
  ), [dialogState, hideConfirm]);

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent
  };
};

export default ConfirmDialog;