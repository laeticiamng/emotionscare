// @ts-nocheck
import { useCallback } from 'react';
import { useModuleProgress } from './useModuleProgress';

/**
 * Hook spécialisé pour les modules sociaux
 * (Social Lantern, Collab Flame, etc.)
 */
export const useSocialModule = (moduleName: string) => {
  const {
    progress,
    addPoints,
    incrementCompleted,
    incrementStreak,
    resetStreak,
    updateProgressData,
    unlockAchievement,
    isLoading
  } = useModuleProgress(moduleName);

  const posts = (progress?.progress_data?.posts || []) as any[];
  const reactions = progress?.progress_data?.totalReactions || 0;
  const totalPoints = progress?.total_points || 0;
  const streak = progress?.streak || 0;

  const createPost = useCallback(async (
    content: string,
    emotion: string,
    metadata: Record<string, any> = {}
  ) => {
    const newPost = {
      id: Date.now().toString(),
      content,
      emotion,
      reactions: { heart: 0, star: 0, hug: 0 },
      createdAt: new Date().toISOString(),
      ...metadata
    };

    const newPosts = [...posts, newPost];
    await updateProgressData({
      posts: newPosts,
      lastPostDate: new Date().toISOString()
    });

    await addPoints(10);
    await incrementCompleted();

    // Check daily streak
    const lastPost = posts[posts.length - 1];
    const isConsecutiveDay = lastPost && 
      isWithin24Hours(new Date(lastPost.createdAt), new Date());
    
    if (isConsecutiveDay) {
      await incrementStreak();
      
      // Streak achievements
      if (streak + 1 === 7) {
        await unlockAchievement('week_streak', {
          title: 'Une Semaine de Flamme!',
          emoji: '🔥'
        });
      }
    } else if (!isToday(lastPost?.createdAt)) {
      await resetStreak();
    }

    // Post count achievements
    if (newPosts.length === 10) {
      await unlockAchievement('social_starter', {
        title: 'Créateur de Lumière',
        emoji: '✨'
      });
    }

    return newPost.id;
  }, [
    posts,
    streak,
    addPoints,
    incrementCompleted,
    incrementStreak,
    resetStreak,
    updateProgressData,
    unlockAchievement
  ]);

  const reactToPost = useCallback(async (
    postId: string,
    reactionType: 'heart' | 'star' | 'hug'
  ) => {
    const updatedPosts = posts.map((post: any) => {
      if (post.id === postId) {
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: (post.reactions[reactionType] || 0) + 1
          }
        };
      }
      return post;
    });

    const newTotalReactions = reactions + 1;
    
    await updateProgressData({
      posts: updatedPosts,
      totalReactions: newTotalReactions
    });

    await addPoints(5);

    // Reaction achievements
    if (newTotalReactions === 50) {
      await unlockAchievement('super_reactor', {
        title: 'Super Réacteur',
        emoji: '❤️'
      });
    }
  }, [posts, reactions, addPoints, updateProgressData, unlockAchievement]);

  const getPostById = useCallback((postId: string) => {
    return posts.find((post: any) => post.id === postId);
  }, [posts]);

  return {
    progress,
    posts,
    reactions,
    totalPoints,
    streak,
    isLoading,
    createPost,
    reactToPost,
    getPostById,
    unlockAchievement
  };
};

// Helper functions
function isWithin24Hours(date1: Date, date2: Date): boolean {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return diffMs <= 24 * 60 * 60 * 1000;
}

function isToday(dateString?: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}
