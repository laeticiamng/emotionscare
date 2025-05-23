
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Users, 
  Send,
  Loader2,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  content: string;
  user_id: string;
  date: string;
  reactions: number;
  image_url?: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  date: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

const B2CSocialPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setUserMode('b2c');
    fetchPosts();
  }, [setUserMode]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement des posts');
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('posts')
        .insert([
          {
            content: newPostContent,
            user_id: user?.id,
            reactions: 0
          }
        ]);

      if (error) throw error;

      setNewPostContent('');
      toast.success('Post publié avec succès !');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const likePost = async (postId: string, currentReactions: number) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ reactions: currentReactions + 1 })
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Erreur lors du like');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('date', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Erreur lors du chargement des commentaires');
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            content: newComment,
            user_id: user?.id,
            post_id: selectedPost.id
          }
        ]);

      if (error) throw error;

      setNewComment('');
      toast.success('Commentaire ajouté !');
      fetchComments(selectedPost.id);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre espace social...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/b2c/dashboard')}>
              ← Tableau de bord
            </Button>
            <h1 className="text-xl font-bold">Espace Social B2C</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">
              <MessageCircle className="h-4 w-4 mr-2" />
              Fil d'actualité
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-2" />
              Créer un post
            </TabsTrigger>
            <TabsTrigger value="community">
              <Users className="h-4 w-4 mr-2" />
              Communauté
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Aucun post disponible</h3>
                  <p className="text-muted-foreground mb-4">
                    Soyez le premier à partager quelque chose !
                  </p>
                  <Button onClick={() => navigate('/b2c/social?tab=create')}>
                    Créer un post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={post.profiles?.avatar_url} />
                        <AvatarFallback>
                          {post.profiles?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.profiles?.name || 'Utilisateur'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt="Post image" 
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => likePost(post.id, post.reactions)}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {post.reactions}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
                          fetchComments(post.id);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Commenter
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Créer un nouveau post</CardTitle>
                <CardDescription>
                  Partagez vos pensées avec la communauté
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Qu'avez-vous en tête ?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Smile className="h-4 w-4 mr-2" />
                      Emoji
                    </Button>
                  </div>
                  <Button 
                    onClick={createPost}
                    disabled={!newPostContent.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Votre communauté</CardTitle>
                <CardDescription>
                  Connectez-vous avec d'autres utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Fonctionnalité en développement</h3>
                  <p className="text-muted-foreground">
                    La gestion de communauté sera bientôt disponible
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Comments Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Commentaires</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedPost(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <p className="font-medium">{selectedPost.profiles?.name}</p>
                  <p>{selectedPost.content}</p>
                </div>
                
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profiles?.avatar_url} />
                        <AvatarFallback>
                          {comment.profiles?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{comment.profiles?.name}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={addComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2CSocialPage;
