import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Lock } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
  instrumentName: string;
  purpose: string;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  onConsent,
  instrumentName,
  purpose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Questionnaire de bien-être
          </DialogTitle>
          <DialogDescription>
            {instrumentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">À quoi ça sert ?</h4>
            <p className="text-sm text-blue-800">
              {purpose}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">Entièrement anonyme</h5>
                <p className="text-xs text-muted-foreground">
                  Aucun score ni résultat ne vous sera affiché
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">Données sécurisées</h5>
                <p className="text-xs text-muted-foreground">
                  Utilisées uniquement pour personnaliser votre expérience
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-pink-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">Complètement facultatif</h5>
                <p className="text-xs text-muted-foreground">
                  Vous pouvez refuser ou arrêter à tout moment
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button 
              onClick={onConsent}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              J'accepte de participer
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Non merci, continuer sans
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Ce questionnaire respecte les standards cliniques internationaux. 
            Vos réponses nous aident à mieux adapter l'application à vos besoins.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};