
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeType } from '@/types/badge';
import { GamificationStats } from '@/types/gamification';

const UserDashboard = () => {
  // Mock data - in a real app, this would come from an API/context
  const badges: BadgeType[] = [
    {
      id: '1',
      name: 'Explorateur Émotionnel',
      description: 'Vous avez exploré vos émotions pendant 7 jours consécutifs',
      image: '/images/badges/explorer.svg',
      imageUrl: '/images/badges/explorer.svg',
      unlocked: true,
      achieved: true,
      earnedAt: '2023-05-10',
      earned: true,
      category: 'engagement'
    },
    {
      id: '2',
      name: 'Maître de la Pleine Conscience',
      description: 'Vous avez complété 10 sessions de pleine conscience',
      image: '/images/badges/mindfulness.svg',
      imageUrl: '/images/badges/mindfulness.svg',
      unlocked: true,
      achieved: true,
      earned: true,
      progress: 10,
      maxProgress: 10,
      threshold: 10,
      category: 'mindfulness'
    },
    {
      id: '3',
      name: 'Ami des Émotions',
      description: 'Vous avez aidé 5 autres utilisateurs dans leur parcours émotionnel',
      image: '/images/badges/friend.svg',
      imageUrl: '/images/badges/friend.svg',
      unlocked: false,
      achieved: false,
      earned: false,
      progress: 3,
      maxProgress: 5,
      threshold: 5,
      category: 'social'
    }
  ];
  
  const stats: GamificationStats = {
    level: 4,
    xp: 356,
    xpToNextLevel: 500,
    rank: 4,
    points: 780,
    streakDays: 7,
    longestStreak: 14,
    completedChallenges: 12,
    totalChallenges: 25,
    unlockedBadges: 8,
    totalBadges: 20,
    nextLevelPoints: 500,
    totalPoints: 780,
    challengesCompleted: 12,
    challenges: [],
    streak: 7,
    badges: []
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-medium">Niveau</div>
            <div className="text-3xl font-bold">{stats.level}</div>
            <div className="text-sm text-gray-500">{stats.xp} / {stats.xpToNextLevel} XP</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-medium">Série actuelle</div>
            <div className="text-3xl font-bold">{stats.streakDays} jours</div>
            <div className="text-sm text-gray-500">
              Série la plus longue: {stats.longestStreak} jours
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-medium">Points</div>
            <div className="text-3xl font-bold">{stats.points}</div>
            <div className="text-sm text-gray-500">
              Rang: {stats.rank}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-3">Challenges</h2>
            <div className="flex items-center justify-between mb-2">
              <div>Challenges complétés</div>
              <div className="font-bold">{stats.completedChallenges} / {stats.totalChallenges}</div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${(stats.completedChallenges / stats.totalChallenges) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-sm text-blue-600 hover:underline cursor-pointer">
              Voir tous les challenges
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-3">Badges</h2>
            <div className="flex items-center justify-between mb-2">
              <div>Badges débloqués</div>
              <div className="font-bold">{stats.unlockedBadges} / {stats.totalBadges}</div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className="h-2 bg-purple-500 rounded-full" 
                style={{ width: `${(stats.unlockedBadges / stats.totalBadges) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex space-x-4 mt-4">
              {badges.map((badge) => (
                <div key={badge.id} className="text-center">
                  <div 
                    className={`w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center 
                    ${badge.unlocked ? 'bg-purple-100' : 'bg-gray-100'}`}
                  >
                    {badge.image && (
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className={`w-8 h-8 ${!badge.unlocked && 'opacity-50 grayscale'}`}
                      />
                    )}
                  </div>
                  <div className="text-xs font-medium truncate w-16">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-blue-600 hover:underline cursor-pointer mt-2">
              Voir tous les badges
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
