import type { FC } from 'react';
import { useMemo, useState, useEffect } from 'react';

import ZeroNumberBoundary from '@/components/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import useStai6Orchestration from '@/features/orchestration/useStai6Orchestration';
import { BreathingBubble } from '@/features/nyvee/components/BreathingBubble';
import { BadgeReveal } from '@/features/nyvee/components/BadgeReveal';
import { CocoonGallery } from '@/features/nyvee/components/CocoonGallery';
import { PostCheck } from '@/features/nyvee/components/PostCheck';
import { PreCheck } from '@/features/nyvee/components/PreCheck';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCocoonStore } from '@/features/nyvee/stores/cocoonStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const groundingPrompts = [
  'Observe les nuances de lumière autour de toi.',
  'Pose une main sur ta cage thoracique, sens le mouvement du souffle.',
  'Laisse les épaules tomber délicatement.',
  'Imagine une vague qui vient apaiser la poitrine.',
];

const breathingPrompts = [
  'Inspire calmement par le nez.',
  'Suspend le souffle un instant sans forcer.',
  "Expire plus longuement que l'inspiration.",
  'Accueille la sensation de relâchement qui suit.',
];

const B2CNyveeCoconPage: FC = () => {
  const { has } = useFlags();
  const zeroNumbersActive = has('FF_ZERO_NUMBERS');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const orchestration = useStai6Orchestration();
  const { unlockCocoon } = useCocoonStore();
  
  const [sessionPhase, setSessionPhase] = useState<'ready' | 'breathing' | 'complete' | 'badge'>('ready');
  const [badgeType, setBadgeType] = useState<'calm' | 'partial' | 'tense'>('calm');

  const intensity = useMemo(() => {
    const level = orchestration.sceneProfile;
    if (level === 'silent_anchor') return 'calm';
    if (level === 'soft_guided') return 'moderate';
    return 'intense';
  }, [orchestration.sceneProfile]);

  const activePrompts = useMemo(() => {
    if (orchestration.guidance === 'grounding_soft') {
      return groundingPrompts;
    }
    return breathingPrompts;
  }, [orchestration.guidance]);

  const handleBreathingComplete = () => {
    setSessionPhase('badge');

    // Déterminer le badge selon le niveau
    if (intensity === 'calm') {
      setBadgeType('calm');
      // 30% chance de débloquer un nouveau cocon
      if (Math.random() < 0.3) {
        const rareCocoons = ['cosmos', 'water', 'foliage', 'aurora', 'ember'];
        const randomCocoon = rareCocoons[Math.floor(Math.random() * rareCocoons.length)];
        unlockCocoon(randomCocoon);
      }
    } else if (intensity === 'moderate') {
      setBadgeType('partial');
    } else {
      setBadgeType('tense');
    }
  };

  // Effect pour gérer le timeout avec cleanup
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (sessionPhase === 'badge') {
      timeout = setTimeout(() => setSessionPhase('complete'), 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [sessionPhase]);

  const handleStartSession = () => {
    setSessionPhase('breathing');
  };

  const handleRestart = () => {
    setSessionPhase('ready');
    setBadgeType('calm');
  };

  return (
    <ConsentGate>
      <ZeroNumberBoundary
        enabled={zeroNumbersActive}
        className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950"
        data-testid="page-root"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-50">Nyvée</h1>
            <p className="mt-2 text-lg text-indigo-200/80">Ta bulle respirante</p>
          </div>

          <PreCheck
            visible={orchestration.preDue}
            summaryLabel={orchestration.summaryLabel}
            onStart={orchestration.startPre}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Main breathing experience */}
          {sessionPhase === 'ready' && (
            <Card className="border-indigo-400/30 bg-indigo-950/60 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-indigo-50">Prêt à respirer ensemble ?</CardTitle>
                <CardDescription className="text-base text-indigo-200/80">
                  Une bulle qui se synchronise avec toi pour 2 minutes d'apaisement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <BreathingBubble
                  isActive={false}
                  intensity={intensity}
                  className="my-8"
                />
                <div className="flex justify-center">
                  <Button
                    onClick={handleStartSession}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                  >
                    Commencer la respiration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {sessionPhase === 'breathing' && (
            <div className="space-y-6">
              <BreathingBubble
                isActive={true}
                intensity={intensity}
                onCycleComplete={handleBreathingComplete}
                className="my-8"
              />
              
              <Card className="border-indigo-400/20 bg-indigo-950/40 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p className="text-center text-sm font-medium text-indigo-50">Rituel de souffle</p>
                    <ul className="space-y-2 text-sm text-indigo-100/90">
                      {activePrompts.map((prompt) => (
                        <li key={prompt} className="leading-relaxed">
                          • {prompt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {sessionPhase === 'badge' && (
            <BadgeReveal
              badge={badgeType}
              message={
                badgeType === 'calm'
                  ? 'Ton corps retrouve sa sérénité. Continue ce chemin doux.'
                  : badgeType === 'partial'
                  ? "Tu as fait un pas vers l'apaisement. Et si on essayait autre chose ?"
                  : 'La tension est encore là. Essayons ensemble une autre approche.'
              }
            />
          )}

          {sessionPhase === 'complete' && (
            <div className="space-y-6">
              <Card className="border-emerald-400/30 bg-emerald-950/60 backdrop-blur-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-emerald-50">
                    {badgeType === 'calm' && 'Veux-tu rester dans le silence ?'}
                    {badgeType === 'partial' && 'Et si tu essayais la carte 5-4-3-2-1 ?'}
                    {badgeType === 'tense' && "Peut-être qu'un ancrage sensoriel t'aiderait ?"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    onClick={handleRestart}
                    variant="secondary"
                  >
                    Refaire une session
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/app/grounding'}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500"
                  >
                    {badgeType === 'calm' ? 'Silence & Ancrage' : 'Carte 5-4-3-2-1'}
                  </Button>
                </CardContent>
              </Card>

              {/* Cocoon gallery */}
              <CocoonGallery />
            </div>
          )}

          <PostCheck
            visible={orchestration.postDue}
            summaryLabel={orchestration.summaryLabel}
            onStart={orchestration.startPost}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      </ZeroNumberBoundary>
    </ConsentGate>
  );
};

export default B2CNyveeCoconPage;
