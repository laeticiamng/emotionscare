
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Shield, Heart, Target, Users, Clock, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const BounceBackBattlePage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string>('workplace-stress');

  const scenarios = [
    {
      id: 'workplace-stress',
      title: 'Combat du Stress Professionnel',
      description: 'Affrontez une journée de travail particulièrement stressante',
      difficulty: 'Modéré',
      duration: '15 min',
      participants: 1247,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      situation: 'Vous avez 3 deadlines aujourd\'hui, 5 emails urgents et une réunion inattendue avec votre manager.',
      challenges: [
        'Priorisez vos tâches efficacement',
        'Gérez l\'interruption de la réunion',
        'Maintenez votre calme face aux emails urgents',
        'Trouvez un moment pour une micro-pause'
      ]
    },
    {
      id: 'relationship-conflict',
      title: 'Bataille des Relations',
      description: 'Naviguez dans un conflit interpersonnel complexe',
      difficulty: 'Avancé',
      duration: '20 min',
      participants: 892,
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      situation: 'Un conflit éclate avec un collègue proche sur un projet important. Les tensions montent.',
      challenges: [
        'Écoutez activement le point de vue adverse',
        'Exprimez vos sentiments sans agressivité',
        'Trouvez un terrain d\'entente',
        'Préservez la relation à long terme'
      ]
    },
    {
      id: 'burnout-recovery',
      title: 'Résurrection Anti-Burnout',
      description: 'Remontez la pente après une période d\'épuisement',
      difficulty: 'Expert',
      duration: '25 min',
      participants: 634,
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      situation: 'Vous ressentez tous les signes du burnout : fatigue chronique, cynisme, perte de motivation.',
      challenges: [
        'Reconnaissez les signaux d\'alarme',
        'Établissez des limites claires',
        'Redéfinissez vos priorités',
        'Créez un plan de récupération durable'
      ]
    }
  ];

  const techniques = [
    {
      name: 'Respiration 4-7-8',
      description: 'Technique de respiration pour calmer instantanément',
      icon: Zap,
      effectiveness: 92
    },
    {
      name: 'Reframing Cognitif',
      description: 'Changez votre perspective sur la situation',
      icon: TrendingUp,
      effectiveness: 87
    },
    {
      name: 'Ancrage Sensoriel',
      description: 'Reconnectez-vous au moment présent',
      icon: Target,
      effectiveness: 84
    },
    {
      name: 'Communication Assertive',
      description: 'Exprimez-vous clairement et respectueusement',
      icon: Users,
      effectiveness: 89
    }
  ];

  const currentStats = {
    battlesWon: 23,
    winRate: 78,
    streakDays: 12,
    totalPoints: 2847,
    rank: 'Resilient Warrior'
  };

  const recentBattles = [
    { scenario: 'Stress Professionnel', result: 'Victoire', points: 150, date: 'Aujourd\'hui' },
    { scenario: 'Conflit Familial', result: 'Victoire', points: 120, date: 'Hier' },
    { scenario: 'Surcharge de Travail', result: 'Défaite', points: 50, date: 'Il y a 2 jours' },
    { scenario: 'Anxiété Sociale', result: 'Victoire', points: 180, date: 'Il y a 3 jours' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Zap className="h-12 w-12 text-yellow-400 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Bounce Back Battle
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Affrontez des situations de vie réelles et développez votre résilience émotionnelle. 
              Chaque bataille vous rend plus fort et plus sage.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{currentStats.battlesWon}</div>
                <div className="text-sm text-gray-400">Victoires</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{currentStats.winRate}%</div>
                <div className="text-sm text-gray-400">Taux de Réussite</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{currentStats.streakDays}</div>
                <div className="text-sm text-gray-400">Série Actuelle</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{currentStats.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Points Total</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-lg font-bold text-orange-400">{currentStats.rank}</div>
                <div className="text-sm text-gray-400">Rang</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="scenarios" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="scenarios">Scénarios de Bataille</TabsTrigger>
              <TabsTrigger value="techniques">Techniques</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scenario Selection */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Choisissez Votre Bataille</h2>
                  {scenarios.map((scenario, index) => (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`bg-slate-800 border-slate-700 cursor-pointer transition-all duration-300 ${
                          activeScenario === scenario.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-750'
                        }`}
                        onClick={() => setActiveScenario(scenario.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 bg-gradient-to-r ${scenario.color} rounded-full flex items-center justify-center mr-3`}>
                                <scenario.icon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-white text-lg">{scenario.title}</CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">{scenario.difficulty}</Badge>
                                  <span className="text-sm text-gray-400 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {scenario.duration}
                                  </span>
                                  <span className="text-sm text-gray-400 flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {scenario.participants}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="text-gray-300">
                            {scenario.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Scenario Details */}
                <div className="space-y-6">
                  {scenarios
                    .filter(s => s.id === activeScenario)
                    .map(scenario => (
                      <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Card className="bg-slate-800 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <scenario.icon className="h-6 w-6 mr-2 text-blue-400" />
                              {scenario.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div>
                              <h4 className="text-white font-semibold mb-2">Situation :</h4>
                              <p className="text-gray-300 bg-slate-700 p-4 rounded-lg">
                                {scenario.situation}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-semibold mb-3">Défis à Relever :</h4>
                              <ul className="space-y-2">
                                {scenario.challenges.map((challenge, index) => (
                                  <li key={index} className="flex items-center text-gray-300">
                                    <Target className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                                    {challenge}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <Button 
                              className={`w-full bg-gradient-to-r ${scenario.color} hover:opacity-90 transition-opacity`}
                              size="lg"
                            >
                              Commencer la Bataille
                              <Zap className="ml-2 h-5 w-5" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="techniques" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Arsenal de Techniques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {techniques.map((technique, index) => (
                    <motion.div
                      key={technique.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <technique.icon className="h-8 w-8 text-blue-400 mr-3" />
                              <div>
                                <CardTitle className="text-white">{technique.name}</CardTitle>
                                <CardDescription className="text-gray-300">
                                  {technique.description}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Efficacité</span>
                              <span className="text-white">{technique.effectiveness}%</span>
                            </div>
                            <Progress value={technique.effectiveness} className="h-2" />
                          </div>
                          <Button variant="outline" className="w-full mt-4">
                            Apprendre la Technique
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Historique des Batailles</h2>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentBattles.map((battle, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${
                              battle.result === 'Victoire' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                            <div>
                              <div className="text-white font-semibold">{battle.scenario}</div>
                              <div className="text-sm text-gray-400">{battle.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              battle.result === 'Victoire' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {battle.result}
                            </div>
                            <div className="text-yellow-400 text-sm">+{battle.points} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default BounceBackBattlePage;
