// @ts-nocheck
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { Loader2, Wind, BookOpen, Zap, Trophy } from 'lucide-react';

import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/useToast';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import BreathSessionStats from '@/components/breath/BreathSessionStats';
import { BreathingTechniquesLibrary } from '@/components/breath/BreathingTechniquesLibrary';
import { BreathSessionFeedback } from '@/components/breath/BreathSessionFeedback';
import { BreathProgressMilestones } from '@/components/breath/BreathProgressMilestones';
import { useBreathSessions } from '@/hooks/useBreathSessions';

import ZeroNumberBoundary from '@/components/a11y/ZeroNumberBoundary';
import BreathFlowController from '@/features/breath/BreathFlowController';
import SleepPreset from '@/features/breath/sleep/SleepPreset';
import useBreathworkOrchestration from '@/features/orchestration/useBreathworkOrchestration';
import { persistBreathSession } from '@/features/session/persistSession';
import type { AnswerValue, UseAssessmentResult } from '@/hooks/useAssessment';

const STAI_OPTIONS = ['Jamais', 'Parfois', 'Souvent', 'Toujours'] as const;
const ISI_OPTIONS = ['Aucun', 'Léger', 'Modéré', 'Important', 'Très important'] as const;

type AssessmentKind = 'STAI6' | 'ISI';

interface AssessmentPromptProps {
  title: string;
  description: string;
  cta: string;
  onStart: () => void;
  onSkip: () => void;
}

const AssessmentPrompt: React.FC<AssessmentPromptProps> = ({ title, description, cta, onStart, onSkip }) => (
  <Card className="border-amber-500/30 bg-slate-950/80 text-slate-100" data-zero-number-check="true">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-amber-100/90">{title}</CardTitle>
      <CardDescription className="text-sm text-slate-200/80">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-3">
      <Button onClick={onStart}>{cta}</Button>
      <Button variant="ghost" onClick={onSkip} className="text-slate-200/70">
        Plus tard
      </Button>
    </CardContent>
  </Card>
);

interface AssessmentDialogProps {
  assessment: UseAssessmentResult;
  kind: AssessmentKind;
  label: string;
  description: string;
  onClose: () => void;
}

const resolveOptions = (kind: AssessmentKind) => (kind === 'STAI6' ? STAI_OPTIONS : ISI_OPTIONS);

const toValue = (kind: AssessmentKind, index: number): AnswerValue => (kind === 'STAI6' ? index + 1 : index);

