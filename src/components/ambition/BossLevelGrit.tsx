import React, { useState, useEffect } from 'react';
import { LucideIconType } from '@/types/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Sword, 
  Shield, 
  Target,
  Trophy,
  Star,
  Zap,
  Clock,
  CheckCircle,
  Lock,
  Gift,
  Map,
  Compass,
  Mountain,
  Flag,
  Gem,
  Fire,
  Lightning,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'health' | 'learning' | 'social';
  difficulty: 'novice' | 'warrior' | 'champion' | 'legend' | 'mythic';
  estMinutes: number;
  xpReward: number;
  requirements: string[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
  maxProgress: number;
  unlockLevel: number;
  prerequisites?: string[];
  rewards: {
    xp: number;
    coins: number;
    artifacts?: Artifact[];
    title?: string;
  };
  flavor: string;
  icon: LucideIconType;
}

interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  effect: {
    type: 'xp_boost' | 'time_reduction' | 'unlock_bonus' | 'social_boost';
    value: number;
    duration?: number;
  };
  icon: string;
}

interface PlayerProfile {
  level: number;
  xp: number;
  coins: number;
  title: string;
  artifacts: Artifact[];
  completedQuests: string[];
  currentStreak: number;
  achievements: string[];
}

const questCategories = [
  { id: 'professional', name: 'Professionnel', icon: Target, color: 'text-blue-600', bg: 'from-blue-50 to-blue-100' },
  { id: 'personal', name: 'Personnel', icon: Star, color: 'text-purple-600', bg: 'from-purple-50 to-purple-100' },
  { id: 'health', name: 'Santé', icon: Shield, color: 'text-green-600', bg: 'from-green-50 to-green-100' },
  { id: 'learning', name: 'Apprentissage', icon: Map, color: 'text-orange-600', bg: 'from-orange-50 to-orange-100' },
  { id: 'social', name: 'Social', icon: Users, color: 'text-pink-600', bg: 'from-pink-50 to-pink-100' }
];

const difficultyConfig = {
  novice: { name: 'Novice', icon: Flag, color: 'text-gray-600', multiplier: 1 },
  warrior: { name: 'Guerrier', icon: Sword, color: 'text-green-600', multiplier: 1.5 },
  champion: { name: 'Champion', icon: Crown, color: 'text-blue-600', multiplier: 2 },
  legend: { name: 'Légende', icon: Lightning, color: 'text-purple-600', multiplier: 3 },
  mythic: { name: 'Mythique', icon: Fire, color: 'text-red-600', multiplier: 5 }
};

