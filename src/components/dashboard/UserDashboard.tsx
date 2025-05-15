import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge, BookOpen, CheckCircle, Headphones, Lightbulb, ListChecks, Music2, Sparkles, Trophy, User2 } from 'lucide-react';
import { GamificationStats } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeRole } from '@/utils/roleUtils';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats: GamificationStats = {
    points: 285,
    level: 2,
    progress: 45,
    badges: [
      { id: 'badge1', name: 'Early Riser', description: 'Completed 5 journal entries before 9 AM', icon: 'sun', level: 1 },
      { id: 'badge2', name: 'Mood Tracker', description: 'Tracked mood for 7 consecutive days', icon: 'calendar', level: 1 },
    ],
    challenges: [
      { id: 'challenge1', name: 'Mindful Moments', description: 'Meditate for 15 minutes daily for a week', points: 50, completed: false },
      { id: 'challenge2', name: 'Gratitude Journal', description: 'Write 3 things you are grateful for each day for 5 days', points: 40, completed: true },
    ],
    achievements: [],
    leaderboard: [],
    streak: 3,
    nextLevelPoints: 300,
    completedChallenges: 5,
    totalChallenges: 10,
    activeChallenges: 2,
    streakDays: 3,
    totalPoints: 500,
    badgesCount: 7,
    currentLevel: 2,
    pointsToNextLevel: 15,
    progressToNextLevel: 60,
    lastActivityDate: '2024-01-22',
    rank: 'Bronze',
    completion_rate: 75,
    participation_rate: 80,
    nextLevel: {
      points: 300,
      rewards: ['New Badge', 'Unlock VR Session']
    },
    recentAchievements: []
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Tableau de bord personnel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Points Summary */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Points Totaux
            </CardTitle>
            <CardDescription>Suivez vos progrès</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary">{stats.points}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Prochain niveau à {stats.nextLevelPoints} points
            </p>
          </CardContent>
        </Card>

        {/* Level and Progress */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Niveau Actuel
            </CardTitle>
            <CardDescription>Votre niveau de bien-être</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-500">{stats.level}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.progress}% vers le prochain niveau
            </p>
          </CardContent>
        </Card>

        {/* Streak Tracker */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Série Actuelle
            </CardTitle>
            <CardDescription>Gardez le rythme</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-500">{stats.streak} jours</div>
            <p className="text-sm text-muted-foreground mt-2">
              Continuez pour débloquer des récompenses
            </p>
          </CardContent>
        </Card>

        {/* Badges Earned */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Badge className="h-5 w-5 text-orange-500" />
              Badges Débloqués
            </CardTitle>
            <CardDescription>Récompenses pour vos efforts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-500">{stats.badges.length}</div>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
              {stats.badges.map((badge) => (
                <li key={badge.id}>{badge.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Challenges Overview */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-purple-500" />
              Défis
            </CardTitle>
            <CardDescription>Relevez de nouveaux défis</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-purple-500">
              {stats.completedChallenges} / {stats.totalChallenges}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.activeChallenges} défis en cours
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-teal-500" />
              Actions Rapides
            </CardTitle>
            <CardDescription>Accès facile à vos outils</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <button className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <BookOpen className="h-4 w-4 mr-2 inline-block" />
              Écrire dans le journal
            </button>
            <button className="w-full py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              <Headphones className="h-4 w-4 mr-2 inline-block" />
              Écouter de la musique
            </button>
            <button className="w-full py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              <User2 className="h-4 w-4 mr-2 inline-block" />
              Voir mon profil
            </button>
          </CardContent>
        </Card>
      </div>
      {user && normalizeRole(user.role) === 'b2b_admin' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            En tant qu'administrateur, vous avez accès à des outils supplémentaires.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
