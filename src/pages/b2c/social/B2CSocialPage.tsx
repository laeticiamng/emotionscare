
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Users, MessageSquare, Heart, Share2, Search, Plus, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

interface Post {
  id: string;
  user_id: string;
  content: string;
  reactions: number;
  image_url?: string;
  date: string;
  profiles: {
    name: string;
  };
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  date: string;
  profiles: {
    name: string;
  };
}

const B2CSocialPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (name)
        `)
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les publications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (name)
        `)
        .eq('post_id', postId)
        .order('date', { ascending: true });

      if (error) throw error;
      
      setComments(prev => ({
        ...prev,
        [postId]: data || []
      }));
    } catch (error: any) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim()) return;

    try {
      setIsPosting(true);
      const { error } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          content: newPostContent.trim()
        }]);

      if (error) throw error;

      setNewPostContent('');
      toast({
        title: "Publication créée !",
        description: "Votre message a été partagé avec la communauté.",
        variant: "success"
      });
      
      fetchPosts();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la publication",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleReactToPost = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('posts')
        .update({ reactions: post.reactions + 1 })
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => 
        prev.map(p => 
          p.id === postId 
            ? { ...p, reactions: p.reactions + 1 }
            : p
        )
      );
    } catch (error: any) {
      console.error('Error reacting to post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComments[postId]?.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content: newComments[postId].trim()
        }]);

      if (error) throw error;

      setNewComments(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      
      toast({
        title: "Commentaire ajouté !",
        variant: "success"
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
    }
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
    setExpandedPosts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingAnimation text="Chargement de l'espace social..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-green-600" />
            Espace Social
          </h1>
          <p className="text-muted-foreground mt-1">
            Partagez et connectez-vous avec la communauté EmotionsCare
          </p>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">
            <MessageSquare className="h-4 w-4 mr-2" />
            Fil d'actualité
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            Communauté
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Share2 className="h-4 w-4 mr-2" />
            Groupes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Nouvelle publication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Partager quelque chose
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Que souhaitez-vous partager avec la communauté ?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isPosting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPosting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Publications */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Aucune publication trouvée' : 'Aucune publication pour le moment'}
                  </p>
                  {!searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Soyez le premier à partager quelque chose !
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {post.profiles?.name || 'Utilisateur anonyme'}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(post.date)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{post.content}</p>
                    
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReactToPost(post.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Heart className="h-4 w-4" />
                        {post.reactions}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Commenter
                      </Button>
                    </div>

                    {/* Commentaires */}
                    {expandedPosts.has(post.id) && (
                      <div className="space-y-3 pt-4 border-t bg-gray-50 rounded-lg p-4">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="bg-white rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">
                                {comment.profiles?.name || 'Utilisateur anonyme'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.date)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))}
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Écrire un commentaire..."
                            value={newComments[post.id] || ''}
                            onChange={(e) => setNewComments(prev => ({
                              ...prev,
                              [post.id]: e.target.value
                            }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComments[post.id]?.trim()}
                            size="sm"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communauté EmotionsCare</CardTitle>
              <CardDescription>Découvrez les membres de la communauté</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bientôt, vous pourrez découvrir et suivre d'autres membres
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Groupes de soutien</CardTitle>
              <CardDescription>Rejoignez des groupes basés sur vos intérêts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bientôt, vous pourrez rejoindre des groupes thématiques
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CSocialPage;
