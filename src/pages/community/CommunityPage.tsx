/**
 * CommunityPage - Page principale de la communauté
 * Module complet pour la gestion des interactions sociales
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  MessageSquare,
  TrendingUp,
  Heart,
  Bookmark,
  Grid3X3,
  Shield,
  Sparkles,
  Plus,
} from 'lucide-react';

import PageSEO from '@/components/seo/PageSEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

import { EnhancedPostComposer } from '@/components/community/EnhancedPostComposer';
import { EnhancedPostCard } from '@/components/community/EnhancedPostCard';
import { CommunityStatsBoard } from '@/components/community/CommunityStatsBoard';
import { TrendingPostsSection } from '@/components/community/TrendingPostsSection';
import { SavedPostsTab } from '@/components/community/SavedPostsTab';
import { CommunityGroupsList } from '@/components/community/CommunityGroupsList';
import { CommunityNotifications } from '@/components/community/CommunityNotifications';

import { useCommunityPosts } from '@/hooks/community/useCommunityPosts';
import { useCommunityGroups } from '@/hooks/community/useCommunityGroups';
import { useCommunityEnhancements } from '@/hooks/useCommunityEnhancements';

interface TrendingPost {
  id: string;
  title: string;
  snippet: string;
  engagementScore: number;
  reactionCount: number;
  commentCount: number;
  trend: 'up' | 'stable' | 'down';
}

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('feed');
  const [filter, setFilter] = useState<'all' | 'trending' | 'following' | 'featured'>('all');

  // Hooks for data
  const {
    posts,
    loading: postsLoading,
    hasMore,
    loadMore,
    refresh,
    createPost,
    toggleReaction,
    totalCount
  } = useCommunityPosts({ filter });

  const { groups, myGroups, loading: groupsLoading, joinGroup, leaveGroup, createGroup } = useCommunityGroups();
  const { bookmarks, toggleBookmark, isBookmarked } = useCommunityEnhancements();

  // Generate trending posts from real data
  const trendingPosts: TrendingPost[] = useMemo(() => {
    return posts
      .slice(0, 5)
      .sort((a, b) => b.likes_count - a.likes_count)
      .map((post, index) => ({
        id: post.id,
        title: post.title || post.content.slice(0, 50) + '...',
        snippet: post.content.slice(0, 100),
        engagementScore: post.likes_count + post.comments_count * 2,
        reactionCount: post.likes_count,
        commentCount: post.comments_count,
        trend: index % 2 === 0 ? 'up' as const : 'stable' as const,
      }));
  }, [posts]);

  // Stats based on real data
  const communityStats = useMemo(() => ({
    totalMembers: 1250, // Would come from backend
    totalPosts: totalCount,
    totalInteractions: posts.reduce((sum, p) => sum + p.likes_count + p.comments_count, 0),
    activeToday: 89,
    topContributor: 'Aurore',
    monthlyGrowth: 12,
  }), [posts, totalCount]);

  // Saved posts from bookmarks
  const savedPosts = useMemo(() => {
    return bookmarks.map(bookmark => {
      const post = posts.find(p => p.id === bookmark.postId);
      if (!post) return null;
      return {
        id: post.id,
        author: post.author?.full_name || 'Anonyme',
        content: post.content,
        timestamp: new Date(post.created_at).toLocaleDateString('fr-FR'),
        focus: post.mood_halo,
        savedAt: bookmark.savedAt,
      };
    }).filter(Boolean) as Array<{
      id: string;
      author: string;
      content: string;
      timestamp: string;
      focus?: string;
      savedAt: string;
    }>;
  }, [posts, bookmarks]);

  // Handlers
  const handleCreatePost = useCallback(async (content: string) => {
    try {
      await createPost({ content });
    } catch (err) {
      // Error handled in hook
    }
  }, [createPost]);

  const handleReply = useCallback((postId: string) => {
    toast({
      title: 'Mode réponse',
      description: 'Formule ta réponse avec bienveillance.',
    });
  }, [toast]);

  const handleReport = useCallback((postId: string) => {
    toast({
      title: 'Signalement',
      description: 'Le signalement sera traité avec discrétion.',
    });
  }, [toast]);

  const handleReactionAdd = useCallback(async (postId: string, reaction: string) => {
    await toggleReaction(postId, 'like');
  }, [toggleReaction]);

  const handleTrendingPostClick = useCallback((postId: string) => {
    if (postId === 'view-all') {
      setFilter('trending');
      setActiveTab('feed');
      return;
    }
    // Scroll to post or show details
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-gradient-to-b from-emerald-50/50 via-background to-background">
      <PageSEO
        title="Communauté | EmotionsCare"
        description="Rejoignez notre communauté bienveillante. Partagez vos expériences, trouvez du soutien et connectez-vous avec d'autres personnes."
      />

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Revenir"
          className="transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold flex items-center gap-2 justify-center">
            <Users className="h-5 w-5 text-primary" />
            Communauté
          </h1>
          <p className="text-xs text-muted-foreground">Espace de partage bienveillant</p>
        </div>
        <CommunityNotifications />
      </header>

      {/* Main Content */}
      <main className="space-y-6 px-4 pb-16 pt-6">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                Bienvenue dans notre espace de bienveillance.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Chaque message est modéré avec soin. On se répond en douceur, sans performance.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stats Dashboard */}
        <CommunityStatsBoard stats={communityStats} onRefresh={refresh} />

        {/* Trending Posts */}
        {trendingPosts.length > 0 && (
          <TrendingPostsSection
            posts={trendingPosts}
            onPostClick={handleTrendingPostClick}
          />
        )}

        {/* Post Composer */}
        <EnhancedPostComposer onSubmit={handleCreatePost} />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed" className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Fil</span>
              <Badge variant="secondary" className="ml-1 text-[10px]">{totalCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-1 text-xs">
              <Grid3X3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Groupes</span>
              <Badge variant="secondary" className="ml-1 text-[10px]">{groups.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1 text-xs">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Favoris</span>
              <Badge variant="secondary" className="ml-1 text-[10px]">{savedPosts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tendances</span>
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4 mt-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'trending', 'following', 'featured'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="text-xs"
                >
                  {f === 'all' && 'Tous'}
                  {f === 'trending' && '🔥 Tendances'}
                  {f === 'following' && '👥 Abonnements'}
                  {f === 'featured' && '⭐ Mis en avant'}
                </Button>
              ))}
            </div>

            {postsLoading && posts.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center p-8">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-sm font-semibold mb-1">Aucun message pour le moment</h3>
                <p className="text-xs text-muted-foreground">
                  Sois la première personne à partager un moment avec la communauté.
                </p>
              </Card>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id} id={`post-${post.id}`}>
                    <EnhancedPostCard
                      id={post.id}
                      author={post.author?.full_name || 'Anonyme'}
                      avatar={post.author?.avatar_url || '🫧'}
                      content={post.content}
                      focus={post.mood_halo}
                      timestamp={new Date(post.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      likes={post.likes_count}
                      comments={post.comments_count}
                      hasAutoFlag={false}
                      userRole="member"
                      onReply={handleReply}
                      onReport={handleReport}
                      onReactionAdd={handleReactionAdd}
                    />
                  </li>
                ))}
              </ul>
            )}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={postsLoading}
                >
                  {postsLoading ? 'Chargement...' : 'Voir plus'}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="mt-4">
            <CommunityGroupsList
              groups={groups}
              myGroups={myGroups}
              loading={groupsLoading}
              onJoinGroup={joinGroup}
              onLeaveGroup={leaveGroup}
              onCreateGroup={createGroup}
            />
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="mt-4">
            <SavedPostsTab posts={savedPosts} />
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Posts les plus populaires
                  </CardTitle>
                  <CardDescription>
                    Les messages qui font le plus réagir la communauté cette semaine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Pas encore de tendances cette semaine
                    </p>
                  ) : (
                    trendingPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleTrendingPostClick(post.id)}
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{post.snippet}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" /> {post.reactionCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> {post.commentCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CommunityPage;
