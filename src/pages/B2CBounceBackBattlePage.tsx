import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Shield, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

interface CounterSpell {
  id: string;
  name: string;
  action: string;
  duration: number;
  type: 'silk' | 'flash' | 'breath' | 'walk';
}

const B2CBounceBackBattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate, getDuration } = useMotionPrefs();
  
  const [phase, setPhase] = useState<'prep' | 'stress' | 'defusion' | 'action' | 'complete'>('prep');
  const [stressTimer, setStressTimer] = useState(0);
  const [selectedCounterSpell, setSelectedCounterSpell] = useState<CounterSpell | null>(null);
  const [tensionLevel, setTensionLevel] = useState(0);

  const counterSpells: CounterSpell[] = [
    { id: '1', name: 'Silk Break', action: 'Repos écran 2 min', duration: 120, type: 'silk' },
    { id: '2', name: 'Flash Glow', action: 'Éclat doux 90s', duration: 90, type: 'flash' },
    { id: '3', name: 'Marche active', action: '90s de mouvement', duration: 90, type: 'walk' },
    { id: '4', name: 'Souffle ancré', action: '5 respirations profondes', duration: 60, type: 'breath' }
  ];

  const defusionPhrases = [
    "Ce stress est un signal, pas une vérité.",
    "Cette tension peut passer, comme un nuage.",
    "Je peux observer cette émotion sans qu'elle me dirige."
  ];

  const startStressPhase = () => {
    setPhase('stress');
    setStressTimer(0);
    setTensionLevel(0);
  };

  const completeStressPhase = () => {
    setPhase('defusion');
  };

  const selectCounterSpell = (spell: CounterSpell) => {
    setSelectedCounterSpell(spell);
    setPhase('action');
  };

  const completeAction = () => {
    setPhase('complete');
  };

  const resetBattle = () => {
    setPhase('prep');
    setStressTimer(0);
    setSelectedCounterSpell(null);
    setTensionLevel(0);
  };

  // Animation du niveau de tension pendant la phase stress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'stress') {
      interval = setInterval(() => {
        setStressTimer(prev => {
          const newTime = prev + 1;
          setTensionLevel(Math.min(newTime / 30 * 100, 100)); // Max tension à 30s
          if (newTime >= 45) { // Auto-completion après 45s
            setPhase('defusion');
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const getTensionColor = () => {
    if (tensionLevel < 30) return 'text-green-400';
    if (tensionLevel < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSpellIcon = (type: CounterSpell['type']) => {
    switch (type) {
      case 'silk': return '🌸';
      case 'flash': return '✨';
      case 'breath': return '🌊';
      case 'walk': return '🚶';
      default: return '⚡';
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
          <h1 className="text-2xl font-semibold text-foreground">Bounce Back</h1>
          <p className="text-sm text-muted-foreground">Reprise éclair</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {phase === 'prep' && (
          <div className="text-center space-y-6">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Prêt pour le battle ?</h2>
              <p className="text-muted-foreground mb-6">
                30-60s face à un mini stress, puis défusion et action exacte.
              </p>
              <Button onClick={startStressPhase} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Commencer le défi
              </Button>
            </Card>
          </div>
        )}

        {phase === 'stress' && (
          <div className="text-center space-y-6">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="mb-4">
                <Zap className={`h-12 w-12 mx-auto mb-2 ${getTensionColor()}`} />
                <div className="text-2xl font-light text-foreground mb-2">
                  {Math.floor(stressTimer / 60)}:{(stressTimer % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Jauge de tension */}
              <div className="mb-6">
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      tensionLevel < 30 ? 'bg-green-400' :
                      tensionLevel < 70 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${tensionLevel}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Observez la montée de tension
                </p>
              </div>

              <p className="text-muted-foreground mb-4">
                Respirez et observez... Le stress monte, c'est normal.
              </p>

              <Button 
                onClick={completeStressPhase} 
                variant="outline"
                className="hover:bg-primary/10"
              >
                Je suis prêt à défuser
              </Button>
            </Card>
          </div>
        )}

        {phase === 'defusion' && (
          <div className="space-y-4">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <RefreshCw className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-4">Défusion</h2>
            </Card>

            {defusionPhrases.map((phrase, index) => (
              <Card 
                key={index}
                className="p-4 bg-card/60 backdrop-blur-sm border-border/50 text-center hover:bg-card/80 transition-colors cursor-pointer"
                onClick={() => setPhase('action')}
              >
                <p className="text-sm text-foreground italic">{phrase}</p>
              </Card>
            ))}

            <Button 
              onClick={() => setPhase('action')} 
              className="w-full mt-4"
            >
              Choisir mon contre-sort
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {phase === 'action' && !selectedCounterSpell && (
          <div className="space-y-4">
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">Contre-sorts disponibles</h2>
              <p className="text-sm text-muted-foreground">Choisissez votre action de reprise</p>
            </Card>

            {counterSpells.map((spell) => (
              <Card 
                key={spell.id}
                className="p-4 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all cursor-pointer group"
                onClick={() => selectCounterSpell(spell)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSpellIcon(spell.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {spell.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{spell.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(spell.duration / 60)}:{(spell.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {phase === 'action' && selectedCounterSpell && (
          <div className="text-center space-y-6">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <span className="text-4xl block mb-4">{getSpellIcon(selectedCounterSpell.type)}</span>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {selectedCounterSpell.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                {selectedCounterSpell.action}
              </p>
              <div className="space-y-3">
                <Button onClick={completeAction} className="w-full">
                  Action terminée ✨
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedCounterSpell(null)}
                  className="w-full"
                >
                  Changer de contre-sort
                </Button>
              </div>
            </Card>
          </div>
        )}

        {phase === 'complete' && (
          <div className="text-center space-y-6">
            <Card className="p-6 bg-primary/10 border-primary/20">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Battle terminé !</h2>
              <p className="text-muted-foreground mb-6">
                Vous avez affronté le stress et rebondi avec succès.
              </p>
              
              <div className="space-y-3">
                <Button onClick={resetBattle} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Nouveau battle
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Retour au dashboard
                </Button>
              </div>
            </Card>

            {/* Proposition pour demain */}
            <Card className="p-4 bg-card/40 backdrop-blur-sm border-border/30">
              <p className="text-sm text-muted-foreground text-center">
                💫 On refait un tour demain ?
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2CBounceBackBattlePage;