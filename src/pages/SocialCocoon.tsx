
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, ThumbsUp, MessageCircle, HeartHandshake } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';

const SocialCocoon: React.FC = () => {
  const { userMode } = useUserMode();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  
  // Charger les posts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Générer des posts fictifs
        const dummyPosts = Array.from({ length: 5 }, (_, i) => ({
          id: i,
          author: {
            name: `Utilisateur ${i + 1}`,
            avatar: null,
            role: i % 3 === 0 ? 'b2c' : i % 3 === 1 ? 'b2b_user' : 'b2b_admin'
          },
          content: `Ceci est un exemple de post dans le cocoon social. Les utilisateurs peuvent partager leurs expériences et s'entraider. #bienetre #emotions ${i % 2 === 0 ? '#partage' : '#entraide'}`,
          likes: Math.floor(Math.random() * 20),
          comments: Math.floor(Math.random() * 5),
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
          liked: false
        }));
        
        setPosts(dummyPosts);
      } catch (error) {
        console.error('Erreur lors du chargement des posts:', error);
        toast.error('Impossible de charger les posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setPosting(true);
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ajouter le nouveau post
      const newPostObj = {
        id: Date.now(),
        author: {
          name: user?.name || 'Vous',
          avatar: user?.avatarUrl || null,
          role: userMode || 'b2c'
        },
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        liked: false
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost('');
      toast.success('Post publié avec succès');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setPosting(false);
    }
  };
  
  const handleLike = async (postId: number) => {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour le post
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      toast.error('Erreur lors de l\'action');
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };
  
  const getUserRoleLabel = (role: string) => {
    switch (role) {
      case 'b2c':
        return 'Particulier';
      case 'b2b_user':
        return 'Collaborateur';
      case 'b2b_admin':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Cocoon Social</h1>
            <p className="text-muted-foreground mt-1">
              Partagez et connectez dans un espace bienveillant
            </p>
          </div>
          <HeartHandshake className="h-8 w-8 text-primary" />
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handlePostSubmit}>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Partagez vos pensées..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="w-full resize-none"
                  />
                  <Button 
                    type="submit" 
                    className="ml-auto" 
                    disabled={posting || !newPost.trim()}
                  >
                    {posting ? (
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
            </form>
          </CardContent>
        </Card>
        
        {isLoading ? (
          // Afficher des skeleton loaders
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map(post => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{getUserRoleLabel(post.author.role)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTimestamp(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={post.liked ? 'text-primary' : ''}
                      onClick={() => handleLike(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Aucun post disponible pour le moment.</p>
              <p className="text-muted-foreground mt-2">Soyez le premier à partager !</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialCocoon;
