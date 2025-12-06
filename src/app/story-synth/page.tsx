'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { storySynthOrchestrator } from '@/features/orchestration/storySynth.orchestrator';
import type { SetStoryBedAction, SetStoryVoiceAction } from '@/features/orchestration/types';
import { useAssessment } from '@/hooks/useAssessment';
import { createSession } from '@/services/sessions/sessionsApi';

const STORAGE_KEY = 'orchestration:story_synth';

interface StoredLevels {
  tensionLevel?: number;
  fatigueLevel?: number;
}

const readStoredLevels = (): StoredLevels => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredLevels | null;
    return {
      tensionLevel: typeof parsed?.tensionLevel === 'number' ? parsed.tensionLevel : undefined,
      fatigueLevel: typeof parsed?.fatigueLevel === 'number' ? parsed.fatigueLevel : undefined,
    };
  } catch (error) {
    console.warn('[story-synth] unable to parse stored levels', error);
    return {};
  }
};

const bedLabel = (action: SetStoryBedAction | undefined) =>
  action?.key === 'cocon' ? 'Ambiance cocon' : 'Ambiance libre';

const voiceLabel = (action: SetStoryVoiceAction | undefined) =>
  action?.key === 'slow' ? 'Voix apaisée' : 'Voix naturelle';

const lengthLabel = (shortened: boolean) =>
  shortened
    ? 'Scène resserrée pour ménager ton énergie.'
    : 'Scène ample pour vagabonder autant que tu le souhaites.';

const sanitizeAnnouncement = (message: string) => message.replace(/\d/g, '');

