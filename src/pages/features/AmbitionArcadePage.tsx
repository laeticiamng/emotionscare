import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Trophy, Star, Zap, Clock, TrendingUp, 
  Play, CheckCircle, Award, Sparkles, Brain,
  Calendar, BarChart3, Flame, Crown, Medal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AmbitionLevel {
  id: string;
  name: string;
  description: string;
  points: number;
  tasks: string[];
  completed: boolean;
  unlocked: boolean;
}

interface GameStructure {
  levels: AmbitionLevel[];
  totalPoints: number;
  badges: string[];
  currentLevel: number;
  streakDays: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  completedAmbitions: number;
  currentStreak: number;
  badges: string[];
  achievements: string[];
}

const AmbitionArcadePage: React.FC = () => {
  const { toast } = useToast();
  const [gameStructure, setGameStructure] = useState<GameStructure | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ambitionForm, setAmbitionForm] = useState({
    goal: '',
    timeframe: '30',
    difficulty: 'medium'
  });
  
  const [userStats] = useState<UserStats>({
    totalXP: 2750,
    level: 15,
    completedAmbitions: 12,
    currentStreak: 7,
    badges: ['Débutant', 'Persévérant', 'Champion', 'Élite'],
    achievements: ['Premier objectif', '7 jours consécutifs', 'Niveau 10', 'Expert']
  });

  const [activeAmbitions] = useState([
    {
      id: '1',
      title: 'Méditation Quotidienne',
      progress: 85,
      streak: 12,
      xp: 1200,
      category: 'Bien-être',
      difficulty: 'Facile',
      endDate: '2025-02-15'
    },
    {
      id: '2', 
      title: 'Course 3x par semaine',
      progress: 60,
      streak: 4,
      xp: 800,
      category: 'Fitness',
      difficulty: 'Moyen',
      endDate: '2025-03-01'
    },
    {
      id: '3',
      title: 'Apprendre le Piano',
      progress: 30,
      streak: 2,
      xp: 450,
      category: 'Créativité',
      difficulty: 'Difficile',
      endDate: '2025-06-01'
    }
  ]);

  const generateAmbitionStructure = async () => {
    if (!ambitionForm.goal.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un objectif",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ambition-arcade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ambitionForm)
      });

      if (!response.ok) throw new Error('Erreur de génération');
      
      const data = await response.json();
      setGameStructure(data.gameStructure);
      
      toast({
        title: "Structure générée !",
        description: "Votre parcours gamifié est prêt",
      });
    } catch (error) {
      // Fallback avec structure mock
      const mockStructure: GameStructure = {
        levels: [
          {
            id: '1',
            name: 'Initiation',
            description: 'Premiers pas vers votre objectif',
            points: 100,
            tasks: ['Définir un planning', 'Identifier les ressources', 'Premier essai'],
            completed: false,
            unlocked: true
          },
          {
            id: '2',
            name: 'Développement',
            description: 'Construire de bonnes habitudes',
            points: 200,
            tasks: ['Pratiquer 3 jours', 'Surmonter un obstacle', 'Trouver un mentor'],
            completed: false,
            unlocked: false
          },
          {
            id: '3',
            name: 'Maîtrise',
            description: 'Atteindre l\'excellence',
            points: 300,
            tasks: ['Performance optimale', 'Partager ses connaissances', 'Innovation'],
            completed: false,
            unlocked: false
          }
        ],
        totalPoints: 600,
        badges: ['Débutant Motivé', 'Persévérant', 'Expert'],
        currentLevel: 0,
        streakDays: 0
      };
      
      setGameStructure(mockStructure);
      toast({
        title: "Structure créée",
        description: "Votre parcours gamifié est prêt",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const completeTask = useCallback((levelId: string, taskIndex: number) => {
    setGameStructure(prev => {
      if (!prev) return prev;
      
      const newStructure = { ...prev };
      const level = newStructure.levels.find(l => l.id === levelId);
      if (level) {
        // Marquer la tâche comme complétée (simulation)
        toast({
          title: "Tâche complétée !",
          description: `+${level.points} XP gagné`,
        });
      }
      return newStructure;
    });
  }, [toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'facile': return 'text-green-600';
      case 'moyen': return 'text-yellow-600';
      case 'difficile': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'facile': return Star;
      case 'moyen': return Target;
      case 'difficile': return Crown;
      default: return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" data-testid="page-root">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header avec stats utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            🎮 Ambition Arcade
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Transformez vos objectifs en aventure épique
          </p>
          
          {/* Stats Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.level}</div>
                <div className="text-sm text-yellow-200">Niveau</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalXP}</div>
                <div className="text-sm text-blue-200">XP Total</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Flame className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.currentStreak}</div>
                <div className="text-sm text-green-200">Jours consécutifs</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Medal className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.badges.length}</div>
                <div className="text-sm text-purple-200">Badges</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Ambitions Actives */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Target className="h-8 w-8 mr-3 text-yellow-400" />
            Ambitions Actives
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {activeAmbitions.map((ambition, index) => {
              const DifficultyIcon = getDifficultyIcon(ambition.difficulty);
              
              return (
                <motion.div
                  key={ambition.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{ambition.title}</CardTitle>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {ambition.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <DifficultyIcon className={cn("h-4 w-4", getDifficultyColor(ambition.difficulty))} />
                        <span className={getDifficultyColor(ambition.difficulty)}>{ambition.difficulty}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-white font-medium">{ambition.progress}%</span>
                        </div>
                        <Progress value={ambition.progress} className="h-2 bg-gray-700" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Streak</div>
                          <div className="text-white font-medium flex items-center">
                            <Flame className="h-4 w-4 text-orange-500 mr-1" />
                            {ambition.streak} jours
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">XP</div>
                          <div className="text-white font-medium">{ambition.xp}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-gray-400">
                          Fin: {new Date(ambition.endDate).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                          <Play className="h-3 w-3 mr-1" />
                          Continuer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Créer Nouvelle Ambition */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-indigo-500/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-yellow-400" />
                Créer une Nouvelle Ambition
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal" className="text-purple-200">Objectif</Label>
                    <Textarea
                      id="goal"
                      placeholder="Ex: Apprendre à jouer de la guitare, courir un marathon..."
                      value={ambitionForm.goal}
                      onChange={(e) => setAmbitionForm(prev => ({ ...prev, goal: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeframe" className="text-purple-200">Délai (jours)</Label>
                      <Input
                        id="timeframe"
                        type="number"
                        value={ambitionForm.timeframe}
                        onChange={(e) => setAmbitionForm(prev => ({ ...prev, timeframe: e.target.value }))}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty" className="text-purple-200">Difficulté</Label>
                      <Select
                        value={ambitionForm.difficulty}
                        onValueChange={(value) => setAmbitionForm(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Facile</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="hard">Difficile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button
                    onClick={generateAmbitionStructure}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Générer le Parcours
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Structure Gamifiée Générée */}
        <AnimatePresence>
          {gameStructure && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
                Votre Parcours Gamifié
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {gameStructure.levels.map((level, index) => (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "bg-gradient-to-br backdrop-blur-md transition-all duration-300",
                      level.unlocked 
                        ? "from-green-900/60 to-emerald-900/60 border-green-500/50 hover:border-green-400" 
                        : "from-gray-800/60 to-gray-900/60 border-gray-600/50",
                      level.completed && "ring-2 ring-yellow-400"
                    )}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center">
                            {level.completed ? (
                              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                            ) : level.unlocked ? (
                              <Target className="h-6 w-6 text-blue-400 mr-2" />
                            ) : (
                              <Clock className="h-6 w-6 text-gray-400 mr-2" />
                            )}
                            {level.name}
                          </CardTitle>
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                            {level.points} XP
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{level.description}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          {level.tasks.map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className={cn(
                                "flex items-center p-2 rounded border transition-colors cursor-pointer",
                                level.unlocked 
                                  ? "border-gray-600 hover:border-purple-500 hover:bg-purple-500/10"
                                  : "border-gray-700 opacity-50"
                              )}
                              onClick={() => level.unlocked && completeTask(level.id, taskIndex)}
                            >
                              <div className="w-4 h-4 rounded border border-gray-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{task}</span>
                            </div>
                          ))}
                        </div>
                        
                        {!level.unlocked && (
                          <div className="text-center pt-2">
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Verrouillé
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Badges à débloquer */}
              <Card className="bg-gradient-to-br from-yellow-900/60 to-orange-900/60 border-yellow-500/30 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-6 w-6 mr-3 text-yellow-400" />
                    Badges à Débloquer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {gameStructure.badges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 px-3 py-1"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AmbitionArcadePage;