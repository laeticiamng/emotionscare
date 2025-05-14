
import { useState, useEffect } from 'react';
import { Award, Target, Zap } from 'lucide-react';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/types';

export const useGamification = (userId?: string) => {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamificationData = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // const data = await fetchGamificationStats(userId);
        
        // For now, we'll use mock data
        setTimeout(() => {
          // Mock badges
          const mockBadges: Badge[] = [
            {
              id: '1',
              name: 'Première Connexion',
              description: 'S\'est connecté pour la première fois',
              icon: '🌟',
              type: 'onboarding',
              image_url: '/badges/welcome.png',
              level: 1
            },
            {
              id: '2',
              name: 'Explorateur',
              description: 'A visité toutes les sections',
              icon: '🧭',
              type: 'exploration',
              level: 1
            },
            {
              id: '3',
              name: 'Journal Régulier',
              description: 'A écrit dans son journal pendant 7 jours consécutifs',
              icon: '📔',
              type: 'consistency',
              level: 2
            },
            {
              id: '4-locked',
              name: 'Maître du Calme (Verrouillé)',
              description: 'Complétez 10 sessions de méditation',
              icon: '🧘',
              type: 'meditation'
            },
          ];
          
          // Mock challenges
          const mockChallenges: Challenge[] = [
            {
              id: '1',
              title: 'Scanner quotidien',
              description: 'Faire un scan d\'émotion chaque jour pendant 5 jours',
              points: 100,
              status: 'ongoing',
              category: 'daily',
              progress: 3,
              target: 5,
              reward: 100,
              type: 'streak'
            },
            {
              id: '2',
              title: 'Maître du Journal',
              description: 'Écrire 5 entrées de journal cette semaine',
              points: 150,
              status: 'ongoing',
              category: 'journal',
              progress: 2,
              target: 5,
              reward: 150,
              type: 'count'
            },
            {
              id: '3',
              title: 'Session VR réussie',
              description: 'Compléter une session VR de 10 minutes',
              points: 75,
              status: 'completed',
              category: 'vr',
              progress: 1,
              target: 1,
              reward: 75,
              type: 'achievement'
            }
          ];
          
          // Mock leaderboard
          const mockLeaderboard: LeaderboardEntry[] = [
            {
              id: '1',
              userId: '101',
              name: 'Jean D.',
              score: 1250,
              rank: 1,
              change: 0,
              streak: 15,
              avatar: '/avatars/user1.png'
            },
            {
              id: '2',
              userId: '102',
              name: 'Marie L.',
              score: 1100,
              rank: 2,
              change: 1,
              streak: 7,
              avatar: '/avatars/user2.png'
            },
            {
              id: '3',
              userId: '103',
              name: 'Pierre B.',
              score: 950,
              rank: 3,
              change: -1,
              streak: 3,
              avatar: '/avatars/user3.png'
            }
          ];
          
          // Mock gamification stats
          const mockStats: GamificationStats = {
            level: 5,
            points: 550,
            badges: mockBadges,
            streaks: {
              current: 4,
              longest: 12,
              lastActivity: new Date().toISOString()
            },
            leaderboard: mockLeaderboard,
            nextLevel: 6,
            pointsToNextLevel: 200,
            nextLevelPoints: 750,
            challenges: mockChallenges,
            rank: 'Apprenti',
            streak: 4,
            totalPoints: 550,
            currentLevel: 5,
            progressToNextLevel: 75,
            streakDays: 4,
            lastActivityDate: new Date().toISOString(),
            activeChallenges: 2,
            completedChallenges: 1,
            badgesCount: 3,
            recentAchievements: []
          };
          
          setStats(mockStats);
          setBadges(mockBadges);
          setChallenges(mockChallenges);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching gamification data:", error);
        setLoading(false);
      }
    };
    
    fetchGamificationData();
  }, [userId]);
  
  // Function to simulate completing a challenge
  const completeChallenge = async (challengeId: string) => {
    try {
      // In a real application, this would be an API call
      // await api.completeChallenge(challengeId, userId);
      
      // For now, we'll just update the local state
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, status: 'completed', progress: challenge.target, completed: true } 
            : challenge
        )
      );
      
      // Update stats
      if (stats) {
        const completedChallenge = challenges.find(c => c.id === challengeId);
        if (completedChallenge) {
          setStats({
            ...stats,
            points: stats.points + (completedChallenge.points || 0),
            totalPoints: stats.totalPoints + (completedChallenge.points || 0),
            activeChallenges: stats.activeChallenges - 1,
            completedChallenges: stats.completedChallenges + 1
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error completing challenge:", error);
      return false;
    }
  };
  
  return { stats, badges, challenges, loading, completeChallenge };
};

export default useGamification;
