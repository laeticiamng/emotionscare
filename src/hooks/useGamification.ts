
import { useState, useEffect } from 'react';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';
import { getBadgesForUser, getAllBadges } from '@/lib/gamification/badge-service';
import { getChallengesForUser, getAllChallenges } from '@/lib/gamification/challenge-service';
import { completeChallenge, updateChallenge } from '@/lib/gamificationService';
import { getLeaderboard } from '@/lib/gamification/leaderboard-service';
import { awardPoints } from '@/lib/gamification/points-service';
import { getUserGamificationStats } from '@/lib/gamification/level-service';

export const useGamification = (userId: string = 'current-user') => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    nextLevelPoints: 100,
    badges: [],
    completedChallenges: 0,
    activeChallenges: 0,
    streakDays: 0,
    progressToNextLevel: 0
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize gamification data
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's badges
        const userBadges = await getBadgesForUser(userId);
        setBadges(userBadges);

        // Fetch user's challenges
        const userChallenges = await getChallengesForUser(userId);
        setChallenges(userChallenges);

        // Calculate statistics
        const userStats = getUserGamificationStats(
          userId,
          1250, // mock total points
          userBadges.length,
          userChallenges.filter(c => c.status === 'completed').length,
          userChallenges.filter(c => c.status === 'ongoing' || c.status === 'active').length
        );
        setStats(userStats);

        // Fetch leaderboard data
        const leaderboardData = await getLeaderboard('global');
        setLeaderboard(leaderboardData);

        setError(null);
      } catch (err) {
        setError('Failed to load gamification data');
        console.error('Error fetching gamification data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, [userId]);

  // Handle challenge completion
  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      const updatedChallenge = await completeChallenge(userId, challengeId);
      
      if (updatedChallenge) {
        // Update the challenges list
        setChallenges(prev => 
          prev.map(c => c.id === challengeId ? updatedChallenge : c)
        );
        
        // Award points for completion
        await awardPoints(userId, updatedChallenge.points, `Challenge completed: ${updatedChallenge.name}`);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          points: prev.points + updatedChallenge.points,
          completedChallenges: prev.completedChallenges + 1,
          activeChallenges: prev.activeChallenges - 1
        }));
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to complete challenge');
      console.error('Error completing challenge:', err);
      return false;
    }
  };

  // Update challenge progress
  const handleUpdateChallengeProgress = async (challengeId: string, progress: number) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (!challenge) return false;
      
      const updatedChallenge = await updateChallenge(userId, challengeId, { progress });
      
      if (updatedChallenge) {
        setChallenges(prev => 
          prev.map(c => c.id === challengeId ? updatedChallenge : c)
        );
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update challenge progress');
      console.error('Error updating challenge progress:', err);
      return false;
    }
  };

  return {
    badges,
    challenges,
    stats,
    leaderboard,
    loading,
    error,
    completeChallenge: handleCompleteChallenge,
    updateChallengeProgress: handleUpdateChallengeProgress
  };
};
