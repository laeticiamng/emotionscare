import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Target, TrendingUp, Calendar, Star, Award, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const B2CTeamsPageEnhanced = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [teamStats, setTeamStats] = useState(null);
  const [teammates, setTeammates] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Données simulées d'équipe
  const mockteammates = [
    {
      id: 1,
      name: 'Sarah Manager',
      role: 'Team Lead',
      avatar: '',
      status: 'active',
      wellbeingScore: 85,
      streakDays: 12,
      currentMood: 'motivée',
      contributions: 45,
      badges: ['leadership', 'wellness-champion']
    },
    {
      id: 2,
      name: 'Alex Dev',
      role: 'Developer',
      avatar: '',
      status: 'active',
      wellbeingScore: 72,
      streakDays: 8,
      currentMood: 'concentré',
      contributions: 32,
      badges: ['consistency', 'team-player']
    },
    {
      id: 3,
      name: 'Maria Design',
      role: 'UX Designer',
      avatar: '',
      status: 'away',
      wellbeingScore: 78,
      streakDays: 5,
      currentMood: 'créative',
      contributions: 28,
      badges: ['creativity', 'positive-vibes']
    },
    {
      id: 4,
      name: 'Tom Analytics',
      role: 'Data Analyst',
      avatar: '',
      status: 'active',
      wellbeingScore: 81,
      streakDays: 15,
      currentMood: 'analytique',
      contributions: 38,
      badges: ['consistency', 'insights']
    }
  ];

  const mockChallenges = [
    {
      id: 1,
      title: 'Défi Bien-être Équipe',
      description: 'Objectif collectif de 1000 points de bien-être cette semaine',
      progress: 76,
      target: 1000,
      current: 760,
      daysLeft: 3,
      participants: 4,
      reward: 'Afternoon Team Building'
    },
    {
      id: 2,
      title: 'Marathon Méditation',
      description: '500 minutes de méditation collective ce mois-ci',
      progress: 62,
      target: 500,
      current: 310,
      daysLeft: 12,
      participants: 4,
      reward: 'Wellness Workshop'
    }
  ];

  const mockAchievements = [
    {
      id: 1,
      title: 'Super Équipe',
      description: 'Tous les membres actifs pendant une semaine',
      icon: '🏆',
      unlockedAt: '2024-01-15',
      rarity: 'rare'
    },
    {
      id: 2,
      title: 'Cohésion Parfaite',
      description: 'Score de bien-être moyen > 80% pendant un mois',
      icon: '⭐',
      unlockedAt: '2024-01-10',
      rarity: 'epic'
    }
  ];

  const mockTeamStats = {
    averageWellbeing: 79,
    totalActiveMembers: 4,
    teamStreak: 8,
    monthlyGoal: 85,
    weeklyActivity: [
      { day: 'Lun', score: 75 },
      { day: 'Mar', score: 82 },
      { day: 'Mer', score: 78 },
      { day: 'Jeu', score: 85 },
      { day: 'Ven', score: 79 },
      { day: 'Sam', score: 71 },
      { day: 'Dim', score: 73 }
    ]
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'leadership': 'bg-purple-500',
      'wellness-champion': 'bg-green-500',
      'consistency': 'bg-blue-500',
      'team-player': 'bg-orange-500',
      'creativity': 'bg-pink-500',
      'positive-vibes': 'bg-yellow-500',
      'insights': 'bg-indigo-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-500' : 'bg-yellow-500';
  };

  useEffect(() => {
    setTeammates(mockteammates);
    setChallenges(mockChallenges);
    setAchievements(mockAchievements);
    setTeamStats(mockTeamStats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Équipe Connectée
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les progrès de votre équipe et collaborez pour un bien-être collectif optimal
          </p>
        </motion.div>

        {/* Stats globales d'équipe */}
        {teamStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 mb-1">{teamStats.averageWellbeing}%</div>
                <div className="text-sm text-gray-600">Bien-être moyen</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 mb-1">{teamStats.totalActiveMembers}</div>
                <div className="text-sm text-gray-600">Membres actifs</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600 mb-1">{teamStats.teamStreak}</div>
                <div className="text-sm text-gray-600">Jours consécutifs</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600 mb-1">{teamStats.monthlyGoal}%</div>
                <div className="text-sm text-gray-600">Objectif mensuel</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Membres
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Défis
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Succès
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Graphique d'activité hebdomadaire */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Activité de la semaine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamStats?.weeklyActivity.map((day, index) => (
                        <div key={day.day} className="flex items-center gap-4">
                          <span className="w-8 text-sm font-medium">{day.day}</span>
                          <div className="flex-1">
                            <Progress value={day.score} className="h-3" />
                          </div>
                          <span className="w-10 text-sm text-gray-600">{day.score}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Défis en cours */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      Défis en cours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {challenges.slice(0, 2).map((challenge) => (
                      <div key={challenge.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{challenge.title}</h4>
                          <Badge variant="outline">{challenge.daysLeft} jours</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{challenge.current} / {challenge.target}</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Membres de l'équipe */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teammates.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 mx-auto mb-3">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(member.status)} border-2 border-white`} />
                        </div>
                        
                        <h3 className="font-semibold mb-1">{member.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                        
                        <Badge variant="secondary" className="mb-3">
                          {member.currentMood}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Bien-être</span>
                            <span>{member.wellbeingScore}%</span>
                          </div>
                          <Progress value={member.wellbeingScore} className="h-2" />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Streak:</span>
                          <span className="font-semibold">{member.streakDays} jours</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Contributions:</span>
                          <span className="font-semibold">{member.contributions}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {member.badges.map((badge) => (
                            <Badge key={badge} className={`${getBadgeColor(badge)} text-white text-xs`}>
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Défis d'équipe */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{challenge.title}</span>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {challenge.participants} participants
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">{challenge.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{challenge.current}</div>
                          <div className="text-xs text-gray-600">Actuel</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{challenge.target}</div>
                          <div className="text-xs text-gray-600">Objectif</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-3" />
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-500">
                          🎁 {challenge.reward}
                        </span>
                        <Badge variant="outline">
                          {challenge.daysLeft} jours restants
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Succès d'équipe */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{achievement.icon}</div>
                      <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                      
                      <Badge 
                        className={`mb-3 ${
                          achievement.rarity === 'epic' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                            : 'bg-gradient-to-r from-blue-500 to-green-500'
                        } text-white`}
                      >
                        {achievement.rarity === 'epic' ? '🌟 Épique' : '⭐ Rare'}
                      </Badge>
                      
                      <div className="text-xs text-gray-500">
                        Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CTeamsPageEnhanced;