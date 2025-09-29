import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import type { Instrument } from '../../../../packages/contracts/assess';

interface AssessCardProps {
  instrument: Instrument;
  title: string;
  description: string;
  estimatedTime?: number; // en minutes
  context?: string;
  onStart: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  lastBadge?: string; // Badge verbal du dernier submit
  className?: string;
}

const instrumentLabels: Record<Instrument, string> = {
  WHO5: "Bien-être",
  STAI6: "Détente",
  PANAS10: "Émotions",
  PSS10: "Stress",
  UCLA3: "Social",
  MSPSS: "Soutien",
  AAQ2: "Flexibilité",
  POMS_SF: "Humeur",
  SSQ: "Confort",
  ISI: "Sommeil",
  GAS: "Objectifs",
  GRITS: "Persévérance",
  BRS: "Résilience",
  WEMWBS: "Bien-être mental",
  SWEMWBS: "Bien-être court",
  UWES9: "Engagement",
  CBI: "Épuisement",
  CVSQ: "Vision",
  SAM: "Ressenti",
  SUDS: "Tension"
};

export function AssessCard({
  instrument,
  title,
  description,
  estimatedTime = 2,
  context,
  onStart,
  isLoading = false,
  disabled = false,
  lastBadge,
  className = ""
}: AssessCardProps) {
  const [hasOptedIn, setHasOptedIn] = useState(false);
  
  const instrumentLabel = instrumentLabels[instrument] || instrument;

  // Ne pas afficher si désactivé (feature flag off)
  if (disabled) {
    return null;
  }

  const handleOptIn = () => {
    setHasOptedIn(true);
  };

  const handleStart = () => {
    if (!hasOptedIn) {
      handleOptIn();
      return;
    }
    onStart();
  };

  return (
    <Card className={`assess-card relative overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}>
      {lastBadge && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {lastBadge}
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {instrumentLabel}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime} min</span>
          </div>
          {context && (
            <Badge variant="secondary" className="text-xs">
              {context}
            </Badge>
          )}
        </div>

        {!hasOptedIn ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Évaluation facultative
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Quelques questions courtes pour personnaliser votre expérience. 
                  Aucun score n'est affiché, seulement des retours bienveillants.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleOptIn}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Je choisis de participer
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleStart}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Préparation...
              </>
            ) : (
              'Commencer'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}