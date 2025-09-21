'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashGlowSession, type FlashGlowAction } from '@/features/flash-glow/hooks/useFlashGlowSession';
import { persistFlashGlowSession } from '@/features/session/persistSession';
import { useToast } from '@/hooks/use-toast';
import { useClinicalHints, type ClinicalHintsSnapshot } from '@/hooks/useClinicalHints';
import { ff } from '@/lib/flags/ff';

const deriveActions = (snapshot: ClinicalHintsSnapshot): FlashGlowAction[] => {
  const flash = snapshot.moduleCues.flashGlow;
  const isDelicate = snapshot.tone === 'delicate';
  const actions: FlashGlowAction[] = [
    { type: 'set_visuals_intensity', intensity: isDelicate ? 'lowered' : 'medium' },
    {
      type: 'set_breath_pattern',
      pattern: flash?.extendDuration || isDelicate ? 'exhale_longer' : 'neutral',
    },
    {
      type: 'set_audio_fade',
      profile: flash?.exitMode === 'soft' || isDelicate ? 'slow' : 'normal',
    },
    {
      type: 'set_haptics',
      mode: isDelicate ? 'off' : 'calm',
    },
  ];

  if (flash?.extendDuration) {
    actions.push({ type: 'extend_session', durationMs: 60_000 });
  }

  if (flash?.exitMode === 'soft') {
    actions.push({ type: 'soft_exit' });
  }

  actions.push({ type: 'post_cta', target: flash?.companionPath ? 'screen_silk' : 'none' });
  return actions;
};

const DEFAULT_ACTIONS: FlashGlowAction[] = [
  { type: 'set_visuals_intensity', intensity: 'medium' },
  { type: 'set_breath_pattern', pattern: 'neutral' },
  { type: 'set_audio_fade', profile: 'normal' },
  { type: 'set_haptics', mode: 'calm' },
  { type: 'post_cta', target: 'none' },
];

const FlashGlowRuntimePage: React.FC = () => {
  const orchestrationEnabled = ff('FF_ORCH_FLASHGLOW');
  const hints = useClinicalHints();
  const orchestratedActions = useMemo(
    () => (orchestrationEnabled ? deriveActions(hints) : DEFAULT_ACTIONS),
    [hints, orchestrationEnabled],
  );

  const { apply, extend, softExit, state } = useFlashGlowSession();
  const { toast } = useToast();

  const extendHandledRef = useRef(false);
  const softExitHandledRef = useRef(false);
  const persistedRef = useRef(false);
  const screenSilkRef = useRef<HTMLAnchorElement | null>(null);

  const [statusMessage, setStatusMessage] = useState('Session alignée sur vos signaux.');
  const [screenSilkVisible, setScreenSilkVisible] = useState(false);

  const extendAction = useMemo(
    () => orchestratedActions.find((action): action is Extract<FlashGlowAction, { type: 'extend_session' }> => action.type === 'extend_session'),
    [orchestratedActions],
  );

  const hasSoftExit = useMemo(() => orchestratedActions.some((action) => action.type === 'soft_exit'), [orchestratedActions]);
  const postCta = useMemo(
    () => orchestratedActions.find((action): action is Extract<FlashGlowAction, { type: 'post_cta' }> => action.type === 'post_cta'),
    [orchestratedActions],
  );

  useEffect(() => {
    if (!orchestrationEnabled) {
      return;
    }
    apply(orchestratedActions);
  }, [apply, orchestratedActions, orchestrationEnabled]);

  useEffect(() => {
    if (!orchestrationEnabled || !extendAction || extendHandledRef.current) {
      return;
    }

    extendHandledRef.current = true;
    setStatusMessage('On prolonge 1 minute en douceur.');
    toast({ title: 'Encore 60 s', description: 'On prolonge la lumière pour vous laisser respirer.' });
    void extend(extendAction.durationMs ?? 60_000);
  }, [extend, extendAction, orchestrationEnabled, toast]);

  useEffect(() => {
    if (!orchestrationEnabled || !hasSoftExit || softExitHandledRef.current) {
      return;
    }

    softExitHandledRef.current = true;
    void softExit().then(() => {
      setStatusMessage('Sortie douce enclenchée, fondu progressif.');
    });
  }, [hasSoftExit, orchestrationEnabled, softExit]);

  useEffect(() => {
    const shouldShowScreenSilk = orchestrationEnabled && postCta?.target === 'screen_silk';
    setScreenSilkVisible(Boolean(shouldShowScreenSilk));
  }, [orchestrationEnabled, postCta]);

  useEffect(() => {
    if (!screenSilkVisible || !screenSilkRef.current) {
      return;
    }
    screenSilkRef.current.focus();
    Sentry.addBreadcrumb({ category: 'flash', level: 'info', message: 'flash:cta:screen_silk' });
  }, [screenSilkVisible]);

  useEffect(() => {
    if (!orchestrationEnabled || persistedRef.current) {
      return;
    }

    const payload = {
      variant: extendAction || hasSoftExit ? 'hr' : 'default',
      visuals_intensity: state.visuals === 'lowered' ? 'lowered' : 'medium',
      breath: state.breath,
      extended_ms: extendAction ? (extendAction.durationMs ?? 60_000) : 0,
      exit: hasSoftExit ? 'soft' : 'none' as const,
      post_cta: postCta?.target === 'screen_silk' ? 'screen_silk' : 'none' as const,
    };

    void persistFlashGlowSession('flash_glow', payload).then((result) => {
      if (result.success) {
        persistedRef.current = true;
      }
    });
  }, [extendAction, hasSoftExit, orchestrationEnabled, postCta, state.breath, state.visuals]);

  const handleManualExtend = () => {
    const duration = extendAction?.durationMs ?? 60_000;
    setStatusMessage('On garde la lumière 60 s de plus.');
    toast({ title: 'Encore 60 s', description: 'Extension relancée manuellement.' });
    void extend(duration);
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6" data-testid="flash-glow-runtime">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Flash Glow orchestré</CardTitle>
          <p className="text-muted-foreground">
            Les actions cliniques SUDS s’appliquent en direct : intensité, respiration et sorties sont ajustées sans chiffres.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section
            aria-live="polite"
            className="rounded-lg border border-dashed p-4 text-sm"
          >
            <p className="font-medium">{statusMessage}</p>
            {state.extendedMs > 0 && (
              <p className="mt-2 text-muted-foreground">
                Extension active (+{Math.round(state.extendedMs / 1000)} s).
              </p>
            )}
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Visuel</p>
              <p className="text-base font-semibold">
                {state.visuals === 'lowered' ? 'Intensité visuelle abaissée' : 'Intensité visuelle moyenne'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Respiration</p>
              <p className="text-base font-semibold">
                {state.breath === 'exhale_longer' ? 'Expiration prolongée' : 'Rythme neutre'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Audio</p>
              <p className="text-base font-semibold">
                {state.audioFade === 'slow' ? 'Fondu sonore lent' : 'Fondu standard'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Haptique</p>
              <p className="text-base font-semibold">
                {state.haptics === 'calm' ? 'Micro-vibrations calmes' : 'Haptique désactivée'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {extendAction && (
              <Button onClick={handleManualExtend} variant="secondary">
                Encore 60 s
              </Button>
            )}
            {screenSilkVisible && (
              <Button asChild variant="outline">
                <a ref={screenSilkRef} href="/app/screen-silk">
                  Screen Silk
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default FlashGlowRuntimePage;
