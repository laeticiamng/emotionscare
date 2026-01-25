import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Filter, 
  TrendingUp,
  Users,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface Post {
  id: string;
  content: string;
  category: string;
  is_anonymous: boolean;
  created_at: string;
  reactions: { count: number }[];
  comments: { count: number }[];
}

interface CommunityStats {
  total_posts: number;
  total_comments: number;
  total_reactions_received: number;
}

export default function CommunityHubEnhanced() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'my_posts' | 'favorites'>('all');
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadPosts();
    loadStats();
  }, [filter]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('community-hub', {
        body: { action: 'list_posts', filter, limit: 20, offset: 0 }
      });

      if (error) throw error;
      if (data?.posts) setPosts(data.posts);
    } catch (error) {
      logger.error('Erreur chargement posts', error as Error, 'UI');
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('community-hub', {
        body: { action: 'get_stats' }
      });

      if (error) throw error;
      if (data?.stats) setStats(data.stats);
    } catch (error) {
      logger.error('Erreur chargement stats', error as Error, 'UI');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer du contenu',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('community-hub', {
        body: {
          action: 'create_post',
          content: newPost,
          category: 'general',
          is_anonymous: false,
          tags: []
        }
      });

      if (error) throw error;

      toast({
        title: 'Post créé',
        description: 'Votre post a été publié avec succès'
      });

      setNewPost('');
      loadPosts();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer le post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReaction = async (postId: string) => {
    try {
      const { error } = await supabase.functions.invoke('community-hub', {
        body: {
          action: 'add_reaction',
          post_id: postId,
          reaction_type: 'heart'
        }
      });

      if (error) throw error;

      toast({
        title: 'Réaction ajoutée',
        description: '❤️'
      });

      loadPosts();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;

    try {
      const { error } = await supabase.functions.invoke('community-hub', {
        body: {
          action: 'add_comment',
          post_id: postId,
          content: commentText
        }
      });

      if (error) throw error;

      toast({
        title: 'Commentaire ajouté',
        description: 'Votre commentaire a été publié'
      });

      setCommentText('');
      setSelectedPost(null);
      loadPosts();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header avec stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_posts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_comments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réactions reçues</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_reactions_received || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Création de post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Partager avec la communauté
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Contenu modéré par IA pour votre sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Partagez vos pensées, vos progrès ou demandez du soutien..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[120px]"
          />
          <Button 
            onClick={handleCreatePost} 
            disabled={loading || !newPost.trim()}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Publication...' : 'Publier'}
          </Button>
        </CardContent>
      </Card>

      {/* Filtres */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          <Users className="w-4 h-4 mr-2" />
          Tous
        </Button>
        <Button
          variant={filter === 'my_posts' ? 'default' : 'outline'}
          onClick={() => setFilter('my_posts')}
          size="sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          Mes posts
        </Button>
      </div>

      {/* Feed de posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun post pour le moment</p>
              <p className="text-sm mt-2">Soyez le premier à partager !</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddReaction(post.id)}
                    className="gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {post.reactions?.[0]?.count || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    className="gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments?.[0]?.count || 0}
                  </Button>
                </div>

                {selectedPost === post.id && (
                  <div className="space-y-3 pt-3 border-t">
                    <Textarea
                      placeholder="Écrivez un commentaire..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentText.trim()}
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Commenter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
