
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Zap, Star, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const AmbitionArcadePage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const ambitionGoals = [
    {
      id: 'leadership',
      title: 'Leadership Émotionnel',
      description: 'Développer ses compétences de leader avec intelligence émotionnelle',
      progress: 65,
      level: 3,
      xp: 1250,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      id: 'resilience',
      title: 'Résilience Pro',
      description: 'Construire une résistance mentale face aux défis',
      progress: 40,
      level: 2,
      xp: 800,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      id: 'creativity',
      title: 'Créativité Boost',
      description: 'Libérer son potentiel créatif et innovant',
      progress: 80,
      level: 4,
      xp: 1600,
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      id: 'communication',
      title: 'Maître Communicant',
      description: 'Perfectionner ses compétences de communication',
      progress: 25,
      level: 1,
      xp: 300,
      color: 'bg-gradient-to-r from-green-500 to-teal-500'
    }
  ];

  const challenges = [
    { name: 'Défi du Matin', description: 'Méditation de 10 min', points: 50, completed: true },
    { name: 'Leader du Jour', description: 'Prendre une initiative', points: 100, completed: false },
    { name: 'Innovation Express', description: 'Proposer une idée créative', points: 75, completed: true },
    { name: 'Communication +', description: 'Feedback constructif à un collègue', points: 80, completed: false }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 1) % 101);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ambition Arcade
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transformez vos ambitions en réalisations avec des défis gamifiés
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">Level 12</div>
              <div className="text-sm text-gray-600">Niveau Actuel</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">3,950</div>
              <div className="text-sm text-gray-600">XP Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">28</div>
              <div className="text-sm text-gray-600">Badges</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">4/6</div>
              <div className="text-sm text-gray-600">Objectifs</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              Objectifs d'Ambition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambitionGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedGoal === goal.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedGoal(goal.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        </div>
                        <Badge variant="secondary">Lvl {goal.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className={`h-2 rounded-full ${goal.color} opacity-20`}>
                          <div 
                            className={`h-full rounded-full ${goal.color}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>{goal.progress}% complété</span>
                          <span className="font-medium">{goal.xp} XP</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          variant={selectedGoal === goal.id ? "default" : "outline"}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continuer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily Challenges */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-600" />
              Défis du Jour
            </h2>
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{challenge.name}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={challenge.completed ? "default" : "secondary"}>
                            {challenge.points} pts
                          </Badge>
                          {challenge.completed && (
                            <Badge variant="outline" className="text-green-600">
                              ✓ Complété
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!challenge.completed && (
                        <Button size="sm" variant="outline">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Ring */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-center">Progression Journalière</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                      className="text-purple-600 transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                  </div>
                </div>
                <p className="text-gray-600">Objectifs quotidiens</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbitionArcadePage;
