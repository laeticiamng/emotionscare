"use client";

import React, { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Loader2 } from 'lucide-react';

import { PageHeader, Button } from '@/COMPONENTS.reg';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Dialog components imported below at line 23-30
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/useToast';
import { useSessionClock } from '@/modules/breath/useSessionClock';
import { makeProtocol, getTotalDuration, type ProtocolPreset, type Step } from '@/modules/breath/protocols';
import { BreathCircle } from '@/modules/breath/components/BreathCircle';
import { BreathProgress } from '@/modules/breath/components/BreathProgress';
import { logAndJournal } from '@/modules/breath/logging';
import { computeMoodDelta, sanitizeMoodScore } from '@/modules/breath/mood';
import { useSound } from '@/COMPONENTS.reg';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STEP_LABELS: Record<Step['kind'], string> = {
  in: 'Inspire',
  hold: 'Retiens',
  out: 'Expire',
};

const STEP_HINTS: Record<Step['kind'], string> = {
  in: 'Remplis les poumons en douceur, épaules relâchées.',
  hold: 'Garde l’air sans crispation et relâche les épaules.',
  out: 'Relâche progressivement l’air jusqu’au bout.',
};

const COHERENCE_VARIANTS = [
  { id: '5-5', label: 'In 5 s / Out 5 s', overrides: undefined },
  { id: '45-55', label: 'In 4,5 s / Out 5,5 s', overrides: { inMs: 4_500, outMs: 5_500 } },
] as const;

type CoherenceVariantId = (typeof COHERENCE_VARIANTS)[number]['id'];

type AssessmentItem = { id: string; text: string; scale?: string[] };

type AssessmentStatus = 'idle' | 'loading' | 'ready' | 'error' | 'submitted';

type StaiPhase = 'before' | 'after';

const FALLBACK_STAI_ITEMS: AssessmentItem[] = [
  { id: 's1', text: 'Je me sens calme.' },
  { id: 's2', text: 'Je me sens en sécurité.' },
  { id: 's3', text: 'Je me sens tendu(e).' },
  { id: 's4', text: 'Je me sens à l’aise.' },
  { id: 's5', text: 'Je me sens inquiet/inquiète.' },
  { id: 's6', text: 'Je me sens détendu(e).' },
];

