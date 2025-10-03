/**
 * BREATH JOURNEY - Parcours de respiration immersif
 * Voyage progressif à travers 7 techniques avec narration guidée
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wind, Heart, Brain, Zap, Sparkles, Trophy, Star, Crown, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageRoot from '@/components/common/PageRoot';

interface BreathTechnique {
  id: string;
  name: string;
  description: string;
  narrative: string;
  pattern: { inhale: number; hold: number; exhale: number; pause: number };
  duration: number;
  level: number;
  unlockScore: number;
  icon: any;
  color: string;
  benefits: string[];
  difficulty: 'débutant' | 'intermédiaire' | 'avancé' | 'maître';
}

const breathTechniques: BreathTechnique[] = [
  {
    id: 'calm-wave',
    name: 'La Vague du Calme',
    narrative: 'Imagine-toi au bord de l\'océan. Chaque vague qui arrive est une inspiration, chaque vague qui se retire est une expiration...',
    description: 'Technique d\'ancrage pour débuter ton voyage respiratoire',
    pattern: { inhale: 4, hold: 2, exhale: 6, pause: 2 },
    duration: 300,
    level: 1,
    unlockScore: 0,
    icon: Wind,
    color: 'from-blue-400 to-cyan-500',
    benefits: ['Réduction stress', 'Ancrage mental', 'Clarté'],
    difficulty: 'débutant'
  },
  {
    id: 'golden-ratio',
    name: 'Le Ratio d\'Or',
    narrative: 'Tu découvres le nombre d\'or de la respiration. Chaque cycle est une harmonisation parfaite de ton système nerveux...',
    description: 'Équilibre optimal entre activation et relaxation',
    pattern: { inhale: 5, hold: 5, exhale: 5, pause: 5 },
    duration: 480,
    level: 2,
    unlockScore: 100,
    icon: Heart,
    color: 'from-amber-400 to-orange-500',
    benefits: ['Équilibre autonome', 'Cohérence cardiaque', 'Flow'],
    difficulty: 'intermédiaire'
  },
  {
    id: 'fire-breath',
    name: 'Le Souffle du Dragon',
    narrative: 'Réveille l\'énergie primordiale qui sommeille en toi. Chaque expiration puissante libère ta force vitale...',
    description: 'Technique énergisante pour booster ta vitalité',
    pattern: { inhale: 2, hold: 0, exhale: 1, pause: 0 },
    duration: 180,
    level: 3,
    unlockScore: 250,
    icon: Flame,
    color: 'from-red-500 to-orange-600',
    benefits: ['Énergie explosive', 'Clarté mentale', 'Éveil'],
    difficulty: 'intermédiaire'
  },
  {
    id: 'box-breathing',
    name: 'La Chambre Secrète',
    narrative: 'Entre dans un espace mental carré parfait. Chaque côté du carré est une phase de ta respiration maîtrisée...',
    description: 'Technique militaire pour performance sous pression',
    pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    duration: 360,
    level: 4,
    unlockScore: 400,
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    benefits: ['Focus extrême', 'Gestion stress', 'Performance'],
    difficulty: 'avancé'
  },
  {
    id: 'wim-hof',
    name: 'Le Protocole Glace',
    narrative: 'Plonge dans les profondeurs de ton potentiel. Cette technique ancestrale éveille tes pouvoirs cachés...',
    description: 'Méthode avancée de suroxygénation et contrôle',
    pattern: { inhale: 2, hold: 0, exhale: 1, pause: 120 },
    duration: 600,
    level: 5,
    unlockScore: 600,
    icon: Zap,
    color: 'from-cyan-400 to-blue-600',
    benefits: ['Système immunitaire', 'Résistance', 'Transcendance'],
    difficulty: 'avancé'
  },
  {
    id: 'alternate-nostril',
    name: 'L\'Union Sacrée',
    narrative: 'Équilibre les deux hémisphères de ton cerveau. Chaque narine est un canal vers une dimension de ton être...',
    description: 'Technique yogique millénaire d\'équilibrage',
    pattern: { inhale: 5, hold: 5, exhale: 5, pause: 2 },
    duration: 540,
    level: 6,
    unlockScore: 800,
    icon: Sparkles,
    color: 'from-indigo-400 to-purple-600',
    benefits: ['Équilibre cérébral', 'Clarté spirituelle', 'Paix'],
    difficulty: 'maître'
  },
  {
    id: 'cosmic-breath',
    name: 'Le Souffle Cosmique',
    narrative: 'Tu respires avec l\'univers entier. Ton souffle devient le souffle des étoiles, infini et éternel...',
    description: 'Technique ultime de connexion universelle',
    pattern: { inhale: 8, hold: 8, exhale: 8, pause: 8 },
    duration: 720,
    level: 7,
    unlockScore: 1200,
    icon: Crown,
    color: 'from-violet-500 via-purple-500 to-fuchsia-500',
    benefits: ['Conscience élargie', 'Unité', 'Transcendance totale'],
    difficulty: 'maître'
  }
];

const BreathJourneyPage: React.FC = () => {
  const { toast } = useToast();
  
  // État du parcours
  const [totalScore, setTotalScore] = useState(0);
  const [completedTechniques, setCompletedTechniques] = useState<string[]>([]);
  const [currentTechnique, setCurrentTechnique] = useState<BreathTechnique | null>(null);
  
  // État de la session
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Calcul des techniques débloquées
  const unlockedTechniques = breathTechniques.filter(t => totalScore >= t.unlockScore);
  const nextTechnique = breathTechniques.find(t => totalScore < t.unlockScore);

  // Animation de particules respiratoires
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; scale: number }>>([]);

  useEffect(() => {
    if (!isActive || !currentTechnique) return;

    const pattern = currentTechnique.pattern;
    const phases: Array<{ name: 'inhale' | 'hold' | 'exhale' | 'pause'; duration: number }> = [
      { name: 'inhale', duration: pattern.inhale },
      { name: 'hold', duration: pattern.hold },
      { name: 'exhale', duration: pattern.exhale },
      { name: 'pause', duration: pattern.pause }
    ];

    let currentPhaseIndex = 0;
    let phaseTimer = 0;

    intervalRef.current = setInterval(() => {
      const currentPhaseData = phases[currentPhaseIndex];
      
      setPhase(currentPhaseData.name);
      setPhaseProgress((phaseTimer / currentPhaseData.duration) * 100);
      
      phaseTimer += 0.1;

      // Génération de particules selon la phase
      if (currentPhaseData.name === 'inhale') {
        setParticles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: 100,
          scale: Math.random() * 0.5 + 0.5
        }]);
      }

      if (phaseTimer >= currentPhaseData.duration) {
        phaseTimer = 0;
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        
        if (currentPhaseIndex === 0) {
          setCycleCount(prev => prev + 1);
          const points = 10 + combo * 2;
          setSessionScore(prev => prev + points);
          setCombo(prev => prev + 1);
        }
      }

      setTimeLeft(prev => {
        if (prev <= 0.1) {
          endSession();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, currentTechnique, combo]);

  // Nettoyage des particules
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 3000));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  const startSession = (technique: BreathTechnique) => {
    setCurrentTechnique(technique);
    setIsActive(true);
    setTimeLeft(technique.duration);
    setCycleCount(0);
    setSessionScore(0);
    setCombo(0);
    setPhase('inhale');

    // Son de démarrage
    playTone(440, 0.2);

    toast({
      title: `🌬️ ${technique.name}`,
      description: technique.narrative,
      duration: 5000
    });
  };

  const endSession = () => {
    if (!currentTechnique) return;

    setIsActive(false);
    
    // Calcul du score final avec bonus
    const cycleBonus = cycleCount * 5;
    const comboBonus = Math.floor(combo * 1.5);
    const completionBonus = timeLeft === 0 ? 100 : 0;
    const finalScore = sessionScore + cycleBonus + comboBonus + completionBonus;

    setTotalScore(prev => prev + finalScore);
    
    if (!completedTechniques.includes(currentTechnique.id)) {
      setCompletedTechniques(prev => [...prev, currentTechnique.id]);
    }

    // Son de succès
    playTone(880, 0.3);

    toast({
      title: `✨ Session terminée !`,
      description: `${finalScore} points | ${cycleCount} cycles | Combo x${combo}`,
      duration: 4000
    });

    setCurrentTechnique(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const playTone = (frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    osc.start();
    osc.stop(audioContextRef.current.currentTime + duration);
  };

  const phaseInstructions = {
    inhale: 'Inspire profondément',
    hold: 'Retiens ton souffle',
    exhale: 'Expire lentement',
    pause: 'Pause naturelle'
  };

  const phaseColors = {
    inhale: 'from-blue-400 to-cyan-400',
    hold: 'from-amber-400 to-yellow-400',
    exhale: 'from-purple-400 to-pink-400',
    pause: 'from-gray-400 to-slate-400'
  };

  return (
    <PageRoot className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Vue Session Active */}
        <AnimatePresence>
          {isActive && currentTechnique && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background flex items-center justify-center"
            >
              {/* Particules de respiration */}
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: `${p.x}%`, y: '100%', opacity: 0, scale: 0 }}
                  animate={{ 
                    x: `${p.x}%`, 
                    y: phase === 'inhale' ? '20%' : phase === 'exhale' ? '100%' : `${50 + Math.random() * 20}%`,
                    opacity: [0, 1, 0],
                    scale: [0, p.scale, 0]
                  }}
                  transition={{ duration: 3, ease: 'easeInOut' }}
                  className="absolute w-4 h-4 rounded-full bg-primary/30"
                />
              ))}

              <div className="text-center space-y-8 max-w-2xl px-4">
                <motion.div
                  animate={{ scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.1 : phase === 'exhale' ? 0.8 : 0.9 }}
                  transition={{ duration: 0.5 }}
                  className={`mx-auto w-64 h-64 rounded-full bg-gradient-to-br ${phaseColors[phase]} flex items-center justify-center shadow-2xl`}
                >
                  <div className="text-6xl font-bold text-white">
                    {Math.ceil(phaseProgress / 100 * (currentTechnique.pattern[phase] || 1))}
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">{phaseInstructions[phase]}</h2>
                  <Progress value={phaseProgress} className="h-2" />
                  
                  <div className="flex justify-center gap-8 text-lg">
                    <div>Cycle <span className="font-bold">{cycleCount}</span></div>
                    <div>Score <span className="font-bold">{sessionScore}</span></div>
                    <div>Combo <span className="font-bold text-primary">x{combo}</span></div>
                  </div>
                  
                  <div className="text-muted-foreground">
                    Temps restant: {Math.floor(timeLeft / 60)}:{(Math.floor(timeLeft) % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                <Button variant="destructive" onClick={endSession}>
                  Terminer la session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vue Principale - Parcours */}
        {!isActive && (
          <>
            {/* Header de progression */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Wind className="w-10 h-10" />
                    Voyage Respiratoire
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Maîtrise 7 techniques légendaires de respiration
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary flex items-center gap-2">
                    <Trophy className="w-8 h-8" />
                    {totalScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {completedTechniques.length}/{breathTechniques.length} techniques maîtrisées
                  </div>
                </div>
              </div>

              <Progress value={(completedTechniques.length / breathTechniques.length) * 100} className="h-3" />
            </div>

            {/* Grille des techniques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breathTechniques.map((technique, idx) => {
                const isUnlocked = totalScore >= technique.unlockScore;
                const isCompleted = completedTechniques.includes(technique.id);
                const Icon = technique.icon;

                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden ${!isUnlocked && 'opacity-50'}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${technique.color} opacity-10`} />
                      
                      <CardContent className="p-6 relative space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${technique.color}`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <Badge variant="secondary" className="mb-1">
                                Niveau {technique.level}
                              </Badge>
                              <h3 className="font-bold text-xl">{technique.name}</h3>
                            </div>
                          </div>
                          {isCompleted && (
                            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground italic">
                          {technique.narrative.slice(0, 100)}...
                        </p>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {technique.benefits.map(b => (
                              <Badge key={b} variant="outline" className="text-xs">
                                {b}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {technique.duration / 60} min • {technique.difficulty}
                          </div>
                        </div>

                        {isUnlocked ? (
                          <Button
                            onClick={() => startSession(technique)}
                            className={`w-full bg-gradient-to-r ${technique.color}`}
                          >
                            Commencer
                          </Button>
                        ) : (
                          <Button disabled className="w-full">
                            🔒 Débloque à {technique.unlockScore} points
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Prochaine étape */}
            {nextTechnique && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">Prochaine technique à débloquer</h3>
                        <p className="text-muted-foreground">
                          {nextTechnique.name} • {nextTechnique.unlockScore - totalScore} points restants
                        </p>
                      </div>
                      <Progress 
                        value={(totalScore / nextTechnique.unlockScore) * 100} 
                        className="w-32 h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageRoot>
  );
};

export default BreathJourneyPage;
