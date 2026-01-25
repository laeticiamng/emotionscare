import React, { useState, useMemo, useCallback } from 'react';
import { TrendingUp, ArrowRight, RefreshCw, Share2, Filter, Star, StarOff, Eye, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface TrendingPost {
  id: string;
  title: string;
  snippet: string;
  engagementScore: number;
  reactionCount: number;
  commentCount: number;
  trend: 'up' | 'stable' | 'down';
  category?: string;
  author?: string;
  timestamp?: string;
}

interface TrendingPostsSectionProps {
  posts: TrendingPost[];
  onPostClick?: (postId: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const STORAGE_KEY = 'trending_favorites';

type SortOption = 'engagement' | 'reactions' | 'comments' | 'recent';
type FilterOption = 'all' | 'up' | 'stable' | 'down';

export const TrendingPostsSection: React.FC<TrendingPostsSectionProps> = ({
  posts,
  onPostClick,
  isLoading = false,
  onRefresh,
}) => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [sortBy, setSortBy] = useState<SortOption>('engagement');
  const [filterTrend, setFilterTrend] = useState<FilterOption>('all');
  const [activeTab, setActiveTab] = useState('trending');
  const [viewedPosts, setViewedPosts] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const saveFavorites = useCallback((newFavorites: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newFavorites]));
    setFavorites(newFavorites);
  }, []);

  const toggleFavorite = useCallback((postId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(postId)) {
      newFavorites.delete(postId);
      toast({ title: 'Retiré des favoris', duration: 2000 });
    } else {
      newFavorites.add(postId);
      toast({ title: 'Ajouté aux favoris', duration: 2000 });
    }
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites, toast]);

  const handlePostClick = useCallback((postId: string) => {
    setViewedPosts(prev => new Set([...prev, postId]));
    onPostClick?.(postId);
  }, [onPostClick]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleShare = async (post: TrendingPost) => {
    const text = `📈 Tendance EmotionsCare:\n"${post.title}"\n${post.snippet.slice(0, 100)}...`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Tendance Communauté', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !' });
    }
  };

  const sortedAndFilteredPosts = useMemo(() => {
    let result = [...posts];
    
    // Filter by trend
    if (filterTrend !== 'all') {
      result = result.filter(p => p.trend === filterTrend);
    }
    
    // Sort
    switch (sortBy) {
      case 'reactions':
        result.sort((a, b) => b.reactionCount - a.reactionCount);
        break;
      case 'comments':
        result.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case 'recent':
        // Assuming posts are already in recent order, reverse for oldest first
        break;
      default:
        result.sort((a, b) => b.engagementScore - a.engagementScore);
    }
    
    return result;
  }, [posts, sortBy, filterTrend]);

  const favoritePosts = useMemo(() => {
    return posts.filter(p => favorites.has(p.id));
  }, [posts, favorites]);

  const displayedPosts = activeTab === 'favorites' ? favoritePosts : sortedAndFilteredPosts.slice(0, 10);

  const stats = useMemo(() => ({
    totalTrending: posts.length,
    upTrending: posts.filter(p => p.trend === 'up').length,
    totalEngagement: posts.reduce((a, p) => a + p.engagementScore, 0),
    avgReactions: posts.length > 0 ? Math.round(posts.reduce((a, p) => a + p.reactionCount, 0) / posts.length) : 0
  }), [posts]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-sky-100 dark:border-sky-900 bg-gradient-to-br from-sky-50 to-emerald-50/30 dark:from-sky-950/30 dark:to-emerald-950/20 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-sky-900 dark:text-sky-100">
            Trending Communauté
          </h2>
          <Badge variant="secondary" className="text-xs bg-sky-100/60 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300">
            {stats.upTrending} en hausse
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {stats.totalTrending} tendances
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          {stats.avgReactions} réactions moy.
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {favorites.size} favoris
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trending" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Favoris ({favorites.size})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters - only for trending tab */}
      {activeTab === 'trending' && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="reactions">Réactions</SelectItem>
              <SelectItem value="comments">Commentaires</SelectItem>
              <SelectItem value="recent">Récent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTrend} onValueChange={(v) => setFilterTrend(v as FilterOption)}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Tendance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="up">En hausse</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="down">En baisse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => handlePostClick(post.id)}
                  className={`w-full text-left p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors border border-sky-100/50 dark:border-sky-800/50 hover:border-sky-200 dark:hover:border-sky-700 cursor-pointer group ${viewedPosts.has(post.id) ? 'opacity-75' : ''}`}
                  aria-label={`Tendance ${index + 1}: ${post.title}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                      post.trend === 'up' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                      post.trend === 'down' ? 'bg-gradient-to-br from-red-400 to-orange-500' :
                      'bg-gradient-to-br from-sky-400 to-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors truncate">
                          {post.title}
                        </h3>
                        {viewedPosts.has(post.id) && (
                          <Badge variant="outline" className="text-xs">Vu</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.snippet}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            post.trend === 'up'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : post.trend === 'down'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {post.trend === 'up' ? '↑' : post.trend === 'down' ? '↓' : '→'}{' '}
                          {post.engagementScore}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.reactionCount}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.commentCount}
                        </span>
                        {post.category && (
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(post.id);
                        }}
                      >
                        {favorites.has(post.id) ? (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(post);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <ArrowRight className="h-4 w-4 text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex-shrink-0 mt-1" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              {activeTab === 'favorites' ? (
                <>
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun favori pour l'instant</p>
                  <p className="text-xs">Cliquez sur l'étoile pour ajouter des tendances à vos favoris.</p>
                </>
              ) : (
                <>
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune tendance correspondant aux filtres</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View all button */}
      {posts.length > 10 && activeTab === 'trending' && (
        <Button
          variant="outline"
          className="w-full mt-3 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/30"
          onClick={() => onPostClick?.('view-all')}
        >
          Voir les {posts.length} tendances
        </Button>
      )}
    </section>
  );
};

export default TrendingPostsSection;
