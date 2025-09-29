import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Rocket, Trophy, Star, CheckCircle, Clock, TrendingUp, Gamepad2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personnel' | 'professionnel' | 'bien-etre' | 'apprentissage';
  difficulty: 1 | 2 | 3 | 4 | 5;
  progress: number;
  maxProgress: number;
  deadline?: string;
  xp: number;
  status: 'active' | 'completed' | 'paused';
}

const B2CAmbitionArcadePage: React.FC = () => {
  const [playerXP] = useState(2450);
  const [playerLevel] = useState(8);

  const [goals] = useState<Goal[]>([
    {
      id: 'fitness-challenge',
      title: 'Défi Fitness 30 Jours',
      description: 'Pratiquer une activité physique quotidienne pendant un mois',
      category: 'bien-etre',
      difficulty: 3,
      progress: 18,
      maxProgress: 30,
      deadline: '2024-02-15',
      xp: 300,
      status: 'active'
    },
    {
      id: 'learning-react',
      title: 'Maîtriser React.js',
      description: 'Apprendre les concepts avancés de React et créer un projet',
      category: 'apprentissage',
      difficulty: 4,
      progress: 65,
      maxProgress: 100,
      xp: 500,
      status: 'active'
    },
    {
      id: 'meditation-streak',
      title: 'Méditation Quotidienne',
      description: 'Méditer 10 minutes chaque jour pendant 21 jours',
      category: 'bien-etre',
      difficulty: 2,
      progress: 21,
      maxProgress: 21,
      xp: 200,
      status: 'completed'
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personnel': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'professionnel': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'bien-etre': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'apprentissage': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec stats joueur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-6">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Ambition Arcade
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Transformez vos ambitions en aventures ludiques. Progressez, débloquez des récompenses et atteignez vos objectifs !
          </p>

          {/* Stats du joueur */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">Niveau {playerLevel}</span>
              </div>
              <p className="text-sm text-muted-foreground">Niveau d'ambition</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{playerXP.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Points d'expérience</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{goals.filter(g => g.status === 'completed').length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Objectifs atteints</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">Mes Objectifs</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full transition-all hover:shadow-lg cursor-pointer ${
                    goal.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-950' :
                    goal.status === 'paused' ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: goal.difficulty }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progression</span>
                          <span className="text-sm text-muted-foreground">
                            {goal.progress}/{goal.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(goal.progress / goal.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>

                      {goal.deadline && goal.status !== 'completed' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Échéance: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{goal.xp} XP</span>
                        </div>
                        
                        {goal.status === 'completed' ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terminé
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            disabled={goal.status === 'paused'}
                          >
                            Progresser
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Évolution des Objectifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((goal.progress / goal.maxProgress) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(goal.progress / goal.maxProgress) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Succès à débloquer</h3>
              <p className="text-muted-foreground">
                Continuez à progresser pour débloquer de nouveaux succès !
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CAmbitionArcadePage;