const persistStorySession = async (payload: {
  bed: 'cocon' | 'libre';
  voice: 'slow' | 'natural';
  shorten: 'short' | 'full';
}) => {
  try {
    await createSession({
      type: 'story_synth',
      duration_sec: 0,
      mood_delta: null,
      meta: {
        module: 'story_synth',
        bed: payload.bed,
        voice: payload.voice,
        shorten: payload.shorten,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

const STORY_SNIPPET = [
  'La lumière se dépose comme une couverture chaude sur les épaules.',
  'Un souffle calme accompagne chaque phrase, laissant le temps aux images de flotter.',
  'Les pas du personnage résonnent doucement sur un sol moelleux, sans urgence.',
];

export default function StorySynthPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('POMS_TENSION');
  const [storedLevels, setStoredLevels] = useState<StoredLevels>({});
  const [announcement, setAnnouncement] = useState('Narration neutre prête à t’accueillir.');
  const persistedSignatureRef = useRef<string | null>(null);
  const breadcrumbSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setStoredLevels(readStoredLevels());
    }
  }, []);

  const zeroNumbersReady = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = Boolean(flags.FF_ORCH_STORY);
  const assessmentEnabled = Boolean(flags.FF_ASSESS_POMS || flags.FF_ASSESS_POMS_TENSION);

  const computedTension = assessment.lastSubscaleLevel('tension');
  const computedFatigue = assessment.lastSubscaleLevel('fatigue');

  const tensionLevel = typeof storedLevels.tensionLevel === 'number' ? storedLevels.tensionLevel : computedTension;
  const fatigueLevel = typeof storedLevels.fatigueLevel === 'number' ? storedLevels.fatigueLevel : computedFatigue;

  const hints = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' as const }];
    }
    return storySynthOrchestrator({ tensionLevel, fatigueLevel });
  }, [assessmentEnabled, fatigueLevel, orchestrationEnabled, tensionLevel]);

  const bedAction = useMemo(() => hints.find((hint) => hint.action === 'set_story_bed') as SetStoryBedAction | undefined, [
    hints,
  ]);
  const voiceAction = useMemo(
    () => hints.find((hint) => hint.action === 'set_story_voice') as SetStoryVoiceAction | undefined,
    [hints],
  );
  const shortenAction = useMemo(() => hints.some((hint) => hint.action === 'shorten_scene'), [hints]);

  useEffect(() => {
    const parts: string[] = [];
    if (bedAction?.key === 'cocon') {
      parts.push('Ambiance cocon installée.');
    } else {
      parts.push('Ambiance libre maintenue.');
    }
    if (voiceAction?.key === 'slow') {
      parts.push('Voix ralentie pour envelopper le récit.');
    } else {
      parts.push('Voix naturelle prête à raconter.');
    }
    if (shortenAction) {
      parts.push('Scène resserrée pour préserver ton énergie.');
    } else {
      parts.push('Scène ample et libre.');
    }
    setAnnouncement(sanitizeAnnouncement(parts.join(' ')));
  }, [bedAction?.key, shortenAction, voiceAction?.key]);

  useEffect(() => {
    if (!orchestrationEnabled) {
      return;
    }
    const signature = JSON.stringify({ bed: bedAction?.key, voice: voiceAction?.key, shorten: shortenAction });
    if (breadcrumbSignatureRef.current === signature) {
      return;
    }
    breadcrumbSignatureRef.current = signature;

    if (bedAction?.key === 'cocon') {
      Sentry.addBreadcrumb({ category: 'orch:story', level: 'info', message: 'orch:story:cocon' });
    }
  }, [bedAction?.key, orchestrationEnabled, shortenAction, voiceAction?.key]);

  useEffect(() => {
    if (!orchestrationEnabled || !zeroNumbersReady) {
      return;
    }
    const payload = {
      bed: bedAction?.key === 'cocon' ? 'cocon' : 'libre',
      voice: voiceAction?.key === 'slow' ? 'slow' : 'natural',
      shorten: shortenAction ? 'short' : 'full',
    } as const;
    const payloadSignature = JSON.stringify(payload);
    if (persistedSignatureRef.current === payloadSignature) {
      return;
    }
    persistedSignatureRef.current = payloadSignature;

    void persistStorySession(payload);
  }, [bedAction?.key, orchestrationEnabled, shortenAction, voiceAction?.key, zeroNumbersReady]);

  const ready = zeroNumbersReady && orchestrationEnabled && assessmentEnabled;

  const fallback = (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12 text-indigo-950">
      <h1 className="text-3xl font-semibold">Story Synth</h1>
      <p className="text-base text-indigo-800">
        Pour activer l’histoire adaptée, accepte le partage clinique en douceur depuis la fenêtre qui s’ouvre.
      </p>
    </main>
  );

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      <ConsentGate fallback={fallback}>
        {ready ? (
          <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 text-indigo-950" id="main-content">
            <div role="status" aria-live="polite" className="sr-only">
              {announcement}
            </div>
            <header className="space-y-3">
              <Badge className="bg-indigo-900 text-indigo-100" variant="secondary">
                Story Synth
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight">Histoires orchestrées pour relâcher la tension</h1>
              <p className="max-w-2xl text-base text-indigo-800">
                La narration s’ajuste à tes signaux de tension et de fatigue sans jamais montrer de chiffres. Tu peux savourer un
                récit sur mesure en toute confiance.
              </p>
            </header>

            <section className="grid gap-6 md:grid-cols-2" aria-label="Réglages narratifs">
              <Card>
                <CardHeader>
                  <CardTitle>Cadre sensoriel</CardTitle>
                  <CardDescription>Réglages appliqués automatiquement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-indigo-900">
                  <p>{bedLabel(bedAction)}</p>
                  <p>{voiceLabel(voiceAction)}</p>
                  <p>{lengthLabel(shortenAction)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Invitation</CardTitle>
                  <CardDescription>Prends place dans la scène choisie pour toi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-indigo-900">
                  <p>
                    Installe-toi confortablement, laisse ton souffle guider la lecture. La voix suit un débit feutré pour t’aider à
                    relâcher la pression.
                  </p>
                  <Button type="button" className="w-full justify-center">
                    Lancer la narration douce
                  </Button>
                  <p className="text-xs text-indigo-700">
                    Tu peux interrompre à tout moment. La scène restera disponible tant que tu en as besoin.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section aria-label="Extrait narratif" className="space-y-4">
              <h2 className="text-2xl font-semibold text-indigo-900">Extrait du cocon</h2>
              <Card>
                <CardContent className="space-y-4 py-6 text-indigo-900">
                  {STORY_SNIPPET.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </CardContent>
              </Card>
            </section>

            <footer className="flex flex-wrap items-center justify-between gap-4 text-sm text-indigo-800">
              <span>Besoin d’une transition plus visuelle ?</span>
              <Link
                href="/app/screen-silk"
                className="rounded-full bg-indigo-900 px-4 py-2 text-indigo-50 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Rejoindre Screen Silk
              </Link>
            </footer>
          </main>
        ) : (
          <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-12 text-indigo-950">
            <h1 className="text-3xl font-semibold">Story Synth</h1>
            <p className="max-w-2xl text-base text-indigo-800">
              Active l’orchestration clinique depuis tes paramètres pour que l’histoire épouse ton niveau de tension et de fatigue.
            </p>
          </main>
        )}
      </ConsentGate>
    </ZeroNumberBoundary>
  );
}
