// @ts-nocheck
/**
 * QuestionnaireScannerPage - Page du scanner émotionnel V1
 * Questionnaire en 12 étapes avec résultats et historique
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, History, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuestionnaireScanner, ScannerAnswers } from '@/components/scanner/QuestionnaireScanner';
import { ScannerResults } from '@/components/scanner/ScannerResults';
import { ScannerHistoryChart } from '@/components/scanner/ScannerHistoryChart';
import { useScannerHistory } from '@/hooks/useScannerHistory';
import { usePageSEO } from '@/hooks/usePageSEO';

type ViewState = 'scanner' | 'results' | 'history';

const QuestionnaireScannerPage: React.FC = () => {
  usePageSEO({
    title: 'Scanner Émotionnel - EmotionsCare',
    description: 'Évalue ton état émotionnel en 12 questions et reçois des recommandations personnalisées.',
    keywords: 'scanner émotionnel, questionnaire bien-être, évaluation stress',
  });

  const [currentView, setCurrentView] = useState<ViewState>('scanner');
  const [lastAnswers, setLastAnswers] = useState<ScannerAnswers | null>(null);
  const { history, chartData, isLoading, saveScan, isSaving } = useScannerHistory();

  const handleScanComplete = async (answers: ScannerAnswers) => {
    setLastAnswers(answers);
    await saveScan(answers);
    setCurrentView('results');
  };

  const handleNewScan = () => {
    setLastAnswers(null);
    setCurrentView('scanner');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
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
                <Brain className="h-6 w-6 text-primary" />
                Scanner Émotionnel
              </h1>
              <p className="text-muted-foreground mt-1">
                Évalue ton état émotionnel en 12 questions
              </p>
            </div>
          </div>
        </header>

        {/* Navigation tabs */}
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as ViewState)} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentView === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <QuestionnaireScanner
                onComplete={handleScanComplete}
                isSubmitting={isSaving}
              />
              
              {/* Info box */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg flex gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Comment ça marche ?</p>
                  <p>
                    Réponds honnêtement aux 12 questions pour obtenir une analyse de ton état 
                    émotionnel et des recommandations personnalisées. Tes données sont 
                    confidentielles et sécurisées.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'results' && lastAnswers && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ScannerResults
                answers={lastAnswers}
                onNewScan={handleNewScan}
                onViewHistory={handleViewHistory}
              />
            </motion.div>
          )}

          {currentView === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Graphique d'évolution */}
              <ScannerHistoryChart data={chartData} isLoading={isLoading} />

              {/* Liste des scans récents */}
              <div className="space-y-3">
                <h3 className="font-semibold">Scans récents</h3>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chargement...
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun scan enregistré</p>
                    <Button onClick={handleNewScan} className="mt-4">
                      Faire mon premier scan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.slice(0, 10).map((scan) => {
                      const emotions = scan.emotions as { score?: number; dominant?: string } | null;
                      return (
                        <div
                          key={scan.id}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {getMoodEmoji(scan.mood || 'neutral')}
                            </span>
                            <div>
                              <p className="font-medium">
                                Score: {emotions?.score || scan.confidence || 0}/100
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(scan.created_at!).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bouton nouveau scan */}
              <div className="text-center pt-4">
                <Button onClick={handleNewScan}>
                  <Brain className="h-4 w-4 mr-2" />
                  Nouveau scan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const getMoodEmoji = (mood: string): string => {
  const emojis: Record<string, string> = {
    serene: '😌',
    stressed: '😰',
    sad: '😢',
    angry: '😠',
    anxious: '😟',
    joyful: '😊',
    tired: '😴',
    neutral: '😐',
  };
  return emojis[mood] || '😐';
};

export default QuestionnaireScannerPage;
