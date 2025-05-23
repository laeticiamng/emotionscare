
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Heart, MessageSquare, Users, UserPlus, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  user_id: string;
  content: string;
  date: string;
  reactions: number;
  image_url?: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  date: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

const B2CSocialPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentsVisible, setCommentsVisible] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
          user:profiles(name, avatar_url)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      
      setPosts(data as Post[]);
    } catch (err) {
      console.error('Error fetching posts:', err);
      toast.error('Impossible de charger les publications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      setPreviewImage(null);
      return;
    }

    const file = e.target.files[0];
    setSelectedImage(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier');
      return;
    }

    if (!newPost.trim() && !selectedImage) {
      toast.error('Veuillez entrer du texte ou ajouter une image');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, selectedImage);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Create post
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost,
          date: new Date().toISOString(),
          image_url: imageUrl,
          reactions: 0
        })
        .select();

      if (error) throw error;
      
      // Update UI
      const newPostWithUser = {
        ...data[0],
        user: {
          name: user.user_metadata?.name || 'Utilisateur',
          avatar_url: user.user_metadata?.avatar_url
        }
      };
      
      setPosts([newPostWithUser, ...posts]);
      setNewPost('');
      setSelectedImage(null);
      setPreviewImage(null);
      
      toast.success('Publication ajoutée !');
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (postId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour réagir');
      return;
    }

    try {
      // Find and update post in local state first for immediate feedback
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return { ...post, reactions: (post.reactions || 0) + 1 };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      
      // Update in database
      const { error } = await supabase
        .from('posts')
        .update({ reactions: updatedPosts.find(p => p.id === postId)?.reactions })
        .eq('id', postId);

      if (error) throw error;
      
      toast.success('Réaction ajoutée');
    } catch (err) {
      console.error('Error adding reaction:', err);
      toast.error('Erreur lors de l\'ajout de la réaction');
      // Revert on error
      fetchPosts();
    }
  };

  const toggleComments = async (postId: string) => {
    // Toggle visibility
    setCommentsVisible({
      ...commentsVisible,
      [postId]: !commentsVisible[postId]
    });
    
    // Fetch comments if becoming visible and not already fetched
    if (!commentsVisible[postId] && !comments[postId]) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            *,
            user:profiles(name, avatar_url)
          `)
          .eq('post_id', postId)
          .order('date', { ascending: true });

        if (error) throw error;
        
        setComments({
          ...comments,
          [postId]: data
        });
      } catch (err) {
        console.error('Error fetching comments:', err);
        toast.error('Impossible de charger les commentaires');
      }
    }
  };

  const submitComment = async (postId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) {
      toast.error('Veuillez entrer un commentaire');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: commentText,
          date: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      // Add user data to comment
      const newComment = {
        ...data[0],
        user: {
          name: user.user_metadata?.name || 'Utilisateur',
          avatar_url: user.user_metadata?.avatar_url
        }
      };
      
      // Update local state
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), newComment]
      });
      
      // Clear input
      setCommentInputs({
        ...commentInputs,
        [postId]: ''
      });
      
      toast.success('Commentaire ajouté');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-lg mb-6">
              Vous devez être connecté pour accéder à l'espace social.
            </p>
            <Button onClick={() => navigate('/b2c/login')}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Espace Social</h1>
      </div>
      
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Publications
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Communauté
          </TabsTrigger>
          <TabsTrigger value="buddies" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Buddies
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6">
          {/* New Post Form */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getInitials(user.user_metadata?.name || 'U')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Partagez vos pensées, expériences ou sentiments..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  
                  {previewImage && (
                    <div className="relative">
                      <img 
                        src={previewImage}
                        alt="Preview" 
                        className="max-h-60 rounded-md object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewImage(null);
                        }}
                      >
                        &times;
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <label className="cursor-pointer">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                      <input 
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    
                    <Button
                      onClick={submitPost}
                      disabled={isSubmitting || (!newPost.trim() && !selectedImage)}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publication...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Publier
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Posts List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune publication</h3>
                <p className="text-gray-500">
                  Soyez le premier à partager quelque chose avec la communauté !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={post.user?.avatar_url} />
                        <AvatarFallback>{getInitials(post.user?.name || 'U')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{post.user?.name || 'Utilisateur'}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(post.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    
                    <p className="mb-4 whitespace-pre-line">{post.content}</p>
                    
                    {post.image_url && (
                      <div className="mb-4">
                        <img
                          src={post.image_url}
                          alt="Post image"
                          className="rounded-md max-h-96 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleReaction(post.id)}
                      >
                        <Heart className="h-4 w-4" />
                        {post.reactions || 0}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {comments[post.id]?.length || 0}
                      </Button>
                    </div>
                    
                    {commentsVisible[post.id] && (
                      <div className="mt-4 space-y-4">
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-4">Commentaires</h4>
                          
                          {comments[post.id]?.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              Aucun commentaire pour le moment.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.user?.avatar_url} />
                                    <AvatarFallback>{getInitials(comment.user?.name || 'U')}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-muted p-3 rounded-md">
                                      <p className="font-medium text-sm">{comment.user?.name || 'Utilisateur'}</p>
                                      <p className="text-sm">{comment.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {format(new Date(comment.date), 'dd MMM yyyy, HH:mm', { locale: fr })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.user_metadata?.avatar_url} />
                              <AvatarFallback>{getInitials(user.user_metadata?.name || 'U')}</AvatarFallback>
                            </Avatar>
                            <Input
                              placeholder="Ajouter un commentaire..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs({
                                ...commentInputs,
                                [post.id]: e.target.value
                              })}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => submitComment(post.id)}
                              disabled={!commentInputs[post.id]}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Communauté EmotionsCare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Rejoignez une communauté de personnes partageant les mêmes idées qui soutiennent
                le bien-être émotionnel et le développement personnel.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Groupes de soutien</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Rejoignez des groupes thématiques centrés sur différents aspects du bien-être émotionnel.
                    </p>
                    <Button>Explorer les groupes</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Événements bien-être</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Participez à des webinaires, ateliers et sessions de méditation en groupe.
                    </p>
                    <Button>Voir le calendrier</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buddies">
          <Card>
            <CardHeader>
              <CardTitle>Système de Buddies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le système de Buddies vous permet de vous connecter avec d'autres utilisateurs 
                pour un soutien mutuel dans votre parcours de bien-être émotionnel.
              </p>
              
              <div className="bg-muted p-6 rounded-lg text-center">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trouvez un Buddy</h3>
                <p className="text-muted-foreground mb-4">
                  Connectez-vous avec une personne qui partage des objectifs similaires
                </p>
                <Button>Rechercher des Buddies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CSocialPage;
