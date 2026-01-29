import type { FC } from 'react';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import ZeroNumberBoundary from '@/components/common/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import useStai6Orchestration from '@/features/orchestration/useStai6Orchestration';
import { BreathingBubble } from '@/features/nyvee/components/BreathingBubble';
import { BadgeReveal } from '@/features/nyvee/components/BadgeReveal';
import { CocoonGallery } from '@/features/nyvee/components/CocoonGallery';
import { PostCheck } from '@/features/nyvee/components/PostCheck';
import { PreCheck } from '@/features/nyvee/components/PreCheck';
import { IntensitySelector } from '@/features/nyvee/components/IntensitySelector';
import { MoodSlider } from '@/features/nyvee/components/MoodSlider';
import { NyveeStatsWidget } from '@/features/nyvee/components/NyveeStatsWidget';
import { NyveeSessionHistory } from '@/features/nyvee/components/NyveeSessionHistory';
import { NyveeStreakWidget } from '@/features/nyvee/components/NyveeStreakWidget';
import { NyveeExportButton } from '@/features/nyvee/components/NyveeExportButton';
import { AmbientSound } from '@/features/nyvee/components/AmbientSound';
import { ShareSessionButton } from '@/features/nyvee/components/ShareSessionButton';
import { DurationSelector } from '@/features/nyvee/components/DurationSelector';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCocoonStore } from '@/features/nyvee/stores/cocoonStore';
import { useNyveeSessions } from '@/modules/nyvee/hooks/useNyveeSessions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BreathingIntensity, BadgeType } from '@/modules/nyvee/types';

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

type SessionPhase = 'ready' | 'mood-before' | 'breathing' | 'mood-after' | 'complete' | 'badge';

