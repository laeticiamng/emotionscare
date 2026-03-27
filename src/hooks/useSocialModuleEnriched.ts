// @ts-nocheck
import { useCallback, useState, useEffect } from 'react';
import { useModuleProgress } from './useModuleProgress';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface SocialPost {
  id: string;
  content: string;
  emotion: string;
  reactions: { heart: number; star: number; hug: number };
  createdAt: string;
  isFavorite?: boolean;
  shareCount?: number;
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId?: string;
}

interface SocialStats {
  totalPosts: number;
  totalReactions: number;
  favoriteEmotions: string[];
  engagementRate: number;
  postsThisWeek: number;
  averageReactionsPerPost: number;
  streakDays: number;
}

interface CommunityActivity {
  id: string;
  type: 'post' | 'reaction' | 'comment' | 'achievement';
  timestamp: string;
  data: any;
}

const FAVORITES_KEY = 'emotionscare_social_favorites';

/**
 * Hook enrichi pour les modules sociaux
 * (Social Lantern, Collab Flame, etc.)
 */
export const useSocialModuleEnriched = (moduleName: string) => {
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

  const [favorites, setFavorites] = useState<string[]>([]);
  const [communityFeed, setCommunityFeed] = useState<CommunityActivity[]>([]);
  const [stats, setStats] = useState<SocialStats | null>(null);

  const posts = (progress?.progress_data?.posts || []) as SocialPost[];
  const reactions = progress?.progress_data?.totalReactions || 0;
  const totalPoints = progress?.total_points || 0;
  const streak = progress?.streak || 0;

  // Charger les favoris
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${FAVORITES_KEY}_${moduleName}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      logger.error('Erreur chargement favoris sociaux', error as Error, 'UI');
    }
  }, [moduleName]);

  // Calculer les statistiques
  const calculateStats = useCallback((): SocialStats => {
    const totalPosts = posts.length;
    const totalReactionsCount = posts.reduce((sum, p) => 
      sum + (p.reactions?.heart || 0) + (p.reactions?.star || 0) + (p.reactions?.hug || 0), 0
    );

    const emotionCount = new Map<string, number>();
    posts.forEach(p => {
      emotionCount.set(p.emotion, (emotionCount.get(p.emotion) || 0) + 1);
    });

    const favoriteEmotions = Array.from(emotionCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const postsThisWeek = posts.filter(p => new Date(p.createdAt) >= oneWeekAgo).length;

    const averageReactionsPerPost = totalPosts > 0 ? totalReactionsCount / totalPosts : 0;
    const engagementRate = totalPosts > 0 ? (totalReactionsCount / (totalPosts * 3)) * 100 : 0;

    return {
      totalPosts,
      totalReactions: totalReactionsCount,
      favoriteEmotions,
      engagementRate: Math.round(engagementRate),
      postsThisWeek,
      averageReactionsPerPost: Math.round(averageReactionsPerPost * 10) / 10,
      streakDays: streak
    };
  }, [posts, streak]);

  useEffect(() => {
    setStats(calculateStats());
  }, [posts, calculateStats]);

  const createPost = useCallback(async (
    content: string,
    emotion: string,
    metadata: Record<string, any> = {}
  ) => {
    const newPost: SocialPost = {
      id: Date.now().toString(),
      content,
      emotion,
      reactions: { heart: 0, star: 0, hug: 0 },
      createdAt: new Date().toISOString(),
      isFavorite: false,
      shareCount: 0,
      comments: [],
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
    } else if (newPosts.length === 50) {
      await unlockAchievement('social_influencer', {
        title: 'Influenceur Émotionnel',
        emoji: '🌟'
      });
    } else if (newPosts.length === 100) {
      await unlockAchievement('social_master', {
        title: 'Maître du Partage',
        emoji: '👑'
      });
    }

    // Ajouter à l'activité communautaire
    const activity: CommunityActivity = {
      id: Date.now().toString(),
      type: 'post',
      timestamp: new Date().toISOString(),
      data: { postId: newPost.id, emotion }
    };
    setCommunityFeed(prev => [activity, ...prev].slice(0, 100));

    toast.success('Publication créée !');
    return newPost.id;
  }, [posts, streak, addPoints, incrementCompleted, incrementStreak, resetStreak, updateProgressData, unlockAchievement]);

  const reactToPost = useCallback(async (
    postId: string,
    reactionType: 'heart' | 'star' | 'hug'
  ) => {
    const updatedPosts = posts.map((post: SocialPost) => {
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
    } else if (newTotalReactions === 200) {
      await unlockAchievement('love_spreader', {
        title: 'Propagateur d\'Amour',
        emoji: '💝'
      });
    }

    // Ajouter à l'activité
    const activity: CommunityActivity = {
      id: Date.now().toString(),
      type: 'reaction',
      timestamp: new Date().toISOString(),
      data: { postId, reactionType }
    };
    setCommunityFeed(prev => [activity, ...prev].slice(0, 100));

  }, [posts, reactions, addPoints, updateProgressData, unlockAchievement]);

  // Ajouter aux favoris
  const toggleFavorite = useCallback(async (postId: string) => {
    const isFav = favorites.includes(postId);
    const newFavorites = isFav
      ? favorites.filter(id => id !== postId)
      : [...favorites, postId];

    setFavorites(newFavorites);
    localStorage.setItem(`${FAVORITES_KEY}_${moduleName}`, JSON.stringify(newFavorites));

    // Mettre à jour le post
    const updatedPosts = posts.map(p =>
      p.id === postId ? { ...p, isFavorite: !isFav } : p
    );
    await updateProgressData({ posts: updatedPosts });

    toast.success(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }, [favorites, moduleName, posts, updateProgressData]);

  // Partager un post
  const sharePost = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return false;

    const shareData = {
      title: `Émotion: ${post.emotion} - EmotionsCare`,
      text: post.content,
      url: `${window.location.origin}/app/social/post/${postId}`
    };

    const updatedPosts = posts.map(p =>
      p.id === postId ? { ...p, shareCount: (p.shareCount || 0) + 1 } : p
    );
    await updateProgressData({ posts: updatedPosts });

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Partagé avec succès');
        return true;
      } catch {
        // Annulé
      }
    }

    await navigator.clipboard.writeText(shareData.url);
    toast.success('Lien copié');
    return true;
  }, [posts, updateProgressData]);

  // Ajouter un commentaire
  const addComment = useCallback(async (postId: string, content: string) => {
    const comment: Comment = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString()
    };

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), comment]
        };
      }
      return p;
    });

    await updateProgressData({ posts: updatedPosts });
    await addPoints(3);

    toast.success('Commentaire ajouté');
    return comment.id;
  }, [posts, updateProgressData, addPoints]);

  // Obtenir les posts favoris
  const getFavoritePosts = useCallback(() => {
    return posts.filter(p => favorites.includes(p.id));
  }, [posts, favorites]);

  // Obtenir les posts par émotion
  const getPostsByEmotion = useCallback((emotion: string) => {
    return posts.filter(p => p.emotion === emotion);
  }, [posts]);

  // Exporter l'historique
  const exportHistory = useCallback((format: 'json' | 'csv' = 'json'): string => {
    if (format === 'csv') {
      const headers = 'ID,Content,Emotion,Hearts,Stars,Hugs,CreatedAt,ShareCount\n';
      const rows = posts.map(p =>
        `${p.id},"${p.content}","${p.emotion}",${p.reactions.heart},${p.reactions.star},${p.reactions.hug},${p.createdAt},${p.shareCount || 0}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({
      posts,
      stats: calculateStats(),
      favorites,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }, [posts, favorites, calculateStats]);

  // Télécharger l'historique
  const downloadHistory = useCallback((format: 'json' | 'csv' = 'json') => {
    const content = exportHistory(format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-${moduleName}-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportHistory, moduleName]);

  // Recommandations de contenu
  const getRecommendations = useCallback(() => {
    const topEmotions = stats?.favoriteEmotions || [];
    const suggestedEmotions = ['joie', 'sérénité', 'gratitude', 'espoir', 'amour']
      .filter(e => !topEmotions.includes(e))
      .slice(0, 3);

    return {
      suggestedEmotions,
      shouldPostMore: stats?.postsThisWeek || 0 < 3,
      shouldReactMore: stats?.engagementRate || 0 < 20,
      streakTip: streak === 0 ? 'Commencez une série aujourd\'hui !' : null
    };
  }, [stats, streak]);

  const getPostById = useCallback((postId: string) => {
    return posts.find((post: SocialPost) => post.id === postId);
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
    unlockAchievement,
    // Enriched features
    favorites,
    stats,
    communityFeed,
    toggleFavorite,
    sharePost,
    addComment,
    getFavoritePosts,
    getPostsByEmotion,
    exportHistory,
    downloadHistory,
    getRecommendations
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

export default useSocialModuleEnriched;
