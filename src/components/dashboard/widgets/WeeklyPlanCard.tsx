import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFlags } from '@/core/flags';
import { clinicalScoringService, type InstrumentCatalog } from '@/services/clinicalScoringService';
import { useDashboardStore, type DashboardWellbeingSignal } from '@/store/dashboard.store';
import {
  PLAN_DESCRIPTIONS,
  buildWellbeingSummary,
  getHeadlineForTone,
} from '@/features/dashboard/orchestration/weeklyPlanMapper';

const STORAGE_KEY = 'dashboard:weekly-plan:v2';
const WEEKLY_INTERVAL = 7 * 24 * 60 * 60 * 1000;
const SNOOZE_INTERVAL = 24 * 60 * 60 * 1000;

const SCALE_OPTIONS: { value: string; label: string; helper: string }[] = [
  { value: '0', label: 'Jamais', helper: 'Aucun moment ne correspondait' },
  { value: '1', label: 'Parfois', helper: 'Quelques instants isolés' },
  { value: '2', label: 'À l’occasion', helper: 'Moins de la moitié du temps' },
  { value: '3', label: 'Souvent', helper: 'Plus de la moitié du temps' },
  { value: '4', label: 'Presque toujours', helper: 'Presque toute la semaine' },
  { value: '5', label: 'Constamment', helper: 'En continu cette semaine' },
];

const defaultStorage: WeeklyPlanStorage = {};

type WeeklyPlanStorage = {
  lastSummary?: DashboardWellbeingSignal;
  lastPromptAt?: string;
  snoozedUntil?: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
  }).format(new Date(value));

