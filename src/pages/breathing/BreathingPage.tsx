/**
 * BreathingPage - Page principale du module de respiration
 * /dashboard/breathing
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wind, History, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProtocolSelector } from '@/components/breathing/ProtocolSelector';
import { BreathingSessionView } from '@/components/breathing/BreathingSessionView';
import { BreathingFeedback } from '@/components/breathing/BreathingFeedback';
import { BreathingHistory } from '@/components/breathing/BreathingHistory';
import { BreathingProtocol } from '@/components/breathing/BreathingProtocols';
import { useBreathingHistory } from '@/hooks/useBreathingHistory';
import { usePageSEO } from '@/hooks/usePageSEO';

type ViewState = 'select' | 'session' | 'feedback' | 'history';

const BreathingPage: React.FC = () => {
  usePageSEO({
    title: 'Respiration Guidée - EmotionsCare',
    description: 'Exercices de respiration guidée : cohérence cardiaque, 4-7-8, box breathing et plus.',
    keywords: 'respiration, cohérence cardiaque, relaxation, méditation, stress',
  });

  const [currentView, setCurrentView] = useState<ViewState>('select');
  const [selectedProtocol, setSelectedProtocol] = useState<BreathingProtocol | null>(null);
  const [completedDuration, setCompletedDuration] = useState(0);
  const { saveSession, isSaving } = useBreathingHistory();

  const handleProtocolSelect = (protocol: BreathingProtocol) => {
    setSelectedProtocol(protocol);
  };

  const handleStartSession = () => {
    if (selectedProtocol) {
      setCurrentView('session');
    }
  };

  const handleSessionComplete = (durationSeconds: number) => {
    setCompletedDuration(durationSeconds);
    setCurrentView('feedback');
  };

  const handleSessionCancel = () => {
    setCurrentView('select');
    setSelectedProtocol(null);
  };

  const handleFeedbackSubmit = async (feedback: 'better' | 'same' | 'worse') => {
    if (!selectedProtocol) return;
    
    await saveSession({
      protocol: selectedProtocol.id,
      duration_seconds: completedDuration,
      feedback,
      completed: true,
    });
    
    setCurrentView('select');
    setSelectedProtocol(null);
  };

  const handleFeedbackSkip = async () => {
    if (!selectedProtocol) return;
    
    await saveSession({
      protocol: selectedProtocol.id,
      duration_seconds: completedDuration,
      completed: true,
    });
    
    setCurrentView('select');
    setSelectedProtocol(null);
  };

  // Vue session active (plein écran)
  if (currentView === 'session' && selectedProtocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <BreathingSessionView
            protocol={selectedProtocol}
            onComplete={handleSessionComplete}
            onCancel={handleSessionCancel}
          />
        </div>
      </div>
    );
  }

  // Vue feedback
  if (currentView === 'feedback' && selectedProtocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BreathingFeedback
          protocol={selectedProtocol}
          durationSeconds={completedDuration}
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackSkip}
          isSubmitting={isSaving}
        />
      </div>
    );
  }

  // Vue principale (sélection + historique)
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Wind className="h-6 w-6 text-primary" />
                Respiration Guidée
              </h1>
              <p className="text-muted-foreground mt-1">
                Choisis ton protocole et laisse-toi guider
              </p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="protocols" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="protocols" className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              Protocoles
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="protocols" className="space-y-6">
            {/* Sélection du protocole */}
            <ProtocolSelector
              selectedProtocol={selectedProtocol}
              onSelect={handleProtocolSelect}
            />

            {/* Bouton démarrer */}
            <AnimatePresence>
              {selectedProtocol && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex justify-center"
                >
                  <Button
                    size="lg"
                    onClick={handleStartSession}
                    className="gap-2 px-8"
                  >
                    <Play className="h-5 w-5" />
                    Commencer {selectedProtocol.name}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="history">
            <BreathingHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BreathingPage;
