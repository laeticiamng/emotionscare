import React from 'react';
import { Challenge } from '@/types/challenge';
import { Badge } from '@/types/badge';

const GamificationTab: React.FC = () => {
  // Sample challenges - in a real app, these would be fetched
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Goal Crusher',
      name: 'Goal Crusher',
      description: 'Complete your weekly well-being objective',
      progress: 100,
      completed: true,
      status: 'completed',
      points: 50,
      difficulty: 'medium',
      category: 'wellness',
      tags: ['weekly', 'wellbeing'],
      goal: '7 days streak'
    },
    {
      id: '2',
      title: 'Social Butterfly',
      name: 'Social Butterfly',
      description: 'Connect with 5 team members in the community',
      progress: 60,
      completed: false,
      status: 'in-progress',
      points: 75,
      difficulty: 'hard',
      category: 'social',
      tags: ['community', 'connection'],
      goal: 'Connect with 5 members'
    }
  ];

  // Sample badges - in a real app, these would be fetched
  const badges: Badge[] = [
    {
      id: '1',
      name: 'Emotional Guardian',
      description: 'Maintained positive emotional balance for 30 days',
      image: '/badges/emotional-guardian.png',
      imageUrl: '/badges/emotional-guardian.png',
      achieved: true,
      unlocked: true,
      earnedAt: '2023-07-15',
      earned: true,
      tier: 'gold',
      category: 'emotional',
      icon: '👑',
      level: 3
    },
    {
      id: '2',
      name: 'Team Supporter',
      description: 'Helped improve team emotional score by 15%',
      image: '/badges/team-supporter.png',
      imageUrl: '/badges/team-supporter.png',
      achieved: false,
      unlocked: false,
      tier: 'silver',
      category: 'team',
      progress: 70,
      threshold: 100,
      icon: '🤝',
      level: 2
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Gamification</h2>
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
