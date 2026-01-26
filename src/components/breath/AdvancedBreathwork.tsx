// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Settings,
  Wind,
  Heart,
  Brain,
  Waves,
  Timer,
  Target,
  Volume2,
  VolumeX,
  type LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tone from 'tone';

type LucideIconType = LucideIcon;

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  category: 'relaxation' | 'energy' | 'focus' | 'healing';
  inhale: number;
  hold: number;
  exhale: number;
  hold2?: number;
  cycles: number;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: LucideIconType;
  color: string;
  background: string;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: '4-4-4-4 Box Breathing',
    description: 'Technique militaire pour le calme et la concentration',
    category: 'focus',
    inhale: 4,
    hold: 4,
    exhale: 4,
    hold2: 4,
    cycles: 10,
    benefits: ['Réduit le stress', 'Améliore la concentration', 'Stabilise la pression artérielle'],
    difficulty: 'beginner',
    icon: Target,
    color: 'text-primary',
    background: 'from-primary/10 to-primary/20'
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    description: 'Respiration énergisante pour l\'immunité et l\'énergie',
    category: 'energy',
    inhale: 2,
    hold: 0,
    exhale: 1,
    cycles: 30,
    benefits: ['Booste l\'énergie', 'Renforce l\'immunité', 'Améliore la résistance au froid'],
    difficulty: 'advanced',
    icon: Wind,
    color: 'text-warning',
    background: 'from-warning/10 to-warning/20'
  },
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    description: 'Synchronisation cœur-cerveau pour l\'équilibre',
    category: 'healing',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 18,
    benefits: ['Équilibre le système nerveux', 'Réduit l\'anxiété', 'Améliore la variabilité cardiaque'],
    difficulty: 'beginner',
    icon: Heart,
    color: 'text-destructive',
    background: 'from-destructive/10 to-destructive/20'
  },
  {
    id: 'pranayama',
    name: '4-7-8 Pranayama',
    description: 'Technique yogique pour la relaxation profonde',
    category: 'relaxation',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 8,
    benefits: ['Favorise le sommeil', 'Calme l\'esprit', 'Réduit l\'anxiété'],
    difficulty: 'intermediate',
    icon: Brain,
    color: 'text-accent',
    background: 'from-accent/10 to-accent/20'
  },
  {
    id: 'ocean',
    name: 'Respiration Océanique',
    description: 'Respiration avec sons pour la méditation',
    category: 'relaxation',
    inhale: 6,
    hold: 2,
    exhale: 8,
    cycles: 12,
    benefits: ['Apaise l\'esprit', 'Favorise la méditation', 'Améliore la concentration'],
    difficulty: 'intermediate',
    icon: Waves,
    color: 'text-info',
    background: 'from-info/10 to-info/20'
  }
];

interface BreathingSession {
  pattern: BreathingPattern;
  currentCycle: number;
  phase: 'inhale' | 'hold' | 'exhale' | 'hold2' | 'rest';
  phaseTime: number;
  totalTime: number;
  isActive: boolean;
}

