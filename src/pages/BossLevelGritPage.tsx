
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Target, Flame, Trophy, Star, Zap, Shield, Sword } from 'lucide-react';
import { motion } from 'framer-motion';

const BossLevelGritPage: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const challenges = [
    {
      id: 'stress-warrior',
      title: 'Guerrier Anti-Stress',
      description: 'Maîtrisez 7 techniques de gestion du stress en 14 jours',
      difficulty: 'Boss',
      icon: Shield,
      progress: 45,
      reward: 500,
      timeLeft: '8 jours restants',
      requirements: [
        'Compléter 3 sessions de respiration guidée',
        'Identifier et noter 5 déclencheurs de stress',
        'Pratiquer 1 technique de relaxation par jour',
        'Maintenir un score de bien-être > 7/10'
      ],
      status: 'active'
    },
    {
      id: 'emotional-master',
      title: 'Maître des Émotions',
      description: 'Développez une intelligence émotionnelle exceptionnelle',
      difficulty: 'Légende',
      icon: Crown,
      progress: 78,
      reward: 750,
      timeLeft: '3 jours restants',
      requirements: [
        'Scanner vos émotions 2x/jour pendant 21 jours',
        'Identifier 10 patterns émotionnels personnels',
        'Compléter le module de régulation émotionnelle',
        'Aider 3 membres de la communauté'
      ],
      status: 'active'
    },
    {
      id: 'burnout-breaker',
      title: 'Briseur de Burnout',
      description: 'Prévenez et surmontez l\'épuisement professionnel',
      difficulty: 'Epic',
      icon: Flame,
      progress: 20,
      reward: 600,
      timeLeft: '12 jours restants',
      requirements: [
        'Établir des limites travail/vie privée claires',
        'Pratiquer 10 sessions VR de décompression',
        'Compléter l\'évaluation risque burnout',
        'Créer un plan de prévention personnalisé'
      ],
      status: 'available'
    },
    {
      id: 'resilience-titan',
      title: 'Titan de la Résilience',
      description: 'Développez une résilience mentale inébranlable',
      difficulty: 'Mythique',
      icon: Sword,
      progress: 0,
      reward: 1000,
      timeLeft: 'Déblocage requis',
      requirements: [
        'Compléter les 3 défis Boss précédents',
        'Maintenir une streak de 30 jours',
        'Mentorat de 5 nouveaux utilisateurs',
        'Score parfait aux évaluations finales'
      ],
      status: 'locked'
    }
  ];

  const achievements = [
    { name: 'Premier Pas', icon: Star, unlocked: true },
    { name: 'Streak 7 Jours', icon: Flame, unlocked: true },
    { name: 'Mentor', icon: Crown, unlocked: true },
    { name: 'Explorateur VR', icon: Zap, unlocked: false },
    { name: 'Maître Zen', icon: Shield, unlocked: false }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Boss': return 'from-orange-500 to-red-500';
      case 'Légende': return 'from-purple-500 to-pink-500';
      case 'Epic': return 'from-blue-500 to-purple-500';
      case 'Mythique': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'available': return 'bg-blue-500';
      case 'locked': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-12 w-12 text-yellow-400 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Boss Level Grit
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Relevez les défis les plus exigeants et développez une résilience mentale de niveau légendaire. 
              Seuls les plus déterminés atteignent le sommet.
            </p>
            <div className="flex items-center justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400">1,247</div>
                <div className="text-sm text-gray-400">Points Gagnés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">12</div>
                <div className="text-sm text-gray-400">Défis Complétés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">Légende</div>
                <div className="text-sm text-gray-400">Rang Actuel</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Challenges */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold">Défis Boss Actifs</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-300 ${
                  challenge.status === 'locked' ? 'opacity-60' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} rounded-full flex items-center justify-center mr-4`}>
                          <challenge.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                          <Badge className={`${getStatusColor(challenge.status)} text-white mt-1`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">{challenge.reward} pts</div>
                        <div className="text-xs text-gray-400">{challenge.timeLeft}</div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-300 mt-2">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progression</span>
                          <span className="text-white">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Objectifs :</h4>
                        <ul className="space-y-1">
                          {challenge.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-center text-sm text-gray-300">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                reqIndex < challenge.progress / 25 ? 'bg-green-400' : 'bg-gray-600'
                              }`}></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className={`w-full ${
                          challenge.status === 'locked' 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : challenge.status === 'active'
                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                        disabled={challenge.status === 'locked'}
                        onClick={() => setSelectedChallenge(challenge.id)}
                      >
                        {challenge.status === 'locked' ? 'Verrouillé' : 
                         challenge.status === 'active' ? 'Continuer' : 'Commencer'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Star className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold">Accomplissements Légendaires</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`text-center p-4 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                    : 'bg-slate-700 border border-slate-600'
                }`}
              >
                <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${
                  achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                }`} />
                <h3 className={`text-sm font-semibold ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Target className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold">Hall of Fame</h2>
          </div>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'EmotionMaster', points: 2847, badge: 'Mythique' },
                  { rank: 2, name: 'ZenWarrior', points: 2156, badge: 'Légende' },
                  { rank: 3, name: 'MindfulChamp', points: 1892, badge: 'Légende' },
                  { rank: 4, name: 'Vous', points: 1247, badge: 'Légende' },
                  { rank: 5, name: 'StressSlayer', points: 1089, badge: 'Epic' }
                ].map((player, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === 'Vous' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-700'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        player.rank === 1 ? 'bg-yellow-500' :
                        player.rank === 2 ? 'bg-gray-300' :
                        player.rank === 3 ? 'bg-orange-400' : 'bg-slate-600'
                      }`}>
                        <span className="text-sm font-bold text-white">#{player.rank}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{player.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {player.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-yellow-400 font-bold">{player.points.toLocaleString()} pts</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BossLevelGritPage;
