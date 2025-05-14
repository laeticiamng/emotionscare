
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Challenge, Badge, GamificationStats, LeaderboardEntry } from '@/types';
import { v4 as uuid } from 'uuid';

export const useGamification = () => {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    level: 1,
    points: 0,
    badges: [],
    streaks: {
      current: 0,
      longest: 0,
      lastActivity: new Date().toISOString()
    },
    leaderboard: [],
    nextLevel: 2,
    pointsToNextLevel: 100,
    nextLevelPoints: 100
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockBadges = generateMockBadges();
      const mockChallenges = generateMockChallenges();
      const mockStats = {
        level: 2,
        points: 150,
        badges: mockBadges,
        streaks: {
          current: 3,
          longest: 5,
          lastActivity: new Date().toISOString()
        },
        leaderboard: generateMockLeaderboard(),
        nextLevel: 3,
        pointsToNextLevel: 75,
        nextLevelPoints: 225,
        streak: 3,
        totalPoints: 150,
        currentLevel: 2,
        progressToNextLevel: 70,
        streakDays: 3,
        lastActivityDate: new Date().toISOString(),
        activeChallenges: mockChallenges.filter(c => c.status !== 'completed').length,
        completedChallenges: mockChallenges.filter(c => c.status === 'completed').length,
        badgesCount: mockBadges.length,
        rank: 'Explorer',
        recentAchievements: []
      };
      
      setBadges(mockBadges);
      setChallenges(mockChallenges);
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos données de gamification',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const completeChallenge = async (challengeId: string) => {
    try {
      // Find the challenge to complete
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;
      
      // Update challenges
      setChallenges(prev => prev.map(c => 
        c.id === challengeId 
          ? { ...c, status: 'completed', completed: true } 
          : c
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        points: prev.points + challenge.points,
        totalPoints: (prev.totalPoints || 0) + challenge.points,
        activeChallenges: (prev.activeChallenges || 0) - 1,
        completedChallenges: (prev.completedChallenges || 0) + 1
      }));
      
      // Show completion toast
      toast({
        title: 'Défi complété !',
        description: `Vous avez gagné ${challenge.points} points`,
      });
      
      // Simulate badge unlock (20% chance)
      if (Math.random() < 0.2) {
        const newBadge = generateRandomBadge();
        setBadges(prev => [...prev, newBadge]);
        
        // Update badge count in stats
        setStats(prev => ({
          ...prev,
          badgesCount: (prev.badgesCount || 0) + 1
        }));
        
        // Show badge toast after a delay
        setTimeout(() => {
          toast({
            title: 'Nouveau badge débloqué !',
            description: newBadge.name,
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de compléter ce défi',
        variant: 'destructive'
      });
    }
  };
  
  return {
    badges,
    challenges,
    stats,
    loading,
    loadGamificationData,
    completeChallenge
  };
};

// Helper functions for mock data
function generateMockBadges(): Badge[] {
  return [
    {
      id: uuid(),
      name: 'Première émotion',
      description: 'Vous avez enregistré votre première émotion',
      icon: '😊',
      type: 'émotions'
    },
    {
      id: uuid(),
      name: 'Explorateur des émotions',
      description: 'Vous avez exploré 5 émotions différentes',
      icon: '🧭',
      type: 'émotions'
    },
    {
      id: uuid(),
      name: 'Première séance VR',
      description: 'Vous avez complété votre première séance de réalité virtuelle',
      icon: '🥽',
      type: 'vr'
    },
    {
      id: uuid(),
      name: 'Série de 3 jours',
      description: 'Vous vous êtes connecté 3 jours de suite',
      icon: '🔥',
      type: 'engagement'
    },
    {
      id: 'locked-1',
      name: 'Badge verrouillé',
      description: 'Continuez à progresser pour débloquer ce badge',
      icon: '🔒',
      type: 'verrouillé'
    },
  ];
}

function generateMockChallenges(): Challenge[] {
  return [
    {
      id: uuid(),
      title: 'Première analyse émotionnelle',
      description: 'Effectuez votre première analyse émotionnelle',
      points: 20,
      status: 'completed',
      category: 'émotions',
      progress: 100,
      target: 100,
      reward: 20,
      type: 'découverte'
    },
    {
      id: uuid(),
      title: 'Journal quotidien',
      description: 'Écrivez une entrée de journal émotionnel',
      points: 15,
      status: 'ongoing',
      category: 'journal',
      progress: 0,
      target: 1,
      reward: 15,
      type: 'quotidien'
    },
    {
      id: uuid(),
      title: 'Essayez la méditation VR',
      description: 'Complétez une session de méditation en réalité virtuelle',
      points: 25,
      status: 'ongoing',
      category: 'vr',
      progress: 0,
      target: 1,
      reward: 25,
      type: 'découverte'
    },
    {
      id: uuid(),
      title: 'Connectez-vous 5 jours de suite',
      description: 'Maintenez une série de connexions pendant 5 jours',
      points: 50,
      status: 'ongoing',
      category: 'engagement',
      progress: 3,
      target: 5,
      reward: 50,
      type: 'série'
    },
  ];
}

function generateRandomBadge(): Badge {
  const badgeTypes = [
    { name: 'Maître du calme', desc: 'Vous avez atteint un état de calme profond', icon: '🧘', type: 'bien-être' },
    { name: 'Journaliste en herbe', desc: 'Vous avez écrit 5 entrées de journal', icon: '📝', type: 'journal' },
    { name: 'Expert VR', desc: 'Vous avez passé plus d\'une heure en VR', icon: '👓', type: 'vr' },
    { name: 'Chercheur émotionnel', desc: 'Vous avez analysé 10 émotions différentes', icon: '🔍', type: 'émotions' },
    { name: 'Guerrier du bien-être', desc: 'Vous avez maintenu un score émotionnel élevé pendant une semaine', icon: '🛡️', type: 'bien-être' },
  ];
  
  const randomBadge = badgeTypes[Math.floor(Math.random() * badgeTypes.length)];
  
  return {
    id: uuid(),
    name: randomBadge.name,
    description: randomBadge.desc,
    icon: randomBadge.icon,
    type: randomBadge.type
  };
}

function generateMockLeaderboard(): LeaderboardEntry[] {
  const names = ['Sophie', 'Thomas', 'Emma', 'Lucas', 'Chloé', 'Nathan', 'Léa', 'Hugo'];
  
  return [
    {
      id: uuid(),
      userId: uuid(),
      name: 'Vous',
      score: 150,
      avatar: '/avatars/avatar-1.jpg',
      rank: 4,
      change: 1,
      streak: 3
    },
    ...Array(7).fill(null).map((_, i) => ({
      id: uuid(),
      userId: uuid(),
      name: names[i],
      score: Math.floor(Math.random() * 300) + 100,
      avatar: `/avatars/avatar-${i+2}.jpg`,
      rank: i + 1,
      change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
      streak: Math.floor(Math.random() * 7)
    }))
  ].sort((a, b) => b.score - a.score)
  .map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
}

export default useGamification;