export const AdvancedBreathwork: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [session, setSession] = useState<BreathingSession | null>(null);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    guidanceEnabled: true,
    vibrationEnabled: true,
    customDuration: 5
  });
  
  const animationRef = useRef<number>();
  const synthRef = useRef<Tone.Synth | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialiser Tone.js
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 1 }
    }).toDestination();

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startSession = useCallback(async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    const newSession: BreathingSession = {
      pattern: selectedPattern,
      currentCycle: 0,
      phase: 'inhale',
      phaseTime: 0,
      totalTime: 0,
      isActive: true
    };

    setSession(newSession);
    animateBreathing(newSession);
  }, [selectedPattern]);

  const stopSession = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setSession(null);
  }, []);

  const pauseSession = useCallback(() => {
    if (session) {
      setSession({ ...session, isActive: !session.isActive });
      if (!session.isActive) {
        animateBreathing(session);
      }
    }
  }, [session]);

  const animateBreathing = useCallback((currentSession: BreathingSession) => {
    const animate = (timestamp: number) => {
      if (!currentSession.isActive) return;

      setSession(prev => {
        if (!prev) return null;

        const newSession = { ...prev };
        newSession.phaseTime += 16; // ~60fps
        newSession.totalTime += 16;

        const pattern = newSession.pattern;
        let phaseDuration = 0;

        switch (newSession.phase) {
          case 'inhale':
            phaseDuration = pattern.inhale * 1000;
            break;
          case 'hold':
            phaseDuration = pattern.hold * 1000;
            break;
          case 'exhale':
            phaseDuration = pattern.exhale * 1000;
            break;
          case 'hold2':
            phaseDuration = (pattern.hold2 || 0) * 1000;
            break;
          case 'rest':
            phaseDuration = 2000;
            break;
        }

        // Transition vers la phase suivante
        if (newSession.phaseTime >= phaseDuration) {
          newSession.phaseTime = 0;
          
          switch (newSession.phase) {
            case 'inhale':
              newSession.phase = pattern.hold > 0 ? 'hold' : 'exhale';
              break;
            case 'hold':
              newSession.phase = 'exhale';
              break;
            case 'exhale':
              if (pattern.hold2 && pattern.hold2 > 0) {
                newSession.phase = 'hold2';
              } else {
                newSession.currentCycle++;
                if (newSession.currentCycle >= pattern.cycles) {
                  newSession.phase = 'rest';
                } else {
                  newSession.phase = 'inhale';
                }
              }
              break;
            case 'hold2':
              newSession.currentCycle++;
              if (newSession.currentCycle >= pattern.cycles) {
                newSession.phase = 'rest';
              } else {
                newSession.phase = 'inhale';
              }
              break;
          }

          // Jouer des sons pour les transitions
          if (settings.soundEnabled && synthRef.current) {
            switch (newSession.phase) {
              case 'inhale':
                synthRef.current.triggerAttackRelease('C4', '0.1');
                break;
              case 'exhale':
                synthRef.current.triggerAttackRelease('G3', '0.1');
                break;
            }
          }
        }

        // Arrêter la session si terminée
        if (newSession.phase === 'rest' && newSession.phaseTime >= 2000) {
          newSession.isActive = false;
          return null;
        }

        return newSession;
      });

      // Dessiner l'animation sur le canvas
      drawBreathingAnimation(currentSession);

      if (currentSession.isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [settings.soundEnabled]);

  const drawBreathingAnimation = useCallback((session: BreathingSession) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.3;

    // Calculer la taille du cercle selon la phase
    let targetRadius = maxRadius * 0.3;
    let progress = session.phaseTime / (getPhaseLength(session) * 1000);

    switch (session.phase) {
      case 'inhale':
        targetRadius = maxRadius * (0.3 + 0.7 * progress);
        break;
      case 'hold':
        targetRadius = maxRadius;
        break;
      case 'exhale':
        targetRadius = maxRadius * (1 - 0.7 * progress);
        break;
      case 'hold2':
        targetRadius = maxRadius * 0.3;
        break;
    }

    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le cercle principal
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, targetRadius);
    gradient.addColorStop(0, `rgba(59, 130, 246, 0.8)`);
    gradient.addColorStop(1, `rgba(59, 130, 246, 0.2)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, targetRadius, 0, Math.PI * 2);
    ctx.fill();

    // Dessiner des ondulations
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - i * 0.1})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, targetRadius + i * 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Afficher le texte de la phase
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(getPhaseText(session.phase), centerX, centerY + 10);

    // Afficher le compteur
    ctx.font = '16px sans-serif';
    ctx.fillText(`Cycle ${session.currentCycle + 1}/${session.pattern.cycles}`, centerX, centerY + 40);
  }, []);

  const getPhaseLength = (session: BreathingSession): number => {
    switch (session.phase) {
      case 'inhale': return session.pattern.inhale;
      case 'hold': return session.pattern.hold;
      case 'exhale': return session.pattern.exhale;
      case 'hold2': return session.pattern.hold2 || 0;
      case 'rest': return 2;
      default: return 0;
    }
  };

  const getPhaseText = (phase: string): string => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'hold2': return 'Pause';
      case 'rest': return 'Repos';
      default: return '';
    }
  };

  const getPatternsByCategory = (category: string) => 
    breathingPatterns.filter(p => p.category === category);

  const categories = [
    { id: 'relaxation', name: 'Relaxation', icon: Brain },
    { id: 'energy', name: 'Énergie', icon: Wind },
    { id: 'focus', name: 'Focus', icon: Target },
    { id: 'healing', name: 'Guérison', icon: Heart }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Breathwork Avancé</h2>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </div>

      {/* Session Active */}
      <AnimatePresence>
        {session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedPattern.background} opacity-20`} />
              
              <CardContent className="p-8 text-center relative">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{selectedPattern.name}</h3>
                  <Badge variant="outline">{selectedPattern.difficulty}</Badge>
                </div>

                {/* Canvas d'animation */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="mx-auto mb-6 rounded-full"
                />

                {/* Contrôles */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    onClick={pauseSession}
                    variant="outline"
                    size="lg"
                  >
                    {session.isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    onClick={stopSession}
                    variant="outline"
                    size="lg"
                  >
                    <Square className="h-6 w-6" />
                  </Button>

                  <Button
                    onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    variant="outline"
                    size="lg"
                  >
                    {settings.soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                  </Button>
                </div>

                {/* Progression */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progression du cycle</span>
                    <span>{session.currentCycle}/{selectedPattern.cycles}</span>
                  </div>
                  <Progress value={(session.currentCycle / selectedPattern.cycles) * 100} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Temps total</span>
                    <span>{Math.floor(session.totalTime / 60000)}:{Math.floor((session.totalTime % 60000) / 1000).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sélection des patterns */}
      {!session && (
        <>
          {categories.map(category => {
            const categoryPatterns = getPatternsByCategory(category.id);
            if (categoryPatterns.length === 0) return null;

            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryPatterns.map(pattern => {
                    const PatternIcon = pattern.icon;
                    
                    return (
                      <Card 
                        key={pattern.id}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          selectedPattern.id === pattern.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedPattern(pattern)}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${pattern.background} opacity-10 rounded-lg`} />
                        
                        <CardHeader className="pb-3 relative">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full bg-gradient-to-br ${pattern.background}`}>
                                <PatternIcon className={`h-5 w-5 ${pattern.color}`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{pattern.name}</CardTitle>
                                <Badge variant="outline" size="sm">
                                  {pattern.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 relative">
                          <p className="text-sm text-muted-foreground">{pattern.description}</p>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="h-4 w-4" />
                            <span>
                              {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                              {pattern.hold2 ? `-${pattern.hold2}` : ''} × {pattern.cycles}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Bénéfices:</p>
                            <div className="flex flex-wrap gap-1">
                              {pattern.benefits.slice(0, 2).map((benefit, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                              {pattern.benefits.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{pattern.benefits.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bouton de démarrage */}
          <div className="flex justify-center pt-6">
            <Button onClick={startSession} size="lg" className="px-8">
              <Play className="mr-2 h-5 w-5" />
              Commencer la session
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedBreathwork;