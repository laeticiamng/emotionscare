/**
 * B2C Bounce Back Battle Page - Module de résilience gamifié
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart2, ArrowLeft, History, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useBounceBattle } from '@/hooks/useBounceBattle';
import {
  BattleArena,
  CopingDebrief,
  PairingModal,
  StatsPanel,
  ModeSelector,
  CompletionScreen
} from '@/components/bounce-back';

type ViewMode = 'battle' | 'stats';

const B2CBounceBackBattlePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('battle');
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const {
    state,
    isLoading,
    start,
    pause,
    resume,
    useCalmBoost,
    end,
    submitDebrief,
    sendPairTip,
    processStimulus,
    reset
  } = useBounceBattle();

  const { phase, coachMessage, pairToken, tipReceived, duration, processedStimuli } = state;

  // Show pairing modal when pair token is available
  useEffect(() => {
    if (phase === 'pairing' && pairToken) {
      setShowPairingModal(true);
    }
  }, [phase, pairToken]);

  // Load stats when viewing stats tab
  useEffect(() => {
    if (viewMode === 'stats') {
      loadStats();
    }
  }, [viewMode]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bounce-back-battle', {
        body: { action: 'stats' }
      });
      
      if (error) throw error;
      
      if (data?.success && data?.stats) {
        setStats(data.stats);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Failed to load stats', error);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSelectMode = (mode: string) => {
    start(mode as any);
  };

  const handleDebriefSubmit = (answers: Array<{ id: string; value: 0 | 1 | 2 | 3 }>) => {
    submitDebrief(answers);
  };

  const handlePairTipSend = (tip: string) => {
    sendPairTip(tip);
    setShowPairingModal(false);
  };

  const handlePairSkip = () => {
    setShowPairingModal(false);
    state.setPhase('completed');
  };

  const handleRestart = () => {
    reset();
  };

  const handleViewStats = () => {
    setViewMode('stats');
  };

  const handleBackToBattle = () => {
    setViewMode('battle');
    reset();
  };

  // Render based on phase
  const renderBattleContent = () => {
    switch (phase) {
      case 'idle':
      case 'starting':
        return (
          <ModeSelector
            onSelectMode={handleSelectMode}
            isLoading={isLoading}
          />
        );

      case 'battle':
      case 'paused':
      case 'calming':
        return (
          <BattleArena
            onPause={pause}
            onResume={resume}
            onUseCalmBoost={useCalmBoost}
            onProcessStimulus={processStimulus}
            onEndBattle={end}
          />
        );

      case 'debrief':
        return (
          <CopingDebrief
            onSubmit={handleDebriefSubmit}
            isLoading={isLoading}
          />
        );

      case 'pairing':
      case 'completed':
        return (
          <CompletionScreen
            coachMessage={coachMessage}
            duration={duration}
            eventCount={processedStimuli.length}
            onRestart={handleRestart}
            onViewStats={handleViewStats}
            tipReceived={tipReceived}
          />
        );

      default:
        return (
          <ModeSelector
            onSelectMode={handleSelectMode}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-destructive to-warning rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bounce-Back Battle
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Affrontez des vagues de stimuli stressants et développez votre résilience émotionnelle
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="battle" className="gap-2">
              <Shield className="w-4 h-4" />
              Bataille
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart2 className="w-4 h-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="battle" className="mt-6">
            {renderBattleContent()}
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackToBattle}
                className="mb-4 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la bataille
              </Button>
              <StatsPanel stats={stats} isLoading={statsLoading} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Pairing Modal */}
        <PairingModal
          open={showPairingModal}
          onOpenChange={setShowPairingModal}
          pairToken={pairToken || ''}
          onSendTip={handlePairTipSend}
          onSkip={handlePairSkip}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default B2CBounceBackBattlePage;
