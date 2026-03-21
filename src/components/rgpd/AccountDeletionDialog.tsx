import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, AlertTriangle, Calendar, Undo, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rgpdService } from '@/services/rgpdService';
import { analyticsService } from '@/services/analyticsService';

export const AccountDeletionDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'confirm' | 'scheduled' | 'error'>('confirm');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [password, setPassword] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const handleDeletion = async () => {
    if (confirmationCode !== 'DELETE_ALL_MY_DATA') {
      setError('Code de confirmation incorrect');
      return;
    }

    if (!password) {
      setError('Veuillez saisir votre mot de passe');
      return;
    }

    analyticsService.trackAccountDeletion('requested');

    try {
      const result = await rgpdService.requestAccountDeletion({
        confirmationCode,
        password,
        softDelete: true
      });

      if (result.success) {
        setScheduledDate(result.scheduledFor || '30 jours');
        setStep('scheduled');
        analyticsService.trackAccountDeletion('scheduled');
        toast({
          title: "Suppression programmée",
          description: "Votre compte sera supprimé dans 30 jours",
        });
      } else {
        throw new Error(result.error || 'Erreur de suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setStep('error');
      analyticsService.trackAccountDeletion('failed');
    }
  };

  const handleUndelete = async () => {
    try {
      const result = await rgpdService.cancelAccountDeletion();
      
      if (result.success) {
        setStep('confirm');
        setConfirmationCode('');
        setIsOpen(false);
        analyticsService.trackAccountDeletion('cancelled');
        toast({
          title: "Suppression annulée",
          description: "Votre compte reste actif",
        });
      } else {
        throw new Error(result.error || 'Impossible d\'annuler');
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Supprimer mon compte
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Suppression du compte
          </DialogTitle>
          <DialogDescription>
            Cette action supprimera définitivement toutes vos données.
          </DialogDescription>
        </DialogHeader>

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Attention !</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Suppression de votre profil</li>
                <li>• Perte de tout l'historique</li>
                <li>• Suppression des préférences</li>
                <li>• Action non réversible après 30 jours</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">🛡️ Délai de grâce</h4>
              <p className="text-sm text-blue-700">
                Vous disposez de 30 jours pour annuler cette suppression.
                Pendant ce délai, votre compte sera suspendu mais récupérable.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tapez "DELETE_ALL_MY_DATA" pour confirmer :
              </label>
              <Input
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="DELETE_ALL_MY_DATA"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Confirmez votre mot de passe :
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe actuel"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletion}
                disabled={confirmationCode !== 'DELETE_ALL_MY_DATA' || !password}
                className="flex-1"
              >
                Programmer la suppression
              </Button>
            </div>
          </div>
        )}

        {step === 'scheduled' && (
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-medium text-orange-800 mb-2">
                Suppression programmée
              </h4>
              <p className="text-sm text-orange-700">
                Votre compte sera supprimé dans {scheduledDate}.
                Vous pouvez encore annuler cette action.
              </p>
            </div>

            <Badge className="w-full justify-center p-2 bg-orange-500">
              Compte suspendu - Suppression dans 30 jours
            </Badge>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Fermer
              </Button>
              <Button
                onClick={handleUndelete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Undo className="w-4 h-4 mr-2" />
                Annuler la suppression
              </Button>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Erreur</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('confirm');
                  setError('');
                }}
                className="flex-1"
              >
                Réessayer
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};