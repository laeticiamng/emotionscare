
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Calendar,
  Users,
  Gift,
  Award,
  TrendingUp,
  Flame,
  Medal,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const GamificationPage: React.FC = () => {
  const { toast } = useToast();
  const [userLevel, setUserLevel] = useState(15);
  const [totalXP, setTotalXP] = useState(2847);
  const [xpToNextLevel, setXpToNextLevel] = useState(153);
  const [currentStreak, setCurrentStreak] = useState(12);
  
  // États pour les défis et tournois
  const [activeChallenges, setActiveChallenges] = useState([
    {
      id: 'daily-meditation',
      title: 'Méditation Quotidienne',
      description: 'Méditez 10 minutes par jour pendant 7 jours',
      progress: 5,
      target: 7,
      reward: 150,
      type: 'daily',
      difficulty: 'facile',
      timeLeft: '2 jours',
      participants: 1847,
      category: 'bien-être'
    },
    {
      id: 'emotion-master',
      title: 'Maître des Émotions',
      description: 'Effectuez 20 scans émotionnels avec un score > 80',
      progress: 12,
      target: 20,
      reward: 300,
      type: 'weekly',
      difficulty: 'moyen',
      timeLeft: '4 jours',
      participants: 923,
      category: 'analyse'
    },
    {
      id: 'social-butterfly',
      title: 'Papillon Social',
      description: 'Interagissez avec 10 membres de la communauté',
      progress: 3,
      target: 10,
      reward: 200,
      type: 'weekly',
      difficulty: 'facile',
      timeLeft: '6 jours',
      participants: 1205,
      category: 'social'
    }
  ]);

  const [completedChallenges] = useState([
    {
      id: 'first-scan',
      title: 'Premier Scan',
      completedAt: '2024-01-10',
      reward: 50,
      category: 'débutant'
    },
    {
      id: 'week-streak',
      title: 'Série de 7 jours',
      completedAt: '2024-01-12',
      reward: 100,
      category: 'régularité'
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Alex M.', level: 28, xp: 5240, avatar: '👑', streak: 45 },
    { rank: 2, name: 'Sarah L.', level: 25, xp: 4890, avatar: '🌟', streak: 32 },
    { rank: 3, name: 'Marc D.', level: 23, xp: 4560, avatar: '🔥', streak: 28 },
    { rank: 4, name: 'Julie K.', level: 21, xp: 4120, avatar: '⚡', streak: 25 },
    { rank: 5, name: 'Vous', level: userLevel, xp: totalXP, avatar: '😊', streak: currentStreak }
  ]);

  const [badges] = useState([
    {
      id: 'meditation-master',
      name: 'Maître Zen',
      description: '100 sessions de méditation complétées',
      icon: '🧘',
      rarity: 'légendaire',
      progress: 78,
      target: 100,
      unlocked: false
    },
    {
      id: 'emotion-explorer',
      name: 'Explorateur d\'Émotions',
      description: 'Tous les types d\'émotions analysés',
      icon: '🎭',
      rarity: 'rare',
      progress: 100,
      target: 100,
      unlocked: true
    },
    {
      id: 'streak-champion',
      name: 'Champion de Régularité',
      description: '30 jours consécutifs d\'activité',
      icon: '🔥',
      rarity: 'épique',
      progress: 12,
      target: 30,
      unlocked: false
    },
    {
      id: 'community-helper',
      name: 'Aidant Communautaire',
      description: 'Aidé 50 membres de la communauté',
      icon: '🤝',
      rarity: 'rare',
      progress: 23,
      target: 50,
      unlocked: false
    }
  ]);

  const [tournaments] = useState([
    {
      id: 'mindfulness-championship',
      name: 'Championnat de Pleine Conscience',
      description: 'Compétition mensuelle de méditation et bien-être',
      startDate: '2024-01-20',
      endDate: '2024-01-27',
      participants: 2847,
      prize: 'Badge Légendaire + 1000 XP',
      status: 'inscription-ouverte',
      category: 'mensuel',
      difficulty: 'expert'
    },
    {
      id: 'team-harmony',
      name: 'Harmonie d\'Équipe',
      description: 'Défi collaboratif par équipes de 5',
      startDate: '2024-01-25',
      endDate: '2024-02-01',
      participants: 185,
      prize: 'Récompenses exclusives',
      status: 'bientôt',
      category: 'équipe',
      difficulty: 'moyen'
    }
  ]);

  const [rewards] = useState([
    {
      id: 'premium-week',
      name: 'Semaine Premium Gratuite',
      cost: 500,
      description: 'Accès à toutes les fonctionnalités premium',
      category: 'premium',
      available: true
    },
    {
      id: 'custom-avatar',
      name: 'Avatar Personnalisé',
      cost: 200,
      description: 'Créez votre avatar unique',
      category: 'cosmétique',
      available: true
    },
    {
      id: 'meditation-guide',
      name: 'Guide de Méditation Avancé',
      cost: 300,
      description: 'Techniques de méditation exclusives',
      category: 'contenu',
      available: true
    },
    {
      id: 'wellness-consultation',
      name: 'Consultation Bien-être',
      cost: 1000,
      description: 'Session privée avec un expert',
      category: 'service',
      available: false // Nécessite niveau 20+
    }
  ]);

  const getRarityColor = (rarity: string) => {
    const colors = {
      'commun': 'bg-gray-500',
      'rare': 'bg-blue-500',
      'épique': 'bg-purple-500',
      'légendaire': 'bg-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'facile': 'text-green-500',
      'moyen': 'text-orange-500',
      'difficile': 'text-red-500',
      'expert': 'text-purple-500'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-500';
  };

  const handleJoinChallenge = (challengeId: string) => {
    toast({
      title: "Défi rejoint !",
      description: "Vous participez maintenant à ce défi. Bonne chance !",
    });
  };

  const handleJoinTournament = (tournamentId: string) => {
    toast({
      title: "Inscription confirmée !",
      description: "Vous êtes inscrit au tournoi. Préparez-vous !",
    });
  };

  const handleClaimReward = (rewardId: string, cost: number) => {
    if (totalXP >= cost) {
      setTotalXP(prev => prev - cost);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Récompense réclamée !",
        description: "Votre récompense a été ajoutée à votre compte.",
      });
    } else {
      toast({
        title: "XP insuffisants",
        description: `Il vous faut ${cost - totalXP} XP supplémentaires.`,
        variant: "destructive"
      });
    }
  };

  const handleStartQuickChallenge = () => {
    toast({
      title: "Défi rapide démarré !",
      description: "Effectuez un scan émotionnel dans les 5 prochaines minutes pour gagner 25 XP.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header avec profil joueur */}
        <Card className="overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  😊
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Niveau {userLevel}</h1>
                  <p className="text-purple-100 mt-1">
                    {totalXP} points d'expérience • Série de {currentStreak} jours
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span className="text-lg font-bold">Rang #5</span>
                </div>
                <Button variant="secondary" size="sm" onClick={handleStartQuickChallenge}>
                  <Zap className="h-4 w-4 mr-2" />
                  Défi Rapide
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progression vers niveau {userLevel + 1}</span>
                <span>{xpToNextLevel} XP restants</span>
              </div>
              <Progress 
                value={((200 - xpToNextLevel) / 200) * 100} 
                className="h-3 bg-white/20" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{completedChallenges.length}</p>
              <p className="text-sm text-muted-foreground">Défis réussis</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{currentStreak}</p>
              <p className="text-sm text-muted-foreground">Série actuelle</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{badges.filter(b => b.unlocked).length}</p>
              <p className="text-sm text-muted-foreground">Badges obtenus</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Gift className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{totalXP}</p>
              <p className="text-sm text-muted-foreground">XP totaux</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="tournaments">Tournois</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          {/* Onglet Défis */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Défis Actifs</h2>
              <Badge variant="secondary">
                {activeChallenges.length} défis en cours
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {challenge.timeLeft}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{challenge.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-3 w-3" />
                        <span>{challenge.reward} XP</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinChallenge(challenge.id)}
                      disabled={challenge.progress > 0}
                    >
                      {challenge.progress > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continuer
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Commencer
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Défis complétés */}
            <Card>
              <CardHeader>
                <CardTitle>Défis Récemment Complétés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedChallenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{challenge.title}</p>
                          <p className="text-sm text-muted-foreground">Complété le {challenge.completedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">+{challenge.reward} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Tournois */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Tournois & Événements</h2>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Calendrier
              </Button>
            </div>
            
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{tournament.name}</h3>
                          <Badge 
                            variant={tournament.status === 'inscription-ouverte' ? 'default' : 'secondary'}
                          >
                            {tournament.status === 'inscription-ouverte' ? 'Ouvert' : 'Bientôt'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{tournament.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📅 {tournament.startDate} - {tournament.endDate}</span>
                          <span>👥 {tournament.participants} inscrits</span>
                          <span className={getDifficultyColor(tournament.difficulty)}>
                            🏆 {tournament.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg mb-2">🎁 {tournament.prize}</p>
                        <Button 
                          onClick={() => handleJoinTournament(tournament.id)}
                          disabled={tournament.status !== 'inscription-ouverte'}
                        >
                          {tournament.status === 'inscription-ouverte' ? 'S\'inscrire' : 'Bientôt'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Classement */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Classement Général
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div 
                      key={player.rank} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        player.name === 'Vous' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          player.rank === 1 ? 'bg-yellow-500' : 
                          player.rank === 2 ? 'bg-gray-400' : 
                          player.rank === 3 ? 'bg-amber-600' : 
                          'bg-gray-500'
                        }`}>
                          {player.rank}
                        </div>
                        <div className="text-2xl">{player.avatar}</div>  
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">Niveau {player.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{player.xp} XP</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{player.streak} jours</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Badges */}
          <TabsContent value="badges" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Collection de Badges</h2>
              <Badge variant="secondary">
                {badges.filter(b => b.unlocked).length}/{badges.length} obtenus
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <Card key={badge.id} className={`transition-all ${badge.unlocked ? 'hover:shadow-lg' : 'opacity-60'}`}>
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <div className={`text-6xl mb-2 ${!badge.unlocked ? 'grayscale' : ''}`}>
                        {badge.unlocked ? badge.icon : '🔒'}
                      </div>
                      <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${getRarityColor(badge.rarity)}`}></div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{badge.progress}/{badge.target}</span>
                      </div>
                      <Progress value={(badge.progress / badge.target) * 100} />
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={`mt-3 ${badge.unlocked ? 'bg-green-100 text-green-800' : ''}`}
                    >
                      {badge.unlocked ? 'Débloqué' : badge.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Récompenses */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Boutique de Récompenses</h2>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{totalXP} XP disponibles</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} className={`transition-all ${!reward.available ? 'opacity-60' : 'hover:shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                        <Badge variant="outline">{reward.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-600 mb-2">
                          <Star className="h-4 w-4" />
                          <span className="font-bold">{reward.cost} XP</span>
                        </div>
                        {!reward.available && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            <span>Niveau requis</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleClaimReward(reward.id, reward.cost)}
                      disabled={!reward.available || totalXP < reward.cost}
                    >
                      {!reward.available ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Verrouillé
                        </>
                      ) : totalXP < reward.cost ? (
                        'XP insuffisants'
                      ) : (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          Réclamer
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationPage;