export const WeeklyPlanCard: React.FC = () => {
  const { toast } = useToast();
  const assessment = useAssessment('WHO5');
  const { flags } = useFlags();
  const { setWellbeingSummary, setEphemeralSignal } = useDashboardStore((state) => ({
    setWellbeingSummary: state.setWellbeingSummary,
    setEphemeralSignal: state.setEphemeralSignal,
  }));
  const [storage, setStorage] = useLocalStorage<WeeklyPlanStorage>(STORAGE_KEY, defaultStorage);
  const [catalog, setCatalog] = useState<InstrumentCatalog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const flagEnabled = flags.FF_DASHBOARD && flags.FF_ASSESS_WHO5;
  const lastSummary = storage.lastSummary;

  useEffect(() => {
    if (!flagEnabled) {
      setWellbeingSummary(null);
      return;
    }

    if (lastSummary) {
      setWellbeingSummary(lastSummary);
    } else {
      setWellbeingSummary(null);
    }
  }, [flagEnabled, lastSummary, setWellbeingSummary]);

  useEffect(() => {
    let isMounted = true;
    clinicalScoringService.getCatalog('WHO5').then((data) => {
      if (isMounted) {
        setCatalog(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (assessment.state.catalog) {
      setCatalog(assessment.state.catalog);
    }
  }, [assessment.state.catalog]);

  const now = Date.now();
  const snoozedUntil = storage.snoozedUntil ? new Date(storage.snoozedUntil).getTime() : undefined;
  const lastSummaryAt = lastSummary ? new Date(lastSummary.recordedAt).getTime() : undefined;

  const shouldInvite = useMemo(() => {
    if (!flagEnabled) return false;
    if (!assessment.state.canDisplay) return false;
    if (snoozedUntil && snoozedUntil > now) return false;
    if (!lastSummaryAt) return true;

    return now - lastSummaryAt > WEEKLY_INTERVAL;
  }, [assessment.state.canDisplay, flagEnabled, lastSummaryAt, now, snoozedUntil]);

  const hasConsent = assessment.state.hasConsent;

  const resetAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  const handleLater = useCallback(() => {
    const snoozeUntil = new Date(now + SNOOZE_INTERVAL).toISOString();
    setStorage((prev) => ({
      ...prev,
      snoozedUntil: snoozeUntil,
      lastPromptAt: new Date(now).toISOString(),
    }));
    toast({
      title: 'Invitation reportée',
      description: 'Nous vous reproposerons ce rituel en douceur un peu plus tard.',
    });
  }, [now, setStorage, toast]);

  const openAssessment = useCallback(async () => {
    if (!flagEnabled) return;

    const timestamp = new Date(now).toISOString();
    setStorage((prev) => ({ ...prev, lastPromptAt: timestamp, snoozedUntil: undefined }));

    if (!hasConsent) {
      await assessment.grantConsent();
    }

    await assessment.triggerAssessment('WHO5', {
      onLowWellbeing: () => {
        toast({
          title: 'On va doucement',
          description: 'Merci pour ce partage, nous adaptons le plan avec délicatesse.',
        });
      },
      onOptimalState: () => {
        toast({
          title: 'Belle énergie',
          description: 'Nous laissons plus de place aux explorations motivantes.',
        });
      },
    });

    resetAnswers();
    setIsDialogOpen(true);
  }, [assessment, flagEnabled, hasConsent, now, resetAnswers, setStorage, toast]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    resetAnswers();
  }, [resetAnswers]);

  const persistSummary = useCallback(
    (summary: DashboardWellbeingSignal) => {
      setStorage((prev) => ({
        ...prev,
        lastSummary: summary,
        snoozedUntil: undefined,
      }));
      setWellbeingSummary(summary);
      setEphemeralSignal(summary);
    },
    [setEphemeralSignal, setStorage, setWellbeingSummary],
  );

  const handleSubmit = useCallback(async () => {
    if (!catalog) return;

    const missingAnswer = catalog.items.some((item) => !answers[item.id]);
    if (missingAnswer) {
      toast({
        title: 'Quelques réponses manquent',
        description: 'Prenez le temps de répondre à chaque sensation avant de valider.',
        variant: 'destructive',
      });
      return;
    }

    const formattedAnswers = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [key, Number(value)]),
    );

    setIsSubmitting(true);
    try {
      const computation = clinicalScoringService.calculate('WHO5', formattedAnswers, assessment.state.locale);
      let submitted = false;

      if (assessment.state.currentInstrument === 'WHO5' && assessment.state.hasConsent) {
        submitted = await assessment.submitResponse(formattedAnswers);
      }

      if (!submitted) {
        const fallback = await clinicalScoringService.submitResponse('WHO5', formattedAnswers);
        submitted = fallback.success;
      }

      if (submitted) {
        const summary = buildWellbeingSummary(
          computation.summary,
          computation.level,
          computation.generatedAt,
        );
        persistSummary(summary);
        toast({
          title: 'Merci pour votre partage',
          description: 'Le plan de la semaine a été ajusté avec douceur.',
        });
        handleCloseDialog();
      } else {
        toast({
          title: 'Envoi interrompu',
          description: 'La soumission n’a pas abouti. Vous pourrez réessayer quand vous le souhaitez.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('WHO-5 submission error', error);
      toast({
        title: 'Envoi interrompu',
        description: 'La soumission n’a pas abouti. Vous pourrez réessayer quand vous le souhaitez.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, assessment, catalog, handleCloseDialog, persistSummary, toast]);

  if (!flagEnabled) {
    return null;
  }

  const planTone = lastSummary?.tone;
  const descriptionCopy = planTone ? PLAN_DESCRIPTIONS[planTone] : null;

  return (
    <>
      <Card aria-labelledby="weekly-plan-title" className="border-muted bg-muted/40 backdrop-blur" role="region">
        <CardHeader className="space-y-3">
          <div className="flex flex-col space-y-2">
            <CardTitle id="weekly-plan-title" className="text-xl font-semibold">
              Plan de la semaine
            </CardTitle>
            {planTone ? (
              <CardDescription className="text-base">
                {`Cette semaine : ${getHeadlineForTone(planTone)}.`}
              </CardDescription>
            ) : (
              <CardDescription className="text-base">
                Un rituel très court pour orienter les cartes selon votre météo intérieure.
              </CardDescription>
            )}
            {planTone && (
              <Badge variant="outline" className="sr-only">
                {`Synthèse enregistrée ${formatDate(lastSummary!.recordedAt)}`}
              </Badge>
            )}
          </div>
          {descriptionCopy && (
            <p className="text-sm text-muted-foreground">
              {descriptionCopy.intro} {descriptionCopy.helper}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!planTone && (
            <p className="text-muted-foreground">
              Vous choisissez si ce moment a lieu maintenant. Aucune donnée n’est partagée sans votre accord explicite.
            </p>
          )}
          {planTone && lastSummary && (
            <p className="text-muted-foreground">
              {`Résumé précédent : ${lastSummary.detail}.`}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {shouldInvite
              ? 'Un moment doux et toujours optionnel pour guider le tableau de bord.'
              : planTone
                ? 'Vous pouvez ajuster le plan à tout moment si l’humeur change.'
                : 'Commencez quand vous le sentez, sans pression.'}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {shouldInvite ? (
              <>
                <Button variant="ghost" onClick={handleLater} className="order-2 sm:order-1">
                  Passer pour cette fois
                </Button>
                <Button onClick={openAssessment} className="order-1 sm:order-2">
                  Je prends ce moment
                </Button>
              </>
            ) : (
              <Button onClick={openAssessment} variant="secondary">
                Mettre à jour le plan
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetAnswers();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Partagez votre météo intérieure</DialogTitle>
            <DialogDescription>
              Cinq ressentis pour vous situer cette semaine. Répondez selon votre impression globale.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {catalog?.items.map((item) => (
              <div key={item.id} className="space-y-3">
                <p className="font-medium text-card-foreground">{item.prompt}</p>
                <RadioGroup
                  value={answers[item.id] ?? ''}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, [item.id]: value }))}
                  className="grid gap-2"
                >
                  {SCALE_OPTIONS.map((option) => (
                    <Label
                      key={option.value}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border p-3 transition focus-within:ring-2 focus-within:ring-ring focus:outline-none cursor-pointer ${
                        answers[item.id] === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-card-foreground">{option.label}</span>
                        <span className="text-sm text-muted-foreground">{option.helper}</span>
                      </div>
                      <RadioGroupItem value={option.value} className="sr-only" />
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="ghost" onClick={handleCloseDialog} disabled={isSubmitting}>
              Je reviendrai plus tard
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Valider en douceur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklyPlanCard;
