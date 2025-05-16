
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, Progress } from '@/components/ui/progress';
import { Challenge, Badge as BadgeType } from '@/types/gamification';

const GamificationTab: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Journal quotidien',
      name: 'Journal quotidien',
      description: 'Remplissez votre journal émotionnel chaque jour pendant une semaine',
      progress: 100,
      completed: true,
      status: 'completed',
      points: 50,
      difficulty: 'easy',
      category: 'journal',
      completedAt: '2023-05-12T10:30:00Z',
      tags: ['journal', 'quotidien']
    },
    {
      id: '2',
      title: 'Méditation matinale',
      name: 'Méditation matinale',
      description: 'Effectuez une méditation de 5 minutes chaque matin pendant 5 jours',
      progress: 60,
      completed: false,
      status: 'active',
      points: 100,
      difficulty: 'medium',
      category: 'meditation',
      tags: ['méditation', 'matin']
    }
  ];

  const badges: BadgeType[] = [
    {
      id: '1',
      name: 'Maître de la pleine conscience',
      description: 'Vous avez pratiqué 30 jours de méditation',
      image: '/images/badges/mindfulness-master.svg',
      imageUrl: '/images/badges/mindfulness-master.svg',
      achieved: true,
      unlocked: true,
      achievedAt: '2023-05-10T14:30:00Z',
      tier: 'gold',
      category: 'méditation',
      rarity: 'rare'
    },
    {
      id: '2',
      name: 'Explorateur émotionnel',
      description: 'Vous avez identifié 20 émotions différentes',
      image: '/images/badges/emotion-explorer.svg',
      imageUrl: '/images/badges/emotion-explorer.svg',
      achieved: false,
      unlocked: false,
      progress: 12,
      maxProgress: 20,
      total: 20,
      tier: 'silver',
      category: 'émotions',
      rarity: 'uncommon'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Challenges actifs et complétés</h3>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{challenge.title}</div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      challenge.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                        : challenge.status === 'active'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                    }`}>
                      {challenge.status === 'completed' ? 'Complété' : challenge.status === 'active' ? 'Actif' : 'Verrouillé'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <div className="flex items-center">
                      <span className={`mr-2 px-1.5 py-0.5 rounded ${
                        challenge.difficulty === 'easy' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : challenge.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      {challenge.tags && challenge.tags.map(tag => (
                        <span key={tag} className="mr-1 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="font-medium">{challenge.points} pts</div>
                  </div>
                  <Progress value={challenge.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Badges</h3>
            <div className="space-y-4">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                  <div className={`w-14 h-14 rounded-full mr-4 flex items-center justify-center ${
                    badge.achieved || badge.unlocked
                      ? 'bg-purple-100 dark:bg-purple-900/20'
                      : 'bg-gray-100 dark:bg-gray-800/30'
                  }`}>
                    {badge.imageUrl && (
                      <img 
                        src={badge.imageUrl} 
                        alt={badge.name} 
                        className={`w-8 h-8 ${!(badge.achieved || badge.unlocked) && 'opacity-50 grayscale'}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{badge.name}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        badge.tier === 'gold' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                          : badge.tier === 'silver'
                          ? 'bg-gray-200 text-gray-700 dark:bg-gray-700/20 dark:text-gray-400'
                          : badge.tier === 'bronze'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                      }`}>
                        {badge.tier}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{badge.description}</div>
                    {!(badge.achieved || badge.unlocked) && badge.progress !== undefined && badge.total !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progression</span>
                          <span>{badge.progress} / {badge.total}</span>
                        </div>
                        <Progress 
                          value={(badge.progress / badge.total) * 100}
                          className="h-1.5" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamificationTab;