const questDatabase: Quest[] = [
  // Quêtes Professionnelles
  {
    id: 'prof-presentation',
    title: 'Maître Orateur',
    description: 'Préparez et donnez une présentation parfaite qui marquera les esprits',
    category: 'professional',
    difficulty: 'warrior',
    estMinutes: 120,
    xpReward: 150,
    requirements: ['Préparer un plan détaillé', 'Répéter 3 fois', 'Obtenir 90%+ de satisfaction'],
    status: 'available',
    progress: 0,
    maxProgress: 3,
    unlockLevel: 5,
    rewards: { xp: 150, coins: 50, title: 'Orateur Inspirant' },
    flavor: 'Votre voix peut changer le monde. Utilisez-la sagement.',
    icon: Target
  },
  {
    id: 'prof-leadership',
    title: 'Chef de Guerre',
    description: 'Menez une équipe vers la victoire dans un projet complexe',
    category: 'professional',
    difficulty: 'champion',
    estMinutes: 300,
    xpReward: 400,
    requirements: ['Former une équipe', 'Définir les objectifs', 'Atteindre 100% des KPIs', 'Maintenir le moral à 80%+'],
    status: 'locked',
    progress: 0,
    maxProgress: 4,
    unlockLevel: 15,
    prerequisites: ['prof-presentation'],
    rewards: { xp: 400, coins: 150, title: 'Leader Légendaire' },
    flavor: 'Un vrai leader ne crée pas des suiveurs, mais d\'autres leaders.',
    icon: Crown
  },

  // Quêtes Personnelles
  {
    id: 'personal-morning',
    title: 'Aurore Parfaite',
    description: 'Créez et maintenez une routine matinale transformatrice',
    category: 'personal',
    difficulty: 'novice',
    estMinutes: 21,
    xpReward: 100,
    requirements: ['Lever 6h pendant 21 jours', 'Méditation 10min', 'Gratitude journal', 'Exercice 15min'],
    status: 'available',
    progress: 0,
    maxProgress: 21,
    unlockLevel: 1,
    rewards: { xp: 100, coins: 30, title: 'Maître de l\'Aurore' },
    flavor: 'Chaque lever de soleil est une nouvelle chance de devenir meilleur.',
    icon: Star
  },
  {
    id: 'personal-fear',
    title: 'Tueur de Dragons',
    description: 'Affrontez et surmontez votre plus grande peur personnelle',
    category: 'personal',
    difficulty: 'legend',
    estMinutes: 180,
    xpReward: 800,
    requirements: ['Identifier la peur', 'Créer un plan d\'action', 'Affronter 5 fois', 'Victoire totale'],
    status: 'locked',
    progress: 0,
    maxProgress: 4,
    unlockLevel: 25,
    rewards: { xp: 800, coins: 300, title: 'Tueur de Dragons' },
    flavor: 'Le courage n\'est pas l\'absence de peur, mais l\'action malgré la peur.',
    icon: Fire
  },

  // Quêtes Santé
  {
    id: 'health-marathon',
    title: 'Endurance Légendaire',
    description: 'Préparez-vous et complétez un marathon ou équivalent',
    category: 'health',
    difficulty: 'champion',
    estMinutes: 600,
    xpReward: 500,
    requirements: ['Plan d\'entraînement 16 semaines', 'Course 42km ou équivalent', 'Temps sous 4h30'],
    status: 'locked',
    progress: 0,
    maxProgress: 3,
    unlockLevel: 20,
    rewards: { xp: 500, coins: 200, title: 'Athlète Légendaire' },
    flavor: 'Votre corps peut supporter presque tout. C\'est votre esprit qu\'il faut convaincre.',
    icon: Mountain
  },
  {
    id: 'health-meditation',
    title: 'Moine Moderne',
    description: 'Maîtrisez l\'art de la méditation profonde',
    category: 'health',
    difficulty: 'warrior',
    estMinutes: 100,
    xpReward: 200,
    requirements: ['30 jours consécutifs', '20min minimum', 'État méditatif profond'],
    status: 'available',
    progress: 0,
    maxProgress: 30,
    unlockLevel: 8,
    rewards: { xp: 200, coins: 75, title: 'Sage Intérieur' },
    flavor: 'Dans le silence de l\'esprit, on trouve la vraie force.',
    icon: Shield
  },

  // Quêtes Apprentissage
  {
    id: 'learning-skill',
    title: 'Polymathe Renaissance',
    description: 'Maîtrisez une nouvelle compétence complexe en 90 jours',
    category: 'learning',
    difficulty: 'champion',
    estMinutes: 270,
    xpReward: 350,
    requirements: ['Choisir la compétence', '3h/jour pendant 90 jours', 'Certification ou projet final'],
    status: 'available',
    progress: 0,
    maxProgress: 90,
    unlockLevel: 12,
    rewards: { xp: 350, coins: 120, title: 'Maître Polymathe' },
    flavor: 'L\'apprentissage est le seul investissement qui paie toujours.',
    icon: Map
  },

  // Quêtes Sociales
  {
    id: 'social-network',
    title: 'Bâtisseur de Ponts',
    description: 'Créez un réseau professionnel puissant et authentique',
    category: 'social',
    difficulty: 'warrior',
    estMinutes: 150,
    xpReward: 250,
    requirements: ['50 nouvelles connexions qualité', '10 mentors identifiés', '5 collaborations initiées'],
    status: 'available',
    progress: 0,
    maxProgress: 65,
    unlockLevel: 10,
    rewards: { xp: 250, coins: 100, title: 'Connecteur Légendaire' },
    flavor: 'Votre réseau est votre fortune. Cultivez-le avec authenticité.',
    icon: Users
  }
];

