/**
 * B2C FLASH GLOW PAGE - EMOTIONSCARE
 * Page de respiration gamifiée accessible WCAG 2.1 AA
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, Clock, Share2, Settings, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import EnhancedFlashGlow from '@/components/modules/EnhancedFlashGlow';
import { useAuth } from '@/hooks/useAuth';
import { useFlashGlowStats } from '@/hooks/useFlashGlowStats';
import { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { SessionFeedback, type FeedbackData } from '@/components/feedback/SessionFeedback';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

type SessionDuration = 2 | 5 | 10;

export default function B2CFlashGlowPage() {
  const { user } = useAuth();
  const { stats, isLoading, saveSession } = useFlashGlowStats();
  const { weeklyTop: leaderboardEntries, isLoading: leaderboardLoading } = useRealtimeLeaderboard();
  const { recordActivity } = useStreakTracker();
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(2);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastSession, setLastSession] = useState<{ duration: number; score: number; pattern: string } | null>(null);

  useEffect(() => {
    document.title = "Flash Glow - Respiration Gamifiée | EmotionsCare";
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Flash Glow - EmotionsCare',
          text: `J'ai atteint le niveau ${stats.level} avec ${stats.totalScore} points sur Flash Glow ! 🌟`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    }
  };

  const handleDurationSelect = (duration: SessionDuration) => {
    setSelectedDuration(duration);
  };

  const handleSessionComplete = useCallback(async (duration: number, score: number, pattern: string) => {
    await saveSession({
      duration_seconds: duration,
      score,
      pattern,
      completed: true
    });
    
    // Record activity for streak
    await recordActivity();
    
    // Store session data and show feedback
    setLastSession({ duration, score, pattern });
    setShowFeedback(true);
    
    // Show success toast
    toast({
      title: '🌟 Session terminée !',
      description: `+${score} points • Durée: ${Math.floor(duration / 60)}m ${duration % 60}s`,
    });
  }, [saveSession, recordActivity]);

  const handleFeedbackSubmit = useCallback(async (feedback: FeedbackData) => {
    logger.debug('Feedback submitted', feedback, 'FLASH_GLOW');
    setShowFeedback(false);
    setLastSession(null);
  }, []);

  const handleFeedbackSkip = useCallback(() => {
    setShowFeedback(false);
    setLastSession(null);
  }, []);

  const getLevelTitle = (level: number): string => {
    const titles = [
      'Débutant Lumineux',       // Level 1
      'Étoile Montante',         // Level 2
      'Maître de l\'Éclat',      // Level 3
      'Champion Radiant',        // Level 4
      'Légende Lumineuse',       // Level 5
      'Gardien de l\'Aura',      // Level 6
      'Sage Lumineux',           // Level 7+
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || titles[titles.length - 1];
  };

  const durationOptions = [
    { value: 2 as SessionDuration, label: '2 minutes', sublabel: 'Session rapide', color: 'primary' },
    { value: 5 as SessionDuration, label: '5 minutes', sublabel: 'Session standard', color: 'secondary' },
    { value: 10 as SessionDuration, label: '10 minutes', sublabel: 'Session intensive', color: 'accent' },
  ];

  return (
    <ConsentGate>
      <>
        {/* Skip Links pour l'accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
          tabIndex={0}
        >
          Aller au contenu principal
        </a>

        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background" data-testid="page-root">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <Link to="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Retour au tableau de bord"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                      Retour
                    </Button>
                  </Link>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-semibold text-foreground">
                        Flash Glow
                      </h1>
                      <Badge variant="secondary" className="hidden sm:inline-flex">
                        ✨ Pro
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                      Respiration gamifiée en 2 minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full">
                            <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                            <span className="font-bold text-sm">{stats.totalScore}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Score total accumulé</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    aria-label="Partager votre progression"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <Link to="/dashboard/settings">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Paramètres"
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* User Level Card */}
              {user && !isLoading && (
                <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {stats.level}
                        </div>
                        {stats.currentStreak > 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                            <Flame className="h-3 w-3 text-white" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {getLevelTitle(stats.level)}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Niveau {stats.level} • {stats.totalSessions} sessions
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                              style={{ width: `${stats.levelProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(stats.levelProgress)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xl font-bold text-destructive">
                          <Flame className="h-5 w-5" aria-hidden="true" />
                          {stats.currentStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">Streak actuel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-warning">{stats.bestStreak}</div>
                        <div className="text-xs text-muted-foreground">Meilleur streak</div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Guest Welcome Card */}
              {!user && (
                <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        🎮 Bienvenue sur Flash Glow !
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Créez un compte pour sauvegarder vos scores, débloquer des achievements
                        et rivaliser avec la communauté.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/login">
                        <Button variant="outline" size="sm">
                          Connexion
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button size="sm">
                          Créer un compte
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Session Option - Now Functional */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {durationOptions.map((option) => (
                  <Card 
                    key={option.value}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedDuration === option.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleDurationSelect(option.value)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDurationSelect(option.value)}
                    aria-pressed={selectedDuration === option.value}
                    aria-label={`Sélectionner ${option.label}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-${option.color}/10 flex items-center justify-center relative`}>
                        <Clock className={`h-5 w-5 text-${option.color}`} aria-hidden="true" />
                        {selectedDuration === option.value && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.sublabel}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Session Feedback Modal */}
              <AnimatePresence>
                {showFeedback && lastSession && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  >
                    <SessionFeedback
                      moduleName="Flash Glow"
                      sessionDuration={lastSession.duration}
                      score={lastSession.score}
                      xpEarned={Math.round(lastSession.score * 1.2)}
                      onSubmit={handleFeedbackSubmit}
                      onSkip={handleFeedbackSkip}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Flash Glow Component */}
              <EnhancedFlashGlow 
                selectedDuration={selectedDuration} 
                onSessionComplete={handleSessionComplete}
              />

              {/* Leaderboard Preview */}
              {user && (
                <section aria-labelledby="leaderboard-title" className="mt-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="leaderboard-title" className="text-xl font-semibold">
                      🏆 Classement de la semaine
                    </h2>
                    <Link to="/leaderboard">
                      <Button variant="ghost" size="sm">
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                  <Card className="overflow-hidden">
                    <div className="divide-y">
                      {leaderboardLoading ? (
                        <div className="p-8 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                        </div>
                      ) : leaderboardEntries.length > 0 ? (
                        leaderboardEntries.slice(0, 5).map((entry, index) => {
                          const isCurrentUser = entry.user_id === user?.id;
                          const avatar = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '✨';
                          return (
                            <div
                              key={entry.user_id}
                              className={`flex items-center justify-between p-4 ${
                                isCurrentUser ? 'bg-primary/5' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{avatar}</span>
                                <div>
                                  <div className={`font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                                    {isCurrentUser ? 'Vous' : (entry.display_name || `Joueur ${index + 1}`)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    #{index + 1} cette semaine
                                  </div>
                                </div>
                              </div>
                              <div className="font-bold text-lg">
                                {entry.weekly_score.toLocaleString()}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        // Fallback to mock data if no real entries
                        [
                          { rank: 1, name: 'Emma L.', score: 2450, avatar: '👑' },
                          { rank: 2, name: 'Thomas B.', score: 2180, avatar: '🥈' },
                          { rank: 3, name: 'Marie K.', score: 1920, avatar: '🥉' },
                          { rank: 4, name: 'Vous', score: stats.totalScore, avatar: '✨', isUser: true },
                        ].map((player) => (
                          <div
                            key={player.rank}
                            className={`flex items-center justify-between p-4 ${
                              player.isUser ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{player.avatar}</span>
                              <div>
                                <div className={`font-medium ${player.isUser ? 'text-primary' : ''}`}>
                                  {player.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  #{player.rank} cette semaine
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-lg">
                              {player.score.toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </section>
              )}

              {/* Related Modules */}
              <section aria-labelledby="related-title" className="mt-12">
                <h2 id="related-title" className="text-xl font-semibold mb-4">
                  Continuez votre pratique
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to="/app/breath">
                    <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium mb-1">🧘 Breathwork Avancé</h3>
                      <p className="text-sm text-muted-foreground">
                        Techniques approfondies pour les pratiquants réguliers
                      </p>
                    </Card>
                  </Link>
                  <Link to="/app/vr">
                    <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium mb-1">🌌 VR Galaxy</h3>
                      <p className="text-sm text-muted-foreground">
                        Expérience immersive de respiration en VR
                      </p>
                    </Card>
                  </Link>
                  <Link to="/app/scan">
                    <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium mb-1">🎯 Scan Émotionnel</h3>
                      <p className="text-sm text-muted-foreground">
                        Analysez votre état émotionnel après la session
                      </p>
                    </Card>
                  </Link>
                </div>
              </section>
            </motion.div>
          </main>

        </div>
      </>
    </ConsentGate>
  );
}
