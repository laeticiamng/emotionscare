
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import LoadingAnimation from "@/components/ui/loading-animation";

interface AnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnalysisDialog: React.FC<AnalysisDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Analyse en cours</DialogTitle>
        <DialogDescription>Veuillez patienter pendant que nous analysons votre état émotionnel</DialogDescription>
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingAnimation 
            text="Notre IA analyse votre état émotionnel..." 
            className="mb-4"
            iconClassName="h-12 w-12"
          />
          <div className="text-center max-w-sm">
            <p className="text-sm text-muted-foreground mt-4">
              Nous utilisons l'intelligence artificielle pour analyser vos émotions et vous offrir un retour personnalisé.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
