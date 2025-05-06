
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SecureConfirmationDialogProps {
  title: string;
  description: string;
  actionLabel: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmationWord?: string;
  isDestructive?: boolean;
}

export const SecureConfirmationDialog = ({
  title,
  description,
  actionLabel,
  isOpen,
  onConfirm,
  onCancel,
  confirmationWord = 'CONFIRMER',
  isDestructive = true
}: SecureConfirmationDialogProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // Reset input when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setIsValid(false);
    }
  }, [isOpen]);
  
  // Validate input against confirmation word
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(value === confirmationWord);
  };
  
  // Handle confirmation
  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className={isDestructive ? "text-destructive" : "text-warning"} size={20} />
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-2 text-sm font-medium">
            Pour confirmer cette action, veuillez taper <span className="font-bold">{confirmationWord}</span>
          </div>
          <Input 
            type="text"
            placeholder={`Tapez ${confirmationWord} pour valider`}
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
            className="w-full"
          />
          {inputValue && !isValid && (
            <p className="mt-1 text-sm text-destructive">
              Vous devez taper exactement {confirmationWord} pour continuer.
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            variant={isDestructive ? "destructive" : "default"}
            disabled={!isValid}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
