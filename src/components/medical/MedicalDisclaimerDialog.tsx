import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicalDisclaimerDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  feature?: 'scan' | 'assessment' | 'coach' | 'journal';
}

const STORAGE_KEY = 'emotionscare_medical_disclaimer_accepted';

/**
 * Dialog Disclaimer Médical - Conforme Art. L4113-9 CSP
 * CRITIQUE: Afficher AVANT toute collecte de données de santé
 */
export const MedicalDisclaimerDialog: React.FC<MedicalDisclaimerDialogProps> = ({
  open,
  onAccept,
  onDecline,
  feature = 'scan',
}) => {
  const [hasReadAll, setHasReadAll] = useState(false);
  const [hasUnderstood, setHasUnderstood] = useState(false);

  // Reset checkboxes quand dialog s'ouvre
  useEffect(() => {
    if (open) {
      setHasReadAll(false);
      setHasUnderstood(false);
    }
  }, [open]);

  const featureLabels = {
    scan: 'le scan émotionnel',
    assessment: 'les évaluations cliniques',
    coach: 'le coaching IA',
    journal: 'le journal émotionnel',
  };

  const handleAccept = () => {
    if (!hasReadAll || !hasUnderstood) return;
    
    // Sauvegarder consentement avec date
    const consent = {
      accepted: true,
      feature,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem(`${STORAGE_KEY}_${feature}`, JSON.stringify(consent));
    
    onAccept();
  };

  const canAccept = hasReadAll && hasUnderstood;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl">
              Avertissement médical important
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-left space-y-4 pt-4">
            <p className="font-semibold text-foreground">
              Avant d'utiliser {featureLabels[feature]}, veuillez lire attentivement :
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Bloc 1 - Ce que ce n'est PAS */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              EmotionsCare N'EST PAS :
            </h3>
            <ul className="space-y-2 ml-6 list-disc">
              <li><strong>Un dispositif médical</strong> homologué ou certifié</li>
              <li><strong>Un diagnostic médical</strong> ou psychologique</li>
              <li><strong>Un traitement thérapeutique</strong> validé scientifiquement</li>
              <li><strong>Un remplacement</strong> d'une consultation avec un professionnel de santé</li>
              <li><strong>Un service d'urgence</strong> psychiatrique ou médicale</li>
            </ul>
          </div>

          {/* Bloc 2 - Ce que c'est */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">
              EmotionsCare EST :
            </h3>
            <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
              <li>Un <strong>outil de bien-être</strong> et de suivi émotionnel personnel</li>
              <li>Un <strong>complément</strong> (jamais un substitut) à un suivi médical</li>
              <li>Une aide à l'<strong>auto-observation</strong> de vos émotions</li>
              <li>Un espace de <strong>réflexion</strong> et de développement personnel</li>
            </ul>
          </div>

          {/* Bloc 3 - Situations d'urgence */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-amber-700 dark:text-amber-500 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              En cas d'urgence médicale ou psychologique :
            </h3>
            <div className="space-y-2 text-foreground">
              <p className="font-semibold">
                ⚠️ N'utilisez PAS EmotionsCare. Contactez IMMÉDIATEMENT :
              </p>
              <ul className="space-y-1 ml-6">
                <li><strong>15</strong> - SAMU (urgences médicales)</li>
                <li><strong>112</strong> - Numéro d'urgence européen</li>
                <li><strong>3114</strong> - Numéro national de prévention du suicide (24h/24, 7j/7)</li>
                <li><strong>119</strong> - Enfance en danger</li>
              </ul>
            </div>
          </div>

          {/* Bloc 4 - Quand consulter */}
          <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Consultez un professionnel de santé si :</h3>
            <ul className="space-y-1 ml-6 list-disc text-sm text-muted-foreground">
              <li>Vous ressentez une détresse persistante (plus de 2 semaines)</li>
              <li>Vos symptômes impactent votre vie quotidienne (travail, relations, sommeil)</li>
              <li>Vous avez des pensées suicidaires ou d'automutilation</li>
              <li>Vous consommez des substances pour gérer vos émotions</li>
              <li>Vous avez subi un traumatisme récent</li>
            </ul>
          </div>

          {/* Bloc 5 - Protection des données */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              <strong>Confidentialité :</strong> Vos données sont protégées conformément au RGPD. 
              Consultez notre <a href="/legal/privacy" className="text-primary hover:underline" target="_blank">Politique de Confidentialité</a>.
            </p>
            <p className="mt-2">
              <strong>Responsabilité :</strong> EmotionsCare décline toute responsabilité en cas d'utilisation 
              inappropriée ou de mauvaise interprétation des résultats. Seul un professionnel de santé 
              qualifié peut poser un diagnostic.
            </p>
          </div>
        </div>

        {/* Checkboxes de consentement */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="disclaimer-read"
              checked={hasReadAll}
              onCheckedChange={(checked) => setHasReadAll(checked === true)}
              className="mt-1"
            />
            <Label
              htmlFor="disclaimer-read"
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              J'ai lu et compris l'intégralité de cet avertissement médical
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="disclaimer-understand"
              checked={hasUnderstood}
              onCheckedChange={(checked) => setHasUnderstood(checked === true)}
              className="mt-1"
              disabled={!hasReadAll}
            />
            <Label
              htmlFor="disclaimer-understand"
              className={cn(
                'text-sm font-normal leading-relaxed',
                hasReadAll ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              )}
            >
              Je comprends qu'EmotionsCare <strong>ne remplace pas</strong> un avis médical ou 
              psychologique et que je dois consulter un professionnel en cas de détresse
            </Label>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDecline}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!canAccept}
            className="w-full sm:w-auto"
          >
            J'ai compris, continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Hook pour gérer l'affichage du disclaimer
 */
export const useMedicalDisclaimer = (feature: 'scan' | 'assessment' | 'coach' | 'journal') => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté pour cette fonctionnalité
    const stored = localStorage.getItem(`${STORAGE_KEY}_${feature}`);
    if (stored) {
      try {
        const consent = JSON.parse(stored);
        // Vérifier que le consentement date de moins de 6 mois
        const consentDate = new Date(consent.timestamp);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        if (consentDate > sixMonthsAgo && consent.accepted) {
          setIsAccepted(true);
          return;
        }
      } catch (e) {
        // Consentement invalide, redemander
      }
    }
    
    // Pas de consentement valide, afficher le disclaimer
    setShowDisclaimer(true);
  }, [feature]);

  const handleAccept = () => {
    setShowDisclaimer(false);
    setIsAccepted(true);
  };

  const handleDecline = () => {
    setShowDisclaimer(false);
    setIsAccepted(false);
  };

  return {
    showDisclaimer,
    isAccepted,
    setShowDisclaimer,
    handleAccept,
    handleDecline,
  };
};

export default MedicalDisclaimerDialog;
