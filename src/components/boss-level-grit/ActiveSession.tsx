import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  Trophy, 
  Target,
  Brain, 
  Heart, 
  Dumbbell, 
  Sparkles,
  Clock,
  Zap
} from 'lucide-react';
import { GritChallenge } from '@/types/boss-level-grit';

interface ActiveSessionProps {
  challenge: GritChallenge | null;
  onComplete: (score: number, insights: string[]) => void;
  onBack: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ challenge, onComplete, onBack }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentScore, setCurrentScore] = useState(75);
  const [insights, setInsights] = useState('');
  const [phase, setPhase] = useState<'preparation' | 'active' | 'reflection'>('preparation');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive && phase === 'active') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, phase]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental': return <Brain className="h-5 w-5" />;
      case 'physical': return <Dumbbell className="h-5 w-5" />;
      case 'emotional': return <Heart className="h-5 w-5" />;
      case 'spiritual': return <Sparkles className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setPhase('active');
    setSessionActive(true);
    setSessionTime(0);
  };

  const pauseSession = () => {
    setSessionActive(false);
  };

  const resumeSession = () => {
    setSessionActive(true);
  };

  const finishSession = () => {
    setSessionActive(false);
    setPhase('reflection');
  };

  const completeSession = () => {
    const insightsList = insights.split('\n').filter(i => i.trim().length > 0);
    onComplete(currentScore, insightsList);
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'preparation': return 'Préparation du Défi';
      case 'active': return 'Session Active';
      case 'reflection': return 'Réflexion et Bilan';
      default: return 'Session';
    }
  };

  const getPhaseDescription = () => {
    if (!challenge) return '';
    
    switch (phase) {
      case 'preparation': 
        return `Préparez-vous mentalement pour ce défi ${challenge.category}. Prenez quelques instants pour vous concentrer et définir votre intention.`;
      case 'active': 
        return `Vous êtes maintenant dans le vif du défi. Concentrez-vous sur l'exécution et dépassez vos limites.`;
      case 'reflection': 
        return `Excellent travail ! Prenez un moment pour réfléchir à votre expérience et noter vos insights.`;
      default: 
        return '';
    }
  };

  if (!challenge) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune session active</h3>
        <p className="text-muted-foreground mb-4">
          Commencez un défi pour démarrer une session
        </p>
        <Button onClick={onBack}>
          Choisir un Défi
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(challenge.category)}
                <span>{challenge.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-mono">
                  {formatTime(sessionTime)}
                </div>
                {phase === 'active' && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {challenge.duration} min
                  </div>
                )}
              </div>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {getPhaseTitle()}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-lg font-medium">
                {getPhaseDescription()}
              </div>
            </div>

            {phase === 'preparation' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Objectif</div>
                    <div className="text-sm text-muted-foreground">
                      Développer votre résilience
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <div className="font-medium">Durée</div>
                    <div className="text-sm text-muted-foreground">
                      {challenge.duration} minutes
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <div className="font-medium">Récompense</div>
                    <div className="text-sm text-muted-foreground">
                      {challenge.xpReward} XP
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button onClick={startSession} size="lg" className="px-8">
                    <Play className="h-5 w-5 mr-2" />
                    Commencer le Défi
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === 'active' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className="text-lg">
                    {sessionActive ? '🔥 Session en cours' : '⏸️ Session en pause'}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={sessionActive ? pauseSession : resumeSession}
                      variant={sessionActive ? 'destructive' : 'default'}
                    >
                      {sessionActive ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Reprendre
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={finishSession}
                      variant="outline"
                      disabled={sessionTime < 60}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Terminer
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Progress 
                    value={Math.min(100, (sessionTime / (challenge.duration * 60)) * 100)} 
                    className="h-3"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    Progression: {Math.min(100, Math.round((sessionTime / (challenge.duration * 60)) * 100))}%
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Conseil du moment
                  </div>
                  <div className="font-medium">
                    "La résistance que vous ressentez maintenant forge votre force de demain"
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'reflection' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <div className="text-xl font-semibold">
                    Défi Complété !
                  </div>
                  <div className="text-muted-foreground">
                    Temps total: {formatTime(sessionTime)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Comment évaluez-vous votre performance ? (0-100)
                    </label>
                    <div className="mt-2 space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentScore}
                        onChange={(e) => setCurrentScore(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-lg font-semibold">
                        {currentScore}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">
                      Quels insights avez-vous retirés de ce défi ?
                    </label>
                    <Textarea
                      placeholder="Décrivez ce que vous avez appris, ressenti, ou découvert sur vous-même..."
                      value={insights}
                      onChange={(e) => setInsights(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Retour aux Défis
                  </Button>
                  <Button onClick={completeSession} className="flex-1">
                    <Trophy className="h-4 w-4 mr-2" />
                    Valider (+{challenge.xpReward} XP)
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActiveSession;