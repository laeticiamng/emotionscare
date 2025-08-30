import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

interface GritChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'novice' | 'warrior' | 'master' | 'legend';
  duration: number; // en minutes
  category: 'mental' | 'physical' | 'emotional' | 'spiritual';
  status: 'available' | 'in_progress' | 'completed';
}

const B2CBossLevelGritPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate, getDuration } = useMotionPrefs();
  const [selectedChallenge, setSelectedChallenge] = useState<GritChallenge | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [auraGlow, setAuraGlow] = useState(0);

  const dailyChallenges: GritChallenge[] = [
    {
      id: '1',
      title: 'Minute de gratitude',
      description: 'Noter 3 choses simples qui ont aidé aujourd\'hui',
      difficulty: 'novice',
      duration: 3,
      category: 'mental',
      status: 'available'
    },
    {
      id: '2', 
      title: 'Ancrage épaules',
      description: 'Relâcher les tensions, 5 respirations profondes',
      difficulty: 'warrior',
      duration: 4,
      category: 'physical',
      status: 'available'
    }
  ];

  const [challenges] = useState<GritChallenge[]>(dailyChallenges);

  const startChallenge = (challenge: GritChallenge) => {
    setSelectedChallenge(challenge);
    setSessionActive(true);
    setSessionTime(0);
  };

  const completeChallenge = () => {
    if (selectedChallenge) {
      setSessionActive(false);
      setAuraGlow(prev => Math.min(prev + 20, 100));
      // Micro-son de réussite (simulé)
      if (shouldAnimate) {
        // Animation de confetti coton
        const duration = getDuration(800);
        if (duration > 0) {
          setTimeout(() => setAuraGlow(prev => prev * 0.8), duration);
        }
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionActive && selectedChallenge) {
      timer = setInterval(() => {
        setSessionTime(prev => {
          if (prev >= selectedChallenge.duration * 60) {
            setSessionActive(false);
            completeChallenge();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionActive, selectedChallenge]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'text-green-300';
      case 'warrior': return 'text-blue-300';
      case 'master': return 'text-purple-300';
      case 'legend': return 'text-amber-300';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Boss Level Grit</h1>
          <p className="text-sm text-muted-foreground">Un petit boss par jour, même fatigué·e</p>
        </div>
      </div>

      {!sessionActive ? (
        <>
          {/* Aura du joueur */}
          <Card className="p-6 mb-6 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-4">
              <div 
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
                style={{ 
                  boxShadow: `0 0 ${auraGlow}px hsl(var(--primary) / 0.3)`,
                  filter: `brightness(${1 + auraGlow / 200})`
                }}
              >
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Votre constance</h3>
                <p className="text-sm text-muted-foreground">Éclat doux, sans pression</p>
                {auraGlow > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary">Aura brillante</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Défis du jour */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-medium text-foreground">Défis du jour</h2>
            {challenges.map((challenge) => (
              <Card 
                key={challenge.id}
                className="p-4 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all cursor-pointer group"
                onClick={() => startChallenge(challenge)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h3>
                      <span className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{challenge.duration} min</span>
                      <span className="capitalize">{challenge.category}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    Commencer
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Message d'encouragement */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              ✨ Rater ≠ reset. Votre streak de compassion continue.
            </p>
          </Card>
        </>
      ) : (
        /* Session active */
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 text-center max-w-md">
            <div className="mb-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {selectedChallenge?.title}
              </h2>
              <p className="text-muted-foreground">
                {selectedChallenge?.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-light text-primary mb-2">
                {formatTime(sessionTime)}
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary/60 to-primary h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: selectedChallenge ? `${Math.min((sessionTime / (selectedChallenge.duration * 60)) * 100, 100)}%` : '0%'
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={completeChallenge} className="w-full">
                Boss battu ✨
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSessionActive(false);
                  setSelectedChallenge(null);
                }}
                className="w-full"
              >
                Pause bienveillante
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default B2CBossLevelGritPage;