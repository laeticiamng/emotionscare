/**
 * GLOW QUEST - Quête de micro-bonheurs
 * Collection de mini-jeux émotionnels rapides (30s-3min) ultra-addictifs
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Smile, Laugh, Heart, Gift, Star, Zap, 
  Sun, Coffee, Music, BookOpen, Camera, Trophy 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageRoot from '@/components/common/PageRoot';

interface GlowMission {
  id: string;
  name: string;
  tagline: string;
  description: string;
  duration: number;
  type: 'gratitude' | 'joy' | 'connection' | 'creativity' | 'movement' | 'mindfulness';
  difficulty: 1 | 2 | 3;
  icon: any;
  color: string;
  points: number;
  streak_bonus: number;
  instructions: string[];
  prompt?: string;
}

const glowMissions: GlowMission[] = [
  {
    id: 'quick-smile',
    name: 'Le Sourire Instantané',
    tagline: 'Déclenche une cascade de dopamine',
    description: 'Souris pendant 30 secondes en pensant à ton meilleur souvenir',
    duration: 30,
    type: 'joy',
    difficulty: 1,
    icon: Smile,
    color: 'from-yellow-400 to-amber-400',
    points: 10,
    streak_bonus: 2,
    instructions: [
      'Ferme les yeux',
      'Pense à ton meilleur souvenir',
      'Laisse le sourire venir naturellement',
      'Ressens la chaleur dans ton corps'
    ]
  },
  {
    id: 'three-gratitudes',
    name: 'Le Trio Magique',
    tagline: 'Reprogramme ton cerveau vers le positif',
    description: 'Liste 3 choses pour lesquelles tu es reconnaissant',
    duration: 60,
    type: 'gratitude',
    difficulty: 1,
    icon: Heart,
    color: 'from-pink-400 to-rose-400',
    points: 15,
    streak_bonus: 3,
    instructions: [
      'Respire profondément',
      'Pense à 3 choses simples d\'aujourd\'hui',
      'Ressens la gratitude dans ton cœur',
      'Souris à chacune'
    ],
    prompt: 'Pour quoi es-tu reconnaissant maintenant ?'
  },
  {
    id: 'power-laugh',
    name: 'Le Rire Thérapeutique',
    tagline: 'Libère des endorphines à gogo',
    description: 'Ris aux éclats pendant 45 secondes (même faux)',
    duration: 45,
    type: 'joy',
    difficulty: 2,
    icon: Laugh,
    color: 'from-orange-400 to-red-400',
    points: 20,
    streak_bonus: 4,
    instructions: [
      'Commence à rire même si c\'est faux',
      'Force toi, le cerveau ne fait pas la différence',
      'Laisse le rire devenir réel',
      'Sens l\'énergie monter'
    ]
  },
  {
    id: 'kindness-text',
    name: 'Le Message Lumineux',
    tagline: 'Double bonheur: donner et recevoir',
    description: 'Envoie un message gentil à quelqu\'un',
    duration: 90,
    type: 'connection',
    difficulty: 1,
    icon: Gift,
    color: 'from-cyan-400 to-blue-400',
    points: 25,
    streak_bonus: 5,
    instructions: [
      'Pense à quelqu\'un qui compte',
      'Écris un message sincère et simple',
      'Envoie-le sans attendre de réponse',
      'Ressens la joie de donner'
    ],
    prompt: 'À qui vas-tu illuminer la journée ?'
  },
  {
    id: 'micro-dance',
    name: 'La Danse Énergétique',
    tagline: 'Secoue l\'énergie stagnante',
    description: 'Danse comme si personne ne regardait pendant 2 minutes',
    duration: 120,
    type: 'movement',
    difficulty: 2,
    icon: Music,
    color: 'from-purple-400 to-pink-500',
    points: 30,
    streak_bonus: 6,
    instructions: [
      'Mets une musique qui te fait vibrer',
      'Laisse ton corps bouger librement',
      'Ne juge pas, ressens juste',
      'Libère toute l\'énergie bloquée'
    ]
  },
  {
    id: 'beauty-hunt',
    name: 'Le Chasseur de Beauté',
    tagline: 'Réentraîne ton cerveau à voir le beau',
    description: 'Trouve 5 choses belles autour de toi',
    duration: 180,
    type: 'mindfulness',
    difficulty: 2,
    icon: Camera,
    color: 'from-green-400 to-emerald-500',
    points: 35,
    streak_bonus: 7,
    instructions: [
      'Regarde autour de toi avec des yeux neufs',
      'Trouve 5 détails beaux ou intéressants',
      'Prends le temps de les apprécier',
      'Sens ton cœur s\'ouvrir'
    ],
    prompt: 'Qu\'est-ce qui attire ton regard ?'
  },
  {
    id: 'future-self-letter',
    name: 'La Lettre au Futur',
    tagline: 'Crée un pont vers ta meilleure version',
    description: 'Écris 3 lignes à ton toi futur dans 1 an',
    duration: 180,
    type: 'creativity',
    difficulty: 3,
    icon: BookOpen,
    color: 'from-indigo-400 to-purple-500',
    points: 40,
    streak_bonus: 8,
    instructions: [
      'Imagine ton toi dans 1 an',
      'Écris-lui un message d\'encouragement',
      'Partage tes espoirs et rêves',
      'Sens la connexion temporelle'
    ],
    prompt: 'Que veux-tu dire à ton futur toi ?'
  },
  {
    id: 'energy-burst',
    name: 'L\'Explosion Vitale',
    tagline: 'Reset instantané de ton énergie',
    description: 'Combo respiration + mouvement + cri de victoire',
    duration: 60,
    type: 'movement',
    difficulty: 3,
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    points: 45,
    streak_bonus: 9,
    instructions: [
      '10 respirations rapides et profondes',
      'Saute sur place 10 fois',
      'Crie "YES!" de toutes tes forces',
      'Ressens l\'énergie pure'
    ]
  },
  {
    id: 'morning-sun',
    name: 'Le Rituel Solaire',
    tagline: 'Synchronise ton horloge biologique',
    description: 'Expose-toi à la lumière naturelle 2 minutes',
    duration: 120,
    type: 'mindfulness',
    difficulty: 1,
    icon: Sun,
    color: 'from-yellow-300 to-orange-300',
    points: 20,
    streak_bonus: 4,
    instructions: [
      'Va dehors ou près d\'une fenêtre',
      'Ferme les yeux face à la lumière',
      'Respire profondément',
      'Absorbe l\'énergie photonique'
    ]
  },
  {
    id: 'coffee-mindfulness',
    name: 'La Pause Consciente',
    tagline: 'Transforme une habitude en rituel',
    description: 'Bois ton café/thé en pleine conscience',
    duration: 180,
    type: 'mindfulness',
    difficulty: 2,
    icon: Coffee,
    color: 'from-brown-400 to-amber-600',
    points: 25,
    streak_bonus: 5,
    instructions: [
      'Sens l\'arôme profondément',
      'Observe la couleur et la texture',
      'Prends de toutes petites gorgées',
      'Sois totalement présent'
    ]
  }
];

const GlowQuestPage: React.FC = () => {
  const { toast } = useToast();
  
  // Progression
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [missionHistory, setMissionHistory] = useState<Record<string, number>>({});
  
  // Mission active
  const [activeMission, setActiveMission] = useState<GlowMission | null>(null);
  const [missionPhase, setMissionPhase] = useState<'prep' | 'active' | 'complete'>('prep');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  
  // Animation
  const [glowParticles, setGlowParticles] = useState<Array<any>>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calcul statistiques
  const totalCompleted = Object.values(missionHistory).reduce((sum, count) => sum + count, 0);
  const uniqueCompleted = Object.keys(missionHistory).length;
  const level = Math.floor(totalPoints / 100) + 1;

  // Timer de mission
  useEffect(() => {
    if (missionPhase !== 'active' || !activeMission) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeMission();
          return 0;
        }
        return prev - 1;
      });

      // Particules de progression
      if (Math.random() > 0.7) {
        setGlowParticles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 10
        }]);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [missionPhase, activeMission]);

  // Nettoyage particules
  useEffect(() => {
    const cleanup = setInterval(() => {
      setGlowParticles(prev => prev.filter(p => Date.now() - p.id < 2000));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  const startMission = (mission: GlowMission) => {
    setActiveMission(mission);
    setMissionPhase('prep');
    setCurrentStep(0);
    setUserInput('');
  };

  const beginMission = () => {
    if (!activeMission) return;
    setMissionPhase('active');
    setTimeLeft(activeMission.duration);
    
    toast({
      title: '✨ Mission lancée !',
      description: activeMission.tagline,
      duration: 3000
    });
  };

  const completeMission = () => {
    if (!activeMission) return;

    const isRepeated = missionHistory[activeMission.id] || 0;
    const streakBonus = currentStreak * activeMission.streak_bonus;
    const totalEarned = activeMission.points + streakBonus;

    setMissionPhase('complete');
    setTotalPoints(prev => prev + totalEarned);
    setCompletedToday(prev => [...prev, activeMission.id]);
    setMissionHistory(prev => ({
      ...prev,
      [activeMission.id]: (prev[activeMission.id] || 0) + 1
    }));

    // Gestion streak
    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    if (newStreak > longestStreak) {
      setLongestStreak(newStreak);
    }

    toast({
      title: '🎉 Mission accomplie !',
      description: `+${totalEarned} points (streak x${currentStreak})`,
      duration: 4000
    });

    // Particules de célébration
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        setGlowParticles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 20
        }]);
      }, i * 50);
    }
  };

  const closeMission = () => {
    setActiveMission(null);
    setMissionPhase('prep');
    setGlowParticles([]);
  };

  const nextStep = () => {
    if (activeMission && currentStep < activeMission.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      beginMission();
    }
  };

  const difficultyColor = {
    1: 'from-green-400 to-emerald-400',
    2: 'from-blue-400 to-indigo-400',
    3: 'from-purple-400 to-pink-400'
  };

  return (
    <PageRoot className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">

        {/* Modal Mission Active */}
        <AnimatePresence>
          {activeMission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            >
              {/* Particules */}
              {glowParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: p.x + '%', y: p.y + '%', scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 2 }}
                  className={`absolute rounded-full bg-gradient-to-r ${activeMission.color}`}
                  style={{ width: p.size, height: p.size, filter: 'blur(10px)' }}
                />
              ))}

              <Card className="w-full max-w-2xl relative">
                <CardContent className="p-8 space-y-6">
                  
                  {/* Phase Préparation */}
                  {missionPhase === 'prep' && (
                    <>
                      <div className="text-center space-y-4">
                        <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${activeMission.color}`}>
                          <activeMission.icon className="w-16 h-16 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">{activeMission.name}</h2>
                        <p className="text-lg text-muted-foreground">{activeMission.tagline}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Instructions:</h3>
                        <div className="space-y-3">
                          {activeMission.instructions.map((instruction, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: idx === currentStep ? 1 : 0.3 }}
                              animate={{ opacity: idx === currentStep ? 1 : 0.3 }}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                idx === currentStep ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/50'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                idx <= currentStep ? `bg-gradient-to-r ${activeMission.color} text-white` : 'bg-muted'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className={idx === currentStep ? 'font-semibold' : ''}>{instruction}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {activeMission.prompt && currentStep === activeMission.instructions.length - 1 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{activeMission.prompt}</label>
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-background min-h-[100px]"
                            placeholder="Écris tes pensées..."
                          />
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={closeMission} className="flex-1">
                          Annuler
                        </Button>
                        <Button
                          onClick={nextStep}
                          className={`flex-1 bg-gradient-to-r ${activeMission.color}`}
                        >
                          {currentStep < activeMission.instructions.length - 1 ? 'Suivant' : 'Commencer'}
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Phase Active */}
                  {missionPhase === 'active' && (
                    <>
                      <div className="text-center space-y-6">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`inline-block p-8 rounded-full bg-gradient-to-br ${activeMission.color}`}
                        >
                          <activeMission.icon className="w-20 h-20 text-white" />
                        </motion.div>

                        <div>
                          <h2 className="text-5xl font-bold mb-2">{timeLeft}s</h2>
                          <p className="text-lg text-muted-foreground">{activeMission.description}</p>
                        </div>

                        <Progress 
                          value={((activeMission.duration - timeLeft) / activeMission.duration) * 100} 
                          className="h-3"
                        />

                        <p className="text-sm text-muted-foreground italic">
                          Reste concentré... La magie opère
                        </p>
                      </div>

                      <Button variant="outline" onClick={completeMission} className="w-full">
                        Terminer maintenant
                      </Button>
                    </>
                  )}

                  {/* Phase Complete */}
                  {missionPhase === 'complete' && (
                    <>
                      <div className="text-center space-y-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`inline-block p-8 rounded-full bg-gradient-to-br ${activeMission.color}`}
                        >
                          <Trophy className="w-20 h-20 text-white" />
                        </motion.div>

                        <div>
                          <h2 className="text-4xl font-bold mb-2">Mission accomplie !</h2>
                          <p className="text-lg text-muted-foreground">Tu brilles plus fort maintenant ✨</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-primary">
                              +{activeMission.points + currentStreak * activeMission.streak_bonus}
                            </div>
                            <div className="text-sm text-muted-foreground">Points</div>
                          </div>
                          <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-primary">{currentStreak}</div>
                            <div className="text-sm text-muted-foreground">Streak</div>
                          </div>
                          <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-primary">{level}</div>
                            <div className="text-sm text-muted-foreground">Niveau</div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={closeMission}
                        className={`w-full bg-gradient-to-r ${activeMission.color}`}
                      >
                        Continuer l'aventure
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vue Principale */}
        {!activeMission && (
          <>
            {/* Header Stats */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Sparkles className="w-10 h-10 text-primary" />
                    Glow Quest
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Micro-bonheurs qui changent tout
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{totalPoints} pts</div>
                  <div className="text-sm text-muted-foreground">Niveau {level}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">{completedToday.length}</div>
                  <div className="text-sm text-muted-foreground">Aujourd'hui</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">{currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Streak actuel</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">{longestStreak}</div>
                  <div className="text-sm text-muted-foreground">Record</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">{totalCompleted}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </Card>
              </div>

              <Progress value={(level % 1) * 100} className="h-3" />
            </div>

            {/* Grille Missions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {glowMissions.map((mission, idx) => {
                const Icon = mission.icon;
                const timesCompleted = missionHistory[mission.id] || 0;

                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-full bg-gradient-to-br ${mission.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge className={`bg-gradient-to-r ${difficultyColor[mission.difficulty]}`}>
                            {mission.duration}s
                          </Badge>
                        </div>

                        <div>
                          <h3 className="font-bold text-xl mb-1">{mission.name}</h3>
                          <p className="text-sm text-primary mb-2">{mission.tagline}</p>
                          <p className="text-sm text-muted-foreground">{mission.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{mission.points} pts</span>
                          {timesCompleted > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              {timesCompleted}x
                            </span>
                          )}
                        </div>

                        <Button
                          onClick={() => startMission(mission)}
                          className={`w-full bg-gradient-to-r ${mission.color}`}
                        >
                          Lancer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageRoot>
  );
};

export default GlowQuestPage;
