import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { clinicalScoringService, type InstrumentCatalog } from '@/services/clinicalScoring';

const STORAGE_KEY = 'dashboard:who5-invite:v1';
const WEEKLY_INTERVAL = 7 * 24 * 60 * 60 * 1000;

type InviteStorage = {
  lastPromptAt?: string;
  lastCompletedAt?: string;
  snoozedUntil?: string;
};

const SCALE_OPTIONS: { value: string; label: string; helper: string }[] = [
  { value: '0', label: 'Jamais', helper: 'Aucun moment ne correspondait' },
  { value: '1', label: 'Parfois', helper: 'Quelques instants isolés' },
  { value: '2', label: 'À l’occasion', helper: 'Moins de la moitié du temps' },
  { value: '3', label: 'Souvent', helper: 'Plus de la moitié du temps' },
  { value: '4', label: 'Presque toujours', helper: 'Presque toute la semaine' },
  { value: '5', label: 'Constamment', helper: 'En continu cette semaine' }
];

const defaultInviteState: InviteStorage = {};

export const Who5WeeklyInvitation: React.FC = () => {
  const { toast } = useToast();
  const assessment = useAssessment('WHO5');
  const [inviteState, setInviteState] = useLocalStorage<InviteStorage>(STORAGE_KEY, defaultInviteState);
  const [catalog, setCatalog] = useState<InstrumentCatalog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    clinicalScoringService.getCatalog('WHO5').then(data => {
      if (isMounted) {
        setCatalog(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const now = Date.now();

  const shouldShowCard = useMemo(() => {
    if (!catalog) return false;
    if (inviteState.snoozedUntil) {
      const snoozedUntil = new Date(inviteState.snoozedUntil).getTime();
      if (snoozedUntil > now) {
        return false;
      }
    }

    const lastCompleted = inviteState.lastCompletedAt
      ? new Date(inviteState.lastCompletedAt).getTime()
      : undefined;
    const lastPrompt = inviteState.lastPromptAt ? new Date(inviteState.lastPromptAt).getTime() : undefined;

    if (!lastCompleted && !lastPrompt) {
      return true;
    }

    const reference = lastCompleted ?? lastPrompt ?? 0;
    return now - reference > WEEKLY_INTERVAL;
  }, [catalog, inviteState.lastCompletedAt, inviteState.lastPromptAt, inviteState.snoozedUntil, now]);

  const hasConsent = assessment.state.hasConsent;

  const resetAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  const handleLater = useCallback(() => {
    const snoozeUntil = new Date(now + WEEKLY_INTERVAL).toISOString();
    setInviteState(prev => ({ ...prev, snoozedUntil: snoozeUntil, lastPromptAt: new Date(now).toISOString() }));
    toast({
      title: 'Invitation reportée',
      description: 'Nous vous reproposerons ce moment de douceur un peu plus tard.',
    });
  }, [now, setInviteState, toast]);

  const openAssessment = useCallback(async () => {
    const timestamp = new Date(now).toISOString();
    setInviteState(prev => ({ ...prev, lastPromptAt: timestamp, snoozedUntil: undefined }));

    if (!hasConsent) {
      await assessment.grantConsent('WHO5');
    }

    await assessment.triggerAssessment('WHO5', {
      onLowWellbeing: () => {
        toast({
          title: 'On reste tout en douceur',
          description: 'Merci pour ce partage, nous ajustons discrètement votre accompagnement.',
        });
      },
      onOptimalState: () => {
        toast({
          title: 'Belle énergie reçue',
          description: 'Nous poursuivons ce suivi feutré selon vos ressentis.',
        });
      },
    });

    resetAnswers();
    setIsDialogOpen(true);
  }, [assessment, hasConsent, now, resetAnswers, setInviteState, toast]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    resetAnswers();
  }, [resetAnswers]);

  const handleSubmit = useCallback(async () => {
    if (!catalog) return;

    const missingAnswer = catalog.items.some(item => !answers[item.id]);
    if (missingAnswer) {
      toast({
        title: 'Quelques réponses manquent',
        description: 'Prenez le temps de répondre à chaque sensation avant de valider.',
        variant: 'destructive',
      });
      return;
    }

    const formattedAnswers = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [key, Number(value)])
    );

    setIsSubmitting(true);
    try {
      let submitted = false;
      if (assessment.state.currentInstrument === 'WHO5' && assessment.state.hasConsent) {
        submitted = await assessment.submitResponse(formattedAnswers);
      }

      if (!submitted) {
        submitted = await clinicalScoringService.submitResponse('WHO5', formattedAnswers);
      }

      if (submitted) {
        const completionTimestamp = new Date().toISOString();
        setInviteState(prev => ({
          ...prev,
          lastCompletedAt: completionTimestamp,
          snoozedUntil: undefined,
        }));
        toast({
          title: 'Merci pour votre partage',
          description: 'Votre espace se cale doucement sur ce que vous vivez en ce moment.',
        });
        handleCloseDialog();
      } else {
        toast({
          title: 'Envoi interrompu',
          description: 'La soumission n’a pas abouti. Vous pouvez réessayer quand vous le souhaitez.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('WHO-5 submission error', error);
      toast({
        title: 'Envoi interrompu',
        description: 'La soumission n’a pas abouti. Vous pouvez réessayer quand vous le souhaitez.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, assessment, catalog, handleCloseDialog, setInviteState, toast]);

  if (!shouldShowCard || !catalog) {
    return null;
  }

  return (
    <>
      <Card
        aria-labelledby="who5-invite-title"
        className="border-muted bg-muted/40 backdrop-blur"
        role="region"
      >
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <CardTitle id="who5-invite-title" className="text-xl font-semibold">
              Un check-in douceur pour cette semaine
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Nous vous proposons le rituel WHO-5, en toute discrétion. Quelques ressentis suffisent pour
              ajuster l’accompagnement à votre rythme.
            </CardDescription>
            {hasConsent && (
              <Badge variant="outline" className="sr-only">
                Rituel hebdomadaire configuré
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vous choisissez si ce moment a lieu maintenant. Aucune donnée n’est partagée sans votre accord explicite.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {hasConsent
              ? 'Le rituel reste disponible quand vous en ressentez le besoin.'
              : 'Votre accord éclairé est demandé juste avant de commencer.'}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="ghost" onClick={handleLater} className="order-2 sm:order-1">
              Doucement, plus tard
            </Button>
            <Button onClick={openAssessment} className="order-1 sm:order-2">
              Je prends ce moment
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
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
            {catalog.items.map(item => (
              <div key={item.id} className="space-y-3">
                <p className="font-medium text-card-foreground">{item.prompt}</p>
                <RadioGroup
                  value={answers[item.id] ?? ''}
                  onValueChange={value => setAnswers(prev => ({ ...prev, [item.id]: value }))}
                  className="grid gap-2"
                >
                  {SCALE_OPTIONS.map(option => (
                    <Label
                      key={option.value}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border p-3 transition focus-within:ring-2 focus-within:ring-ring focus:outline-none cursor-pointer ${
                        answers[item.id] === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-muted'
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

export default Who5WeeklyInvitation;
