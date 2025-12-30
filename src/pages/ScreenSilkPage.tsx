/**
 * Screen Silk Page - Micro-pauses visuelles
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Play, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScreenSilkMicroBreak } from '@/hooks/useScreenSilkMicroBreak';
import {
  PatternSelector,
  ThemeSelector,
  SessionVisualizer,
  CompletionDialog,
  StatsPanel,
  HistoryPanel
} from '@/components/screen-silk';

export default function ScreenSilkPage() {
  const {
    patterns,
    themes,
    selectedPattern,
    selectedTheme,
    isSessionActive,
    isPaused,
    timeRemaining,
    blinkCount,
    stats,
    sessionHistory,
    selectPattern,
    selectTheme,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    interruptSession
  } = useScreenSilkMicroBreak();

  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('session');

  // Gérer la fin naturelle de la session
  const handleSessionEnd = () => {
    if (timeRemaining === 0 && isSessionActive) {
      setShowCompletionDialog(true);
    }
  };

  // Check si session terminée naturellement
  if (timeRemaining === 0 && isSessionActive && !showCompletionDialog) {
    handleSessionEnd();
  }

  // Interruption manuelle
  const handleStop = () => {
    if (timeRemaining > 0) {
      // Session interrompue avant la fin
      interruptSession();
    } else {
      // Session terminée naturellement
      setShowCompletionDialog(true);
    }
  };

  const handleComplete = (label: 'gain' | 'léger' | 'incertain') => {
    completeSession(label);
    setShowCompletionDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <a href="/">
                  <ArrowLeft className="w-5 h-5" />
                </a>
              </Button>
              <div className="flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold">Screen Silk</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Micro-pauses visuelles</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {isSessionActive ? (
            /* Session active view */
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <SessionVisualizer
                pattern={selectedPattern!}
                theme={selectedTheme}
                timeRemaining={timeRemaining}
                blinkCount={blinkCount}
                isPaused={isPaused}
                onPause={pauseSession}
                onResume={resumeSession}
                onStop={handleStop}
              />
            </motion.div>
          ) : (
            /* Configuration view */
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                  <TabsTrigger value="session">Session</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="session" className="space-y-6 mt-6">
                  {/* Pattern selection */}
                  <PatternSelector
                    patterns={patterns}
                    selectedPattern={selectedPattern}
                    onSelect={selectPattern}
                  />

                  {/* Theme selection */}
                  <ThemeSelector
                    themes={themes}
                    selectedTheme={selectedTheme}
                    onSelect={selectTheme}
                  />

                  {/* Start button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      size="lg"
                      onClick={startSession}
                      disabled={!selectedPattern}
                      className="gap-2 px-8"
                    >
                      <Play className="w-5 h-5" />
                      Démarrer la pause
                    </Button>
                  </div>

                  {/* Quick info */}
                  {selectedPattern && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      <p>
                        {selectedPattern.name} • {Math.floor(selectedPattern.duration / 60)} minutes •{' '}
                        Thème {selectedTheme.name}
                      </p>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="mt-6">
                  <StatsPanel stats={stats} />
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <HistoryPanel sessions={sessionHistory} />
                </TabsContent>
              </Tabs>

              {/* Benefits section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                {[
                  {
                    icon: '👁️',
                    title: 'Repos oculaire',
                    description: 'Réduisez la fatigue visuelle liée aux écrans'
                  },
                  {
                    icon: '🧘',
                    title: 'Relaxation',
                    description: 'Profitez d\'un moment de calme dans votre journée'
                  },
                  {
                    icon: '⚡',
                    title: 'Productivité',
                    description: 'Améliorez votre concentration après la pause'
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 text-center"
                  >
                    <div className="text-3xl mb-2">{benefit.icon}</div>
                    <h3 className="font-medium mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Completion dialog */}
      <CompletionDialog
        open={showCompletionDialog}
        duration={selectedPattern?.duration || 0}
        blinkCount={blinkCount}
        onComplete={handleComplete}
        onCancel={() => {
          setShowCompletionDialog(false);
          interruptSession();
        }}
      />
    </div>
  );
}
