/**
 * MedicalDisclaimer - Important medical warning component
 */

import React from 'react';
import { AlertTriangle, Phone, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact';
  showEmergency?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = 'card',
  showEmergency = true,
}) => {
  if (variant === 'compact') {
    return (
      <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
        <p className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          <strong>Avertissement :</strong> Ces questionnaires ne remplacent pas un diagnostic médical.
        </p>
        {showEmergency && (
          <p className="mt-1 flex items-center gap-1">
            <Phone className="h-3 w-3 text-red-500" />
            En cas de détresse : <strong className="text-red-600">3114</strong> (24h/24)
          </p>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <Alert variant="destructive" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">
          Avertissement médical important
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          Ces questionnaires sont des outils de dépistage validés scientifiquement. 
          Ils ne remplacent pas un diagnostic médical professionnel.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-amber-300 bg-amber-50/50 dark:bg-amber-950/10">
      <CardContent className="p-4 space-y-4">
        {/* Main disclaimer */}
        <div className="flex gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Avertissement médical important
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Ces questionnaires sont des <strong>outils de dépistage validés scientifiquement</strong>. 
              Ils ne remplacent en aucun cas un diagnostic médical établi par un professionnel de santé qualifié.
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Si votre score indique une détresse significative, nous vous encourageons vivement à 
              <strong> consulter un médecin, un psychologue ou un psychiatre</strong>.
            </p>
          </div>
        </div>

        {/* Emergency contact */}
        {showEmergency && (
          <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-red-800 dark:text-red-200 text-lg">
                3114
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Numéro national de prévention du suicide
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Disponible 24h/24, 7j/7 - Appel gratuit et confidentiel
              </p>
            </div>
            <Heart className="h-5 w-5 text-red-500 flex-shrink-0 ml-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalDisclaimer;
