
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Users, 
  TrendingUp,
  Loader2,
  Send
} from 'lucide-react';

interface Post {
  id: string;
  content: string;
  user_id: string;
  date: string;
  reactions: number;
  image_url?: string;
  user_name?: string;
}

const B2CSocialPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(name)
        `)
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;

      const postsWithUserNames = data.map(post => ({
        ...post,
        user_name: post.profiles?.name || 'Utilisateur anonyme'
      }));

      setPosts(postsWithUserNames);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
      toast.error('Erreur lors du chargement des posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return;

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost.trim(),
          reactions: 0
        });

      if (error) throw error;

      setNewPost('');
      toast.success('Post publié !');
      loadPosts(); // Recharger les posts
    } catch (error) {
      console.error('Erreur création post:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string, currentReactions: number) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ reactions: currentReactions + 1 })
        .eq('id', postId);

      if (error) throw error;

      // Mettre à jour localement
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, reactions: post.reactions + 1 }
          : post
      ));
    } catch (error) {
      console.error('Erreur like post:', error);
      toast.error('Erreur lors de la réaction');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-32 mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Social Cocoon</h1>
          <p className="text-muted-foreground">
            Partagez et connectez-vous avec la communauté EmotionsCare
          </p>
        </div>

        {/* Statistiques communauté */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-muted-foreground">Membres</p>
              <p className="text-xl font-bold">1,234</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-muted-foreground">Posts</p>
              <p className="text-xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-sm text-muted-foreground">Interactions</p>
              <p className="text-xl font-bold">
                {posts.reduce((sum, post) => sum + post.reactions, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Créer un nouveau post */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Partager avec la communauté
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Partagez votre expérience, vos réflexions ou demandez conseil à la communauté..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Restez bienveillant et respectueux 💙
              </p>
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim() || isPosting}
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publier
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed des posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun post pour le moment</h3>
                <p className="text-muted-foreground mb-4">
                  Soyez le premier à partager avec la communauté !
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  {/* En-tête du post */}
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {post.user_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{post.user_name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          Membre
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Contenu du post */}
                  <div className="mb-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions du post */}
                  <div className="flex items-center space-x-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id, post.reactions)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.reactions}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => toast.info('Fonctionnalité commentaires en développement')}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Répondre
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => toast.info('Fonctionnalité partage en développement')}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Conseils communauté */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conseils pour une belle communauté</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Soyez bienveillant et respectueux dans vos échanges</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Partagez vos expériences pour aider les autres</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>N'hésitez pas à demander de l'aide quand vous en avez besoin</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CSocialPage;