import ZeroNumberBoundary from '@/components/a11y/ZeroNumberBoundary';
import BreathFlowController from '@/features/breath/BreathFlowController';
import SleepPreset from '@/features/breath/sleep/SleepPreset';
import useBreathworkOrchestration from '@/features/orchestration/useBreathworkOrchestration';
import persistSession from '@/features/session/persistSession';
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
            {staiSubmissionStatus[phase] === 'submitted' && (
              <span className="text-sm text-emerald-600">Merci ! Tes réponses ont été prises en compte.</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ConsentGate>
      <main className="space-y-6 p-6" aria-label="Module de respiration guidée">
      <PageHeader
        title="Respiration guidée"
        subtitle="Séance 4-7-8 ou cohérence cardiaque avec guidances douces, journalisation automatique et respect du motion-safe."
      />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de séance</CardTitle>
            <CardDescription>
              Choisis ton protocole et personnalise les guidances. Le raccourci clavier <kbd className="rounded border px-1">Espace</kbd> permet de démarrer ou mettre en pause.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="protocol-select">Protocole respiratoire</Label>
                <select
                  id="protocol-select"
                  className="w-full rounded-md border border-slate-300 bg-white p-2"
                  value={protocol}
                  onChange={event => setProtocol(event.target.value as ProtocolPreset)}
                  disabled={sessionClock.state !== 'idle'}
                >
                  <option value="478">4-7-8 (Sommeil profond)</option>
                  <option value="coherence">Cohérence cardiaque</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes-input">Durée totale (minutes)</Label>
                <Input
                  id="minutes-input"
                  type="number"
                  min={1}
                  max={10}
                  step={1}
                  value={minutes}
                  onChange={handleMinutesChange}
                  disabled={sessionClock.state !== 'idle'}
                />
              </div>
            </div>

            {protocol === 'coherence' && (
              <div className="space-y-2">
                <Label htmlFor="coherence-variant">Variante de cohérence</Label>
                <select
                  id="coherence-variant"
                  className="w-full rounded-md border border-slate-300 bg-white p-2"
                  value={coherenceVariant}
                  onChange={event => setCoherenceVariant(event.target.value as CoherenceVariantId)}
                  disabled={sessionClock.state !== 'idle'}
                >
                  {COHERENCE_VARIANTS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <Label htmlFor="audio-toggle">Guidance audio douce</Label>
                  <p className="text-xs text-muted-foreground">Cue discret à chaque transition (désactivé par défaut).</p>
                </div>
                <Switch
                  id="audio-toggle"
                  checked={audioCues}
                  onCheckedChange={setAudioCues}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <Label htmlFor="visual-toggle">Guidance visuelle</Label>
                  <p className="text-xs text-muted-foreground">Cercle pulsé si l’animation est permise.</p>
                </div>
                <Switch
                  id="visual-toggle"
                  checked={visualGuide}
                  onCheckedChange={setVisualGuide}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <Label htmlFor="sleep-preset-toggle">Preset “Endormissement”</Label>
                <p className="text-xs text-muted-foreground">
                  Active la routine 4-7-8 et le suivi ISI hebdomadaire discret.
                </p>
              </div>
              <Switch
                id="sleep-preset-toggle"
                checked={sleepPresetEnabled}
                onCheckedChange={value => setSleepPresetEnabled(Boolean(value))}
                disabled={sessionClock.state !== 'idle'}
              />
            </div>

            <div className="space-y-2">
              <Label>Auto-évaluation avant séance</Label>
              <Slider
                value={[moodBefore ?? 50]}
                min={0}
                max={100}
                step={5}
                onValueChange={values => setMoodBefore(values[0])}
                aria-label="Niveau d’apaisement avant séance"
              />
              <p className="text-xs text-muted-foreground">Glisse pour indiquer ton niveau d’apaisement (0 = tendu, 100 = très serein).</p>
            </div>
          </CardContent>
        </Card>


const BreathPage: React.FC = () => {
  const orchestration = useBreathworkOrchestration();
  const [sessionActive, setSessionActive] = useState(false);
  const [sleepMode, setSleepMode] = useState(orchestration.mode === 'sleep_preset');
  const staiAssessment = orchestration.assessments.stai;
  const isiAssessment = orchestration.assessments.isi;

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
      Sentry.addBreadcrumb({
        category: 'breath',
        message: 'breath:session:end',
        level: 'info',
        data: { mode: sleepMode ? 'sleep_preset' : 'default', profile: orchestration.profile },
      });
      void persistSession('breath', {
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
    <ZeroNumberBoundary className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 sm:px-6">
        <PageHeader
          title="Respiration orchestrée"
          description="Une bulle de calme qui s’ajuste à ton état intérieur, sans chiffres ni pression."
        />

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
            title="Envie d’un court check-in ?"
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
            title="Suivi sommeil hebdo disponible"
            description="Dis-nous comment se passent tes nuits pour adoucir encore la routine du soir."
            cta="Je participe"
            onStart={() => {
              void orchestration.startIsi();
            }}
            onSkip={skipAssessment}
          />
        ) : null}

        <SleepPreset
          active={sleepMode}
          onToggle={(next) => {
            setSleepMode(next);
            if (!next && orchestration.mode === 'sleep_preset') {
              Sentry.addBreadcrumb({
                category: 'breath',
                message: 'breath:mode:manual_default',
                level: 'info',
              });
            }
          }}
        />

        {sessionActive ? (
          <BreathFlowController
            profile={orchestration.profile}
            ambience={orchestration.ambience}
            guidance={orchestration.guidance}
            summaryLabel={orchestration.summaryLabel}
            mode={sleepMode ? 'sleep_preset' : orchestration.mode}
            next={orchestration.next}
            onFinish={handleSessionFinish}
          />
        ) : (
          <Card className="border-slate-800/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Prêt·e à respirer ?</CardTitle>
              <CardDescription>
                Installe-toi confortablement, baisse la luminosité si tu le souhaites et laisse la guidance t’emporter.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button onClick={handleStartSession}>Lancer la session</Button>
              <span className="text-sm text-slate-400/90" data-zero-number-check="true">
                Le mode Sommeil propose un fond sonore très doux et des visuels assourdis.
              </span>
            </CardContent>
          </Card>
        )}
      </div>

          <Card>
            <CardHeader>
              <CardTitle>Adaptations automatiques</CardTitle>
              <CardDescription>
                Résumés et orchestrations issus de tes évaluations opt-in. Aucun score n’est affiché.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clinicalSummaries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Active STAI-6 ou ISI pour voir apparaître des résumés personnalisés.
                </p>
              ) : (
                <ul className="space-y-3">
                  {clinicalSummaries.map(item => (
                    <li
                      key={item.id}
                      className="space-y-1 rounded-md border border-slate-200/70 bg-white/70 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-700">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}

              {orchestrationHints.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orchestration</p>
                  <ul className="space-y-2">
                    {orchestrationHints.map(item => (
                      <li
                        key={item.id}
                        className="space-y-1 rounded-md border border-indigo-200 bg-indigo-50/70 p-3 text-indigo-900"
                      >
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-sm">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sleepPackVisible && (
                <Button asChild variant="secondary">
                  <a href="https://nyvee.app/pack-sommeil" target="_blank" rel="noreferrer">
                    Explorer le Pack Sommeil Nyvée
                  </a>
                </Button>
              )}

              {sleepReminderActive && orchestrationHints.some(item => item.id === 'dashboard-reminder') && (
                <p className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
                  Un rappel “respiration apaisante” est désormais présent sur ton tableau de bord.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Dialog open={showStaiOptInDialog} onOpenChange={setShowStaiOptInDialog}>
        <DialogContent aria-describedby={staiDialogDescriptionId} role="dialog">
          <DialogHeader>
            <DialogTitle>Confirmer l’activation de STAI-6</DialogTitle>
            <DialogDescription id={staiDialogDescriptionId}>
              Les réponses restent invisibles et servent uniquement à ajuster les recommandations de respiration et de suivi.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Six items avant/après, jamais de score affiché.</li>
            <li>• Données stockées de façon chiffrée côté clinique.</li>
            <li>• Retirable à tout moment depuis cette carte.</li>
          </ul>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={cancelStaiOptIn}>
              Annuler
            </Button>
            <Button onClick={confirmStaiOptIn}>
              Activer STAI-6
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showIsiOptInDialog} onOpenChange={setShowIsiOptInDialog}>
        <DialogContent aria-describedby={isiDialogDescriptionId} role="dialog">
          <DialogHeader>
            <DialogTitle>Confirmer le suivi sommeil ISI</DialogTitle>
            <DialogDescription id={isiDialogDescriptionId}>
              Les réponses sont utilisées pour ajuster automatiquement le preset Endormissement et rester invisibles en interface.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Sept items hebdomadaires, jamais de score affiché.</li>
            <li>• Les données sont stockées avec chiffrement clinique.</li>
            <li>• Possibilité d’arrêter le suivi à tout moment.</li>
          </ul>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={cancelIsiOptIn}>
              Annuler
            </Button>
            <Button onClick={confirmIsiOptIn}>
              Activer ISI hebdo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
    </ConsentGate>

  );
};

export default BreathPage;