export const BossLevelGrit: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    level: 8,
    xp: 1250,
    coins: 450,
    title: 'Aventurier Ambitieux',
    artifacts: [],
    completedQuests: ['personal-morning'],
    currentStreak: 5,
    achievements: ['first-quest', 'streak-warrior']
  });
  const [quests, setQuests] = useState<Quest[]>(questDatabase);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);

  useEffect(() => {
    // Mettre à jour le statut des quêtes selon le niveau et les prérequis
    const updatedQuests = questDatabase.map(quest => {
      let status = quest.status;
      
      if (quest.unlockLevel > playerProfile.level) {
        status = 'locked';
      } else if (quest.prerequisites) {
        const hasPrerequisites = quest.prerequisites.every(prereq => 
          playerProfile.completedQuests.includes(prereq)
        );
        status = hasPrerequisites ? 'available' : 'locked';
      } else {
        status = playerProfile.completedQuests.includes(quest.id) ? 'completed' : 'available';
      }
      
      return { ...quest, status };
    });
    
    setQuests(updatedQuests);
  }, [playerProfile]);

  const startQuest = (quest: Quest) => {
    setQuests(prev => 
      prev.map(q => 
        q.id === quest.id 
          ? { ...q, status: 'in-progress' as const }
          : q
      )
    );
    setShowQuestModal(false);
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests(prev => 
      prev.map(quest => {
        if (quest.id === questId) {
          const newProgress = Math.min(progress, quest.maxProgress);
          const isCompleted = newProgress >= quest.maxProgress;
          
          if (isCompleted && quest.status !== 'completed') {
            // Récompenses
            setPlayerProfile(profile => ({
              ...profile,
              xp: profile.xp + quest.rewards.xp,
              coins: profile.coins + quest.rewards.coins,
              completedQuests: [...profile.completedQuests, questId],
              title: quest.rewards.title || profile.title
            }));
            
            // Animation de victoire
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFD700', '#FFA500', '#FF6347']
            });
          }
          
          return {
            ...quest,
            progress: newProgress,
            status: isCompleted ? 'completed' as const : quest.status
          };
        }
        return quest;
      })
    );
  };

  const getFilteredQuests = () => {
    if (selectedCategory === 'all') return quests;
    return quests.filter(quest => quest.category === selectedCategory);
  };

  const calculateLevelProgress = () => {
    const baseXP = 100;
    const currentLevelXP = baseXP * Math.pow(1.3, playerProfile.level - 1);
    const nextLevelXP = baseXP * Math.pow(1.3, playerProfile.level);
    const progressXP = playerProfile.xp - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    
    return {
      current: Math.max(0, progressXP),
      needed: neededXP,
      percentage: Math.min(100, (progressXP / neededXP) * 100)
    };
  };

  const levelProgress = calculateLevelProgress();

  return (
    <div className="space-y-6">
      {/* Header avec profil joueur */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Boss Level Grit</h2>
          <p className="text-muted-foreground">Forgez votre caractère à travers des quêtes épiques</p>
        </div>
        
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-lg font-bold">Niveau {playerProfile.level}</p>
                    <p className="text-sm text-muted-foreground">{playerProfile.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{playerProfile.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">🪙</span>
                  <span className="font-semibold">{playerProfile.coins}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progression</span>
                <span>{levelProgress.current}/{levelProgress.needed} XP</span>
              </div>
              <Progress value={levelProgress.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">{playerProfile.completedQuests.length}</p>
            <p className="text-sm text-muted-foreground">Quêtes Complétées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Fire className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold">{playerProfile.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Série Jours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{quests.filter(q => q.status === 'in-progress').length}</p>
            <p className="text-sm text-muted-foreground">Quêtes Actives</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">{playerProfile.achievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par catégories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          {questCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              <category.icon className="h-4 w-4 mr-1" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredQuests().map(quest => {
              const category = questCategories.find(c => c.id === quest.category);
              const difficulty = difficultyConfig[quest.difficulty];
              const CategoryIcon = category?.icon || Target;
              const DifficultyIcon = difficulty.icon;
              
              return (
                <Card 
                  key={quest.id}
                  className={`relative overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                    quest.status === 'completed' ? 'ring-2 ring-green-500' : 
                    quest.status === 'in-progress' ? 'ring-2 ring-blue-500' :
                    quest.status === 'locked' ? 'opacity-60' : ''
                  }`}
                  onClick={() => {
                    setSelectedQuest(quest);
                    setShowQuestModal(true);
                  }}
                >
                  {quest.status === 'locked' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  
                  {quest.status === 'completed' && (
                    <div className="absolute top-2 right-2 z-10">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${category?.bg} opacity-10`} />
                  
                  <CardHeader className="pb-3 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-br ${category?.bg}`}>
                          <CategoryIcon className={`h-5 w-5 ${category?.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{quest.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <DifficultyIcon className={`h-3 w-3 mr-1 ${difficulty.color}`} />
                              {difficulty.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              +{quest.xpReward} XP
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 relative">
                    <p className="text-sm text-muted-foreground italic">"{quest.flavor}"</p>
                    <p className="text-sm">{quest.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{quest.estMinutes} minutes</span>
                    </div>

                    {quest.status === 'in-progress' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{quest.progress}/{quest.maxProgress}</span>
                        </div>
                        <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <p className="text-xs font-medium">Objectifs:</p>
                      {quest.requirements.slice(0, 2).map((req, index) => (
                        <p key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                          {req}
                        </p>
                      ))}
                      {quest.requirements.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{quest.requirements.length - 2} autres objectifs
                        </p>
                      )}
                    </div>

                    {quest.status === 'locked' && (
                      <div className="text-xs text-muted-foreground">
                        <Lock className="h-3 w-3 inline mr-1" />
                        Niveau {quest.unlockLevel} requis
                        {quest.prerequisites && (
                          <p>Prérequis: {quest.prerequisites.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Détails de Quête */}
      <AnimatePresence>
        {showQuestModal && selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowQuestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedQuest.title}</h3>
                    <p className="text-muted-foreground italic">"{selectedQuest.flavor}"</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowQuestModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <p className="text-base">{selectedQuest.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold">Difficulté</p>
                    <Badge variant="outline">
                      {difficultyConfig[selectedQuest.difficulty].name}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold">Temps Estimé</p>
                    <p className="text-sm">{selectedQuest.estMinutes} minutes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Objectifs à Atteindre</p>
                  <ul className="space-y-1">
                    {selectedQuest.requirements.map((req, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Récompenses</p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Gem className="h-4 w-4 text-blue-600" />
                      {selectedQuest.rewards.xp} XP
                    </span>
                    <span className="flex items-center gap-1">
                      🪙 {selectedQuest.rewards.coins} Pièces
                    </span>
                    {selectedQuest.rewards.title && (
                      <span className="flex items-center gap-1">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        {selectedQuest.rewards.title}
                      </span>
                    )}
                  </div>
                </div>

                {selectedQuest.status === 'in-progress' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{selectedQuest.progress}/{selectedQuest.maxProgress}</span>
                    </div>
                    <Progress value={(selectedQuest.progress / selectedQuest.maxProgress) * 100} className="h-3" />
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => updateQuestProgress(selectedQuest.id, selectedQuest.progress + 1)}
                        disabled={selectedQuest.progress >= selectedQuest.maxProgress}
                      >
                        Progresser (+1)
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuestProgress(selectedQuest.id, selectedQuest.maxProgress)}
                      >
                        Terminer
                      </Button>
                    </div>
                  </div>
                )}

                {selectedQuest.status === 'available' && (
                  <Button onClick={() => startQuest(selectedQuest)} className="w-full">
                    <Sword className="mr-2 h-4 w-4" />
                    Commencer la Quête
                  </Button>
                )}

                {selectedQuest.status === 'locked' && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Niveau {selectedQuest.unlockLevel} requis pour débloquer
                    </p>
                  </div>
                )}

                {selectedQuest.status === 'completed' && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-green-800">Quête Accomplie!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BossLevelGrit;