const B2CNyveeCoconPage: FC = () => {
  const { has } = useFlags();
  const zeroNumbersActive = has('FF_ZERO_NUMBERS');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const orchestration = useStai6Orchestration();
  const { unlockCocoon } = useCocoonStore();
  const { createSession, completeSession } = useNyveeSessions();
  
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('ready');
  const [intensity, setIntensity] = useState<BreathingIntensity>('calm');
  const [targetCycles, setTargetCycles] = useState(6);
  const [badgeType, setBadgeType] = useState<BadgeType>('calm');
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const sessionStartRef = useRef<number>(0);
  const [activeTab, setActiveTab] = useState('session');

  const activePrompts = useMemo(() => {
    if (orchestration.guidance === 'grounding_soft') {
      return groundingPrompts;
    }
    return breathingPrompts;
  }, [orchestration.guidance]);

  const handleStartSession = useCallback(() => {
    setSessionPhase('mood-before');
  }, []);

  const handleMoodBeforeSubmit = useCallback(async (value: number) => {
    setMoodBefore(value);
    sessionStartRef.current = Date.now();
    
    try {
      const result = await createSession.mutateAsync({
        intensity,
        moodBefore: value,
        targetCycles: 6,
      });
      setCurrentSessionId(result.id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    
    setSessionPhase('breathing');
  }, [intensity, createSession]);

  const handleMoodBeforeSkip = useCallback(async () => {
    sessionStartRef.current = Date.now();
    
    try {
      const result = await createSession.mutateAsync({
        intensity,
        targetCycles: 6,
      });
      setCurrentSessionId(result.id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    
    setSessionPhase('breathing');
  }, [intensity, createSession]);

  const handleBreathingComplete = useCallback(() => {
    setSessionPhase('mood-after');
  }, []);

  const handleMoodAfterSubmit = useCallback(async (value: number) => {
    setMoodAfter(value);
    
    // Déterminer le badge selon l'intensité et l'humeur
    const moodDelta = moodBefore !== null ? value - moodBefore : 0;
    let earnedBadge: BadgeType = 'calm';
    
    if (moodDelta >= 10 || value >= 70) {
      earnedBadge = 'calm';
      // 30% chance de débloquer un nouveau cocon
      if (Math.random() < 0.3) {
        const rareCocoons = ['cosmos', 'water', 'foliage', 'aurora', 'ember'];
        const randomCocoon = rareCocoons[Math.floor(Math.random() * rareCocoons.length)];
        unlockCocoon(randomCocoon);
      }
    } else if (moodDelta >= 0 || value >= 50) {
      earnedBadge = 'partial';
    } else {
      earnedBadge = 'tense';
    }
    
    setBadgeType(earnedBadge);

    // Compléter la session
    if (currentSessionId) {
      const durationSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      try {
        await completeSession.mutateAsync({
          sessionId: currentSessionId,
          cyclesCompleted: 6,
          moodAfter: value,
          badgeEarned: earnedBadge,
          durationSeconds,
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    }

    setSessionPhase('badge');
  }, [moodBefore, unlockCocoon, currentSessionId, completeSession]);

  const handleMoodAfterSkip = useCallback(async () => {
    setBadgeType('partial');
    
    if (currentSessionId) {
      const durationSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      try {
        await completeSession.mutateAsync({
          sessionId: currentSessionId,
          cyclesCompleted: 6,
          badgeEarned: 'partial',
          durationSeconds,
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    }

    setSessionPhase('badge');
  }, [currentSessionId, completeSession]);

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

  const handleRestart = useCallback(() => {
    setSessionPhase('ready');
    setBadgeType('calm');
    setMoodBefore(null);
    setMoodAfter(null);
    setCurrentSessionId(null);
  }, []);

  return (
    <ConsentGate>
      <ZeroNumberBoundary
        enabled={zeroNumbersActive}
        className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background"
        data-testid="page-root"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Nyvée</h1>
            <p className="mt-2 text-lg text-muted-foreground">Ta bulle respirante</p>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            {/* Session Tab */}
            <TabsContent value="session" className="space-y-6 mt-6">
              <PreCheck
                visible={orchestration.preDue}
                summaryLabel={orchestration.summaryLabel}
                onStart={orchestration.startPre}
                prefersReducedMotion={prefersReducedMotion}
              />

              {/* État initial - Sélection intensité */}
              {sessionPhase === 'ready' && (
                <Card className="border-primary/20 bg-card/60 backdrop-blur-xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">Prêt à respirer ensemble ?</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      Choisis ton intensité pour cette session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <IntensitySelector
                      value={intensity}
                      onChange={setIntensity}
                      className="mb-4"
                    />
                    
                    <DurationSelector
                      value={targetCycles}
                      onChange={setTargetCycles}
                      className="mb-6"
                    />
                    
                    <BreathingBubble
                      isActive={false}
                      targetCycles={targetCycles}
                      intensity={intensity}
                      className="my-6"
                    />
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={handleStartSession}
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Commencer la respiration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Évaluation humeur avant */}
              {sessionPhase === 'mood-before' && (
                <MoodSlider
                  title="Comment te sens-tu maintenant ?"
                  description="Évalue ton niveau de tension avant la session"
                  onSubmit={handleMoodBeforeSubmit}
                  onSkip={handleMoodBeforeSkip}
                />
              )}

              {/* Session de respiration */}
              {sessionPhase === 'breathing' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <AmbientSound isPlaying={true} />
                  </div>
                  
                  <BreathingBubble
                    isActive={true}
                    intensity={intensity}
                    targetCycles={targetCycles}
                    onCycleComplete={() => {
                      setCyclesCompleted(targetCycles);
                      handleBreathingComplete();
                    }}
                    className="my-8"
                  />
                  
                  <Card className="border-primary/20 bg-card/40 backdrop-blur-xl">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <p className="text-center text-sm font-medium text-foreground">Rituel de souffle</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
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

              {/* Évaluation humeur après */}
              {sessionPhase === 'mood-after' && (
                <MoodSlider
                  title="Comment te sens-tu après ?"
                  description="Évalue ton niveau de tension après la session"
                  onSubmit={handleMoodAfterSubmit}
                  onSkip={handleMoodAfterSkip}
                />
              )}

              {/* Badge reveal */}
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

              {/* Session terminée */}
              {sessionPhase === 'complete' && (
                <div className="space-y-6">
                  <Card className="border-accent/30 bg-accent/10 backdrop-blur-xl">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl text-foreground">
                        {badgeType === 'calm' && 'Veux-tu rester dans le silence ?'}
                        {badgeType === 'partial' && 'Et si tu essayais la carte 5-4-3-2-1 ?'}
                        {badgeType === 'tense' && "Peut-être qu'un ancrage sensoriel t'aiderait ?"}
                      </CardTitle>
                      {moodBefore !== null && moodAfter !== null && (
                        <CardDescription className="text-muted-foreground">
                          Évolution : {moodBefore}% → {moodAfter}% ({moodAfter - moodBefore >= 0 ? '+' : ''}{moodAfter - moodBefore}%)
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <ShareSessionButton
                        badge={badgeType}
                        moodDelta={moodBefore !== null && moodAfter !== null ? moodAfter - moodBefore : null}
                        cyclesCompleted={cyclesCompleted}
                      />
                      <Button
                        onClick={handleRestart}
                        variant="secondary"
                      >
                        Refaire une session
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/app/meditation'}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
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
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6 mt-6">
              <div className="flex justify-end">
                <NyveeExportButton />
              </div>
              <NyveeStreakWidget weeklyGoal={5} />
              <NyveeStatsWidget />
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6 mt-6">
              <div className="flex justify-end">
                <NyveeExportButton />
              </div>
              <NyveeSessionHistory limit={20} />
            </TabsContent>
          </Tabs>
        </div>
      </ZeroNumberBoundary>
    </ConsentGate>
  );
};

export default B2CNyveeCoconPage;
