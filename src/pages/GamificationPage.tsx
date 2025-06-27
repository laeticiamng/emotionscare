
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Gift,
  Medal,
  Flame,
  Crown,
  Award
} from 'lucide-react';

const GamificationPage: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const achievements = [
    { id: 1, name: 'Premier Scan', icon: Target, unlocked: true, date: '2024-01-15' },
    { id: 2, name: 'Série de 7 jours', icon: Flame, unlocked: true, date: '2024-01-20' },
    { id: 3, name: 'Maître de la Méditation', icon: Crown, unlocked: false, progress: 75 },
    { id: 4, name: 'Explorateur VR', icon: Award, unlocked: false, progress: 40 }
  ];

  const challenges = [
    {
      id: 'daily-checkin',
      title: 'Check-in Quotidien',
      description: 'Effectuez votre scan émotionnel quotidien',
      progress: 5,
      total: 7,
      reward: '50 points',
      difficulty: 'Facile'
    },
    {
      id: 'meditation-week',
      title: 'Semaine Méditation',
      description: 'Méditez 5 fois cette semaine',
      progress: 3,
      total: 5,
      reward: '200 points',
      difficulty: 'Moyen'
    },
    {
      id: 'vr-explorer',
      title: 'Explorateur VR',
      description: 'Essayez 3 expériences VR différentes',
      progress: 1,
      total: 3,
      reward: '150 points',
      difficulty: 'Moyen'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Emma Martin', points: 2450, avatar: '👩' },
    { rank: 2, name: 'Vous', points: 1890, avatar: '🙋‍♂️', isUser: true },
    { rank: 3, name: 'Lucas Dubois', points: 1650, avatar: '👨' },
    { rank: 4, name: 'Sophie Chen', points: 1420, avatar: '👱‍♀️' },
    { rank: 5, name: 'Alex Rivera', points: 1200, avatar: '👨‍🦱' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Gamification
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Progressez dans votre bien-être en relevant des défis et en gagnant des récompenses
          </p>
        </div>

        {/* Stats utilisateur */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,890</div>
              <p className="text-yellow-100">Points totaux</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">Niveau 12</div>
              <p className="text-blue-100">Rang actuel</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">7 jours</div>
              <p className="text-green-100">Série actuelle</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-400 to-purple-500 text-white">
            <CardContent className="p-6 text-center">
              <Medal className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">8</div>
              <p className="text-purple-100">Succès débloqués</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Défis actifs */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Défis Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedChallenge === challenge.id
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedChallenge(challenge.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge variant={challenge.difficulty === 'Facile' ? 'secondary' : 'default'}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {challenge.progress}/{challenge.total} complété
                        </span>
                        <span className="text-sm text-yellow-600 font-medium">
                          🏆 {challenge.reward}
                        </span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Succès */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Succès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg text-center ${
                          achievement.unlocked
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <IconComponent 
                          className={`h-8 w-8 mx-auto mb-2 ${
                            achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                          }`} 
                        />
                        <h3 className={`font-medium mb-1 ${
                          achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h3>
                        {achievement.unlocked ? (
                          <p className="text-xs text-green-600">
                            Débloqué le {achievement.date}
                          </p>
                        ) : (
                          <div>
                            <Progress value={achievement.progress} className="h-1 mb-1" />
                            <p className="text-xs text-gray-500">
                              {achievement.progress}% complété
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classement */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Classement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1 ? 'bg-yellow-400 text-white' :
                        user.rank === 2 ? 'bg-gray-300 text-white' :
                        user.rank === 3 ? 'bg-orange-400 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {user.rank}
                      </div>
                      <span className="text-2xl">{user.avatar}</span>
                      <div className="flex-1">
                        <p className={`font-medium ${user.isUser ? 'text-blue-700' : ''}`}>
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Boutique de récompenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Boutique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Badge Personnalisé</p>
                      <p className="text-sm text-gray-500">500 points</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Échanger
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Thème Premium</p>
                      <p className="text-sm text-gray-500">1000 points</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Échanger
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Session VR Bonus</p>
                      <p className="text-sm text-gray-500">750 points</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Échanger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
