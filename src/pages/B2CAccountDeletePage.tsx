import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Shield, Trash2, Download, MessageSquare } from 'lucide-react';
import { LoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { toast } from 'sonner';

const B2CAccountDeletePage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [agreements, setAgreements] = useState({
    dataLoss: false,
    noRecovery: false,
    immediate: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingStates.Loading text="Chargement..." />;
  if (loadingState === 'error') return <LoadingStates.Error message="Erreur de chargement" />;

  const deletionReasons = [
    { value: 'not-useful', label: 'L\'application ne m\'est plus utile' },
    { value: 'privacy', label: 'Préoccupations concernant la confidentialité' },
    { value: 'too-complex', label: 'L\'application est trop complexe' },
    { value: 'technical-issues', label: 'Problèmes techniques récurrents' },
    { value: 'found-alternative', label: 'J\'ai trouvé une alternative' },
    { value: 'cost', label: 'Questions de coût' },
    { value: 'other', label: 'Autre raison' }
  ];

  const canProceedStep1 = reason !== '';
  const canProceedStep2 = Object.values(agreements).every(Boolean);
  const canProceedStep3 = confirmationText === 'SUPPRIMER MON COMPTE';

  const handleDataExport = () => {
    toast.info('Export des données en cours...');
    // Simulation d'export
    setTimeout(() => {
      toast.success('Vos données ont été exportées avec succès');
    }, 2000);
  };

  const handleAccountDeletion = async () => {
    setIsProcessing(true);
    // Simulation de suppression
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success('Votre compte a été supprimé. Vous allez être redirigé...');
    // Redirection vers la page d'accueil
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-red-600">Suppression de Compte</h1>
          <p className="text-muted-foreground">Cette action est irréversible</p>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= i ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {i}
            </div>
            {i < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > i ? 'bg-red-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Étape 1: Raison de la suppression */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Pourquoi souhaitez-vous supprimer votre compte ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={reason} onValueChange={setReason}>
              {deletionReasons.map((reasonOption) => (
                <div key={reasonOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reasonOption.value} id={reasonOption.value} />
                  <Label htmlFor={reasonOption.value} className="cursor-pointer">
                    {reasonOption.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {reason === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="feedback">Précisez votre raison</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Expliquez-nous pourquoi vous souhaitez supprimer votre compte..."
                />
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">Avant de continuer...</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Avez-vous essayé de contacter notre support ?</li>
                <li>• Vos données seront définitivement supprimées</li>
                <li>• Vous pouvez exporter vos données avant la suppression</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => window.history.back()}>
                Annuler
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="bg-red-500 hover:bg-red-600"
              >
                Continuer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Export des données et confirmations */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-6 w-6" />
                Sauvegarde de vos données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Avant de supprimer votre compte, vous pouvez télécharger une copie de toutes vos données.
              </p>
              <Button onClick={handleDataExport} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter mes données (recommandé)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Confirmations requises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataLoss"
                    checked={agreements.dataLoss}
                    onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, dataLoss: checked as boolean }))}
                  />
                  <Label htmlFor="dataLoss" className="text-sm leading-5 cursor-pointer">
                    Je comprends que toutes mes données (profil, historique, préférences) seront définitivement supprimées
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="noRecovery"
                    checked={agreements.noRecovery}
                    onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, noRecovery: checked as boolean }))}
                  />
                  <Label htmlFor="noRecovery" className="text-sm leading-5 cursor-pointer">
                    Je comprends que cette action est irréversible et que je ne pourrai pas récupérer mon compte
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="immediate"
                    checked={agreements.immediate}
                    onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, immediate: checked as boolean }))}
                  />
                  <Label htmlFor="immediate" className="text-sm leading-5 cursor-pointer">
                    Je souhaite procéder à la suppression immédiate de mon compte
                  </Label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Étape 3: Confirmation finale */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-6 w-6" />
              Confirmation finale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Dernière chance</h4>
              <p className="text-sm text-red-700">
                Vous êtes sur le point de supprimer définitivement votre compte EmotionsCare. 
                Cette action ne peut pas être annulée.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Pour confirmer, tapez <strong>SUPPRIMER MON COMPTE</strong> dans le champ ci-dessous :
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="SUPPRIMER MON COMPTE"
                className="font-mono"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button 
                onClick={handleAccountDeletion}
                disabled={!canProceedStep3 || isProcessing}
                className="bg-red-500 hover:bg-red-600"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Suppression en cours...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer définitivement mon compte
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default B2CAccountDeletePage;