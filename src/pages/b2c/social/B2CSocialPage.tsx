
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, Plus, Users, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  created_at: string;
  likes: number;
  comments: number;
  emotion_score?: number;
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
    try {
      setIsLoading(true);
      
      // Mock data for now - in real app, this would come from Supabase
      const mockPosts: Post[] = [
        {
          id: '1',
          content: "Journée formidable aujourd'hui ! J'ai réussi à méditer 20 minutes ce matin et je me sens beaucoup plus serein. 🧘‍♂️",
          author: { name: 'Marie Dupont', avatar: '' },
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          comments: 3,
          emotion_score: 0.85
        },
        {
          id: '2',
          content: "Quelqu'un a des conseils pour gérer le stress au travail ? Je traverse une période difficile... 😰",
          author: { name: 'Thomas Martin', avatar: '' },
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 8,
          comments: 7,
          emotion_score: 0.3
        },
        {
          id: '3',
          content: "Merci à cette communauté pour tout le soutien ! Grâce à vos conseils, j'ai retrouvé ma motivation. ❤️",
          author: { name: 'Sophie Laurent', avatar: '' },
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: 25,
          comments: 12,
          emotion_score: 0.9
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Erreur lors du chargement des publications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;
    
    try {
      setIsPosting(true);
      
      // In real app, this would save to Supabase
      const newPostData: Post = {
        id: Date.now().toString(),
        content: newPost,
        author: {
          name: user.user_metadata?.name || user.email || 'Utilisateur',
          avatar: user.user_metadata?.avatar_url
        },
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0
      };
      
      setPosts(prev => [newPostData, ...prev]);
      setNewPost('');
      toast.success('Publication partagée !');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    toast.success('❤️ Publication aimée !');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Il y a 1 jour';
    return `Il y a ${diffInDays} jours`;
  };

  const getEmotionColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.7) return 'text-green-500';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement de l'espace social..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Espace Social</h1>
          <p className="text-muted-foreground">
            Partagez votre parcours bien-être avec la communauté
          </p>
        </header>

        {/* Create Post */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Partager votre expérience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Comment vous sentez-vous aujourd'hui ? Partagez votre expérience..."
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {newPost.length}/500 caractères
              </p>
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim() || isPosting}
              >
                {isPosting ? 'Publication...' : 'Publier'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">1,247</p>
                <p className="text-sm text-muted-foreground">Membres actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-semibold">3,521</p>
                <p className="text-sm text-muted-foreground">Likes cette semaine</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">892</p>
                <p className="text-sm text-muted-foreground">Messages partagés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{post.author.name}</h3>
                      {post.emotion_score && (
                        <div className={`flex items-center gap-1 ${getEmotionColor(post.emotion_score)}`}>
                          <Smile className="h-4 w-4" />
                          <span className="text-sm">{Math.round(post.emotion_score * 100)}%</span>
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(post.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-foreground mb-4 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="gap-2 hover:text-red-500"
                      >
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="gap-2 hover:text-blue-500">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="gap-2 hover:text-green-500">
                        <Share2 className="h-4 w-4" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={loadPosts}>
            Charger plus de publications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2CSocialPage;
