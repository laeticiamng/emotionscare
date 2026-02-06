import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Send, Trash2, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { logger } from '@/lib/logger';

interface Post {
  id: string;
  user_id: string;
  content: string;
  mood: string;
  is_anonymous: boolean;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
}

const CommunityDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostMood, setNewPostMood] = useState('neutral');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
  const { toast } = useToast();

  const moods = [
    { value: 'happy', label: '😊 Heureux', color: 'bg-green-500' },
    { value: 'calm', label: '😌 Calme', color: 'bg-blue-500' },
    { value: 'anxious', label: '😰 Anxieux', color: 'bg-yellow-500' },
    { value: 'sad', label: '😢 Triste', color: 'bg-gray-500' },
    { value: 'energetic', label: '⚡ Énergique', color: 'bg-orange-500' },
    { value: 'neutral', label: '😐 Neutre', color: 'bg-slate-500' },
  ];

  useEffect(() => {
    loadPosts();
    loadStats();
  }, []);

  const loadPosts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('community/posts', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.data?.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      logger.error('Error loading posts', error, 'UI');
    }
  };

  const loadStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('community/stats', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      logger.error('Error loading stats', error, 'UI');
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke(`community/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      logger.error('Error loading comments', error, 'UI');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le contenu ne peut pas être vide',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const response = await supabase.functions.invoke('community/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          content: newPost,
          mood: newPostMood,
          isAnonymous,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: 'Succès',
        description: 'Votre message a été publié',
      });

      setNewPost('');
      setNewPostMood('neutral');
      setIsAnonymous(false);
      loadPosts();
      loadStats();
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke(`community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      loadPosts();
    } catch (error) {
      logger.error('Error liking post', error, 'UI');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke(`community/posts/${selectedPost}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          content: newComment,
          isAnonymous,
        },
      });

      setNewComment('');
      loadComments(selectedPost);
      loadStats();
      toast({
        title: 'Succès',
        description: 'Commentaire ajouté',
      });
    } catch (error) {
      logger.error('Error adding comment', error, 'UI');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke(`community/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      toast({
        title: 'Succès',
        description: 'Message supprimé',
      });

      loadPosts();
      loadStats();
    } catch (error) {
      logger.error('Error deleting post', error, 'UI');
    }
  };

  const getMoodBadge = (mood: string) => {
    const moodConfig = moods.find(m => m.value === mood);
    return moodConfig || moods[moods.length - 1];
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Communauté et Partage Sécurisé
          </CardTitle>
          <CardDescription>
            Partagez votre parcours émotionnel en toute sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalPosts}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalComments}</div>
                <div className="text-sm text-muted-foreground">Commentaires</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Likes donnés</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nouveau message</h3>
            <Textarea
              placeholder="Partagez vos pensées, vos progrès ou demandez des conseils..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <div className="space-y-2">
              <Label>Comment vous sentez-vous ?</Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={newPostMood === mood.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewPostMood(mood.value)}
                  >
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                id="anonymous"
              />
              <Label htmlFor="anonymous">Publier de manière anonyme</Label>
            </div>

            <Button onClick={handleCreatePost} disabled={loading} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Publier
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fil de la communauté</h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {posts.map((post) => {
                  const moodBadge = getMoodBadge(post.mood);
                  const isExpanded = selectedPost === post.id;

                  return (
                    <Card key={post.id}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={moodBadge.color}>
                              {moodBadge.label}
                            </Badge>
                            {post.is_anonymous && (
                              <Badge variant="outline">Anonyme</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm">{post.content}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                          >
                            <Heart className="mr-1 h-4 w-4" />
                            {post.likes_count || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(isExpanded ? null : post.id);
                              if (!isExpanded) loadComments(post.id);
                            }}
                          >
                            <MessageCircle className="mr-1 h-4 w-4" />
                            {post.comments_count || 0}
                          </Button>
                          <span className="ml-auto text-xs">
                            {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="space-y-3 pt-3 border-t">
                            <div className="space-y-2">
                              {comments.map((comment) => (
                                <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                                  {comment.is_anonymous && (
                                    <Badge variant="outline" className="mb-2">Anonyme</Badge>
                                  )}
                                  <p className="text-sm">{comment.content}</p>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(comment.created_at).toLocaleString('fr-FR')}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <Input
                                placeholder="Ajouter un commentaire..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <Button size="sm" onClick={handleAddComment}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDashboard;
