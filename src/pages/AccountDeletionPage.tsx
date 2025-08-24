import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AccountDeletionPage: React.FC = () => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER') {
      toast({
        title: "Erreur",
        description: "Veuillez taper 'SUPPRIMER' pour confirmer",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    
    // Simulation de la suppression
    setTimeout(() => {
      setIsDeleting(false);
      setStep(2);
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });
    }, 2000);
  };

  if (step === 2) {
    return (
      <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Compte supprimé</CardTitle>
            <CardDescription>
              Votre compte et toutes vos données ont été définitivement supprimés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Merci d'avoir utilisé EmotionsCare. Nous espérons vous revoir bientôt.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.href = '/'}>
              Retourner à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Suppression de Compte</h1>
          <p className="text-muted-foreground">
            Cette action supprimera définitivement votre compte et toutes vos données.
          </p>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <CardTitle className="text-destructive">Zone de Danger</CardTitle>
                <CardDescription>
                  Cette action est irréversible et supprimera définitivement votre compte.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Que va-t-il se passer ?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Votre profil sera définitivement supprimé</li>
                <li>• Toutes vos données personnelles seront effacées</li>
                <li>• Vos historiques d'activités seront supprimés</li>
                <li>• Vos préférences et paramètres seront perdus</li>
                <li>• Cette action ne peut pas être annulée</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="confirm">
                  Pour confirmer, tapez <strong>SUPPRIMER</strong> dans le champ ci-dessous :
                </Label>
                <Input
                  id="confirm"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'SUPPRIMER' || isDeleting}
            >
              {isDeleting ? (
                <>Suppression en cours...</>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer définitivement mon compte
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default AccountDeletionPage;