const AssessmentDialog: React.FC<AssessmentDialogProps> = ({ assessment, kind, label, description, onClose }) => {
  const { toast } = useToast();
  const options = resolveOptions(kind);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  useEffect(() => {
    if (!assessment.state.isActive) {
      setAnswers({});
    }
  }, [assessment.state.isActive]);

  const submitAssessment = useCallback(async () => {
    const items = assessment.state.catalog?.items ?? [];
    if (!items.length) {
      return;
    }

    const payload: Record<string, AnswerValue> = {};
    items.forEach((item) => {
      const value = answers[item.id];
      if (value !== undefined) {
        payload[item.id] = value;
      }
    });

    const success = await assessment.submitResponse(payload);
    if (success) {
      toast({
        title: 'Merci pour ton partage',
        description: "Nous adaptons immédiatement la séance à ton ressenti.",
      });
    }
  }, [answers, assessment, toast]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      assessment.reset();
      onClose();
    }
  };

  const items = assessment.state.catalog?.items ?? [];

  return (
    <Dialog open={assessment.state.isActive} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto" data-zero-number-check="true">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            void submitAssessment();
          }}
        >
          {!items.length ? (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Chargement des ressentis…</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="space-y-3">
                <p className="text-base font-medium text-slate-100/90">{item.prompt}</p>
                <RadioGroup
                  className="grid gap-2"
                  value={(() => {
                    const current = answers[item.id];
                    if (current === undefined) return undefined;
                    const numeric = Number(current);
                    return kind === 'STAI6' ? String(numeric - 1) : String(numeric);
                  })()}
                  onValueChange={(value) => {
                    setAnswers((prev) => ({
                      ...prev,
                      [item.id]: toValue(kind, Number(value)),
                    }));
                  }}
                >
                  {options.map((option, index) => {
                    const value = String(index);
                    const isSelected = (() => {
                      const current = answers[item.id];
                      if (current === undefined) return false;
                      const numeric = Number(current);
                      return kind === 'STAI6' ? numeric === index + 1 : numeric === index;
                    })();
                    return (
                      <Label
                        key={option}
                        htmlFor={`${item.id}-${value}`}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium transition-colors',
                          isSelected
                            ? 'border-amber-300/80 bg-amber-400/10 text-amber-100'
                            : 'border-slate-800/60 bg-slate-900/80 text-slate-100/90 hover:border-slate-700',
                        )}
                      >
                        <RadioGroupItem value={value} id={`${item.id}-${value}`} className="sr-only" />
                        <span>{option}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            ))
          )}
          <DialogFooter className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={items.some((item) => answers[item.id] === undefined)}>
              Envoyer
            </Button>
            {assessment.state.status === 'submitted' && (
              <span className="text-sm text-emerald-600">Merci ! Tes réponses ont été prises en compte.</span>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BreathPage: React.FC = () => {
  const orchestration = useBreathworkOrchestration();
  const [sessionActive, setSessionActive] = useState(false);
  const [sleepMode, setSleepMode] = useState(orchestration.mode === 'sleep_preset');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [lastSessionDuration, setLastSessionDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('session');

  const staiAssessment = orchestration.assessments.stai;
  const isiAssessment = orchestration.assessments.isi;
  const { stats } = useBreathSessions();

  useEffect(() => {
    if (orchestration.mode === 'sleep_preset') {
      setSleepMode(true);
    }
  }, [orchestration.mode]);

  const handleStartSession = () => {
    setSessionActive(true);
    Sentry.addBreadcrumb({
      category: 'breath',
      message: 'breath:session:start',
      level: 'info',
      data: { mode: sleepMode ? 'sleep_preset' : 'default', profile: orchestration.profile },
    });
  };

  const handleSessionFinish = useCallback(
    ({ durationSec }: { durationSec: number }) => {
      setSessionActive(false);
      setLastSessionDuration(durationSec);
      setFeedbackOpen(true);

      Sentry.addBreadcrumb({
        category: 'breath',
        message: 'breath:session:end',
        level: 'info',
        data: { mode: sleepMode ? 'sleep_preset' : 'default', profile: orchestration.profile },
      });
      void persistBreathSession('breath', {
        profile: orchestration.profile,
        mode: sleepMode ? 'sleep_preset' : orchestration.mode,
        next: orchestration.next,
        notes: 'soft_exit',
        summary: orchestration.summaryLabel,
        durationSec,
      });
    },
    [orchestration.mode, orchestration.next, orchestration.profile, orchestration.summaryLabel, sleepMode],
  );

  const showStaiPrompt = orchestration.staiPreDue && !staiAssessment.state.isActive;
  const showIsiPrompt = orchestration.isiDue && sleepMode && !isiAssessment.state.isActive;

  const skipAssessment = () => undefined;

  return (
    <ConsentGate>
      <ZeroNumberBoundary className="min-h-screen bg-slate-950 py-10 text-slate-100">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6">
          <PageHeader
            title="Respiration orchestrée"
            description="Une bulle de calme qui s'ajuste à ton état intérieur, sans chiffres ni pression."
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800/50">
              <TabsTrigger value="session" className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                <span className="hidden sm:inline">Séance</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="techniques" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Techniques</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Exploits</span>
              </TabsTrigger>
            </TabsList>

            {/* Session Tab */}
            <TabsContent value="session" className="space-y-6">
              <Card className="border-slate-800/70 bg-slate-950/60" data-zero-number-check="true">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-100">Ton atmosphère du moment</CardTitle>
                  <CardDescription className="text-sm text-slate-200/80">
                    {orchestration.summaryLabel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-amber-400/10 px-4 py-1 text-sm text-amber-200/90">
                    Cadence : {orchestration.profile === 'long_exhale_focus' ? 'expirations très longues' : orchestration.profile === 'standard_soft' ? 'équilibre doux' : 'souffle ample'}
                  </span>
                  <span className="rounded-full bg-slate-800/60 px-4 py-1 text-sm text-slate-200/80">
                    Ambiance : {sleepMode ? 'Sommeil' : 'Classique'}
                  </span>
                </CardContent>
              </Card>

              {showStaiPrompt ? (
                <AssessmentPrompt
                  title="Envie d'un court check-in ?"
                  description="Réponds à quelques ressentis pour ajuster la cadence."
                  cta="Partager mon ressenti"
                  onStart={() => {
                    void orchestration.startStaiPre();
                  }}
                  onSkip={skipAssessment}
                />
              ) : null}

              {showIsiPrompt ? (
                <AssessmentPrompt
                  title="Suivi discret du sommeil"
                  description="Quelques questions sur ton repos cette semaine pour optimiser la routine d'endormissement."
                  cta="Répondre rapidement"
                  onStart={() => {
                    void orchestration.startIsi();
                  }}
                  onSkip={skipAssessment}
                />
              ) : null}

              {sessionActive ? (
                sleepMode ? (
                  <SleepPreset onSessionFinish={handleSessionFinish} />
                ) : (
                  <BreathFlowController
                    profile={orchestration.profile}
                    onSessionFinish={handleSessionFinish}
                  />
                )
              ) : (
                <Card className="border-slate-800/60 bg-slate-950/40" data-zero-number-check="true">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-100">Prêt pour ta séance ?</CardTitle>
                    <CardDescription className="text-sm text-slate-300/80">
                      Lance une session adaptée à ton état du moment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="lg" onClick={handleStartSession} className="w-full">
                      Démarrer la séance
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <BreathSessionStats />
            </TabsContent>

            {/* Techniques Tab */}
            <TabsContent value="techniques">
              <BreathingTechniquesLibrary />
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <BreathProgressMilestones
                totalSessions={stats.totalSessions}
                totalMinutes={stats.totalMinutes}
                currentStreak={stats.currentStreak}
                weeklyMinutes={stats.weeklyMinutes}
              />
            </TabsContent>
          </Tabs>

          <AssessmentDialog
            assessment={staiAssessment}
            kind="STAI6"
            label="Partage ton ressenti"
            description="Réponds spontanément, cela nous aide à ajuster l'expérience."
            onClose={() => void orchestration.assessments.stai.reset()}
          />

          <AssessmentDialog
            assessment={isiAssessment}
            kind="ISI"
            label="Suivi sommeil (ISI)"
            description="Questions sur la qualité de ton repos cette semaine."
            onClose={() => void orchestration.assessments.isi.reset()}
          />

          <BreathSessionFeedback
            open={feedbackOpen}
            sessionDurationSec={lastSessionDuration}
            onClose={() => setFeedbackOpen(false)}
          />
        </div>
      </ZeroNumberBoundary>
    </ConsentGate>
  );
};

export default BreathPage;