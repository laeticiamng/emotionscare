import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONFIRM_TEXT = 'SUPPRIMER';
const RETENTION_DAYS = 30;

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { softDelete, loading, error } = useAccountDeletion();
  const [step, setStep] = useState<1 | 2>(1);
  const [understood, setUnderstood] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUnderstood(false);
      setConfirmText('');
      setReason('');
    }
  }, [isOpen]);

  const canProceedStep1 = understood;
  const canConfirm = confirmText.trim().toUpperCase() === CONFIRM_TEXT;

  const handleNext = () => {
    if (canProceedStep1) {
      setStep(2);
    }
  };

  const handleConfirm = async () => {
    if (!canConfirm) return;
    
    const success = await softDelete(reason.trim() || undefined);
    if (success) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && step === 1) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        onKeyDown={handleKeyDown}
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle 
            ref={titleRef}
            tabIndex={-1}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Supprimer mon compte
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <p>
                Cette action va supprimer définitivement ton compte et toutes tes données 
                après un délai de {RETENTION_DAYS} jours.
              </p>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  💡 Nous te recommandons d'exporter tes données avant la suppression.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-amber-700 dark:text-amber-300"
                  onClick={() => {/* Navigate to export */}}
                >
                  Exporter mes données
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Understanding */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Que va-t-il se passer ?</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ton compte sera désactivé immédiatement</li>
                <li>Tes données seront supprimées après {RETENTION_DAYS} jours</li>
                <li>Tu peux annuler la suppression pendant ces {RETENTION_DAYS} jours</li>
                <li>Après ce délai, la suppression sera définitive</li>
              </ul>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="understand"
                checked={understood}
                onCheckedChange={(checked) => setUnderstood(!!checked)}
              />
              <Label 
                htmlFor="understand" 
                className="text-sm leading-5 cursor-pointer"
              >
                Je comprends que mes données seront supprimées définitivement 
                après {RETENTION_DAYS} jours.
              </Label>
            </div>
          </div>
        )}

        {/* Step 2: Final confirmation */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="reason">Pourquoi supprimes-tu ton compte ? (optionnel)</Label>
              <Input
                id="reason"
                placeholder="Aide-nous à améliorer le service..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Pour confirmer, écris « <strong>{CONFIRM_TEXT}</strong> » ci-dessous :
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_TEXT}
                autoComplete="off"
                aria-describedby="confirm-help"
              />
              <p id="confirm-help" className="text-xs text-muted-foreground">
                Cette étape évite les suppressions accidentelles.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceedStep1}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Suivant
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Précédent
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={!canConfirm || loading}
                aria-busy={loading}
              >
                {loading ? 'Suppression...' : 'Confirmer la suppression'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};