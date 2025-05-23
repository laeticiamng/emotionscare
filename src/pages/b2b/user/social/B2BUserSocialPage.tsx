
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Share2, Plus, Users, Calendar, Coffee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { toast } from 'sonner';

interface TeamPost {
  id: string;
  content: string;
  author: {
    name: string;
    team: string;
    avatar?: string;
  };
  created_at: string;
  likes: number;
  comments: number;
  type: 'update' | 'wellbeing' | 'event';
}

const B2BUserSocialPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadTeamPosts();
  }, []);

  const loadTeamPosts = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for team posts
      const mockPosts: TeamPost[] = [
        {
          id: '1',
          content: "Excellente session de méditation en équipe ce matin ! 🧘‍♀️ Je me sens beaucoup plus détendue pour affronter cette journée de sprint.",
          author: { name: 'Sophie Martin', team: 'Équipe Marketing', avatar: '' },
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 8,
          comments: 3,
          type: 'wellbeing'
        },
        {
          id: '2',
          content: "Reminder : notre session bien-être de groupe est prévue demain à 14h en salle de réunion B. Venez avec votre tapis de yoga ! 🧘‍♂️",
          author: { name: 'Thomas Dubois', team: 'RH', avatar: '' },
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          comments: 5,
          type: 'event'
        },
        {
          id: '3',
          content: "Après une semaine intense, mon scan émotionnel montre une amélioration de 15% ! Merci à toute l'équipe pour le soutien. 💪",
          author: { name: 'Marie Leroy', team: 'Équipe Tech', avatar: '' },
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: 15,
          comments: 7,
          type: 'wellbeing'
        },
        {
          id: '4',
          content: "Pause café improvisée au 2ème étage pour décompresser ensemble. Qui nous rejoint ? ☕",
          author: { name: 'Julie Chen', team: 'Équipe Design', avatar: '' },
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          likes: 6,
          comments: 4,
          type: 'update'
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading team posts:', error);
      toast.error('Erreur lors du chargement des publications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;
    
    try {
      setIsPosting(true);
      
      const newPostData: TeamPost = {
        id: Date.now().toString(),
        content: newPost,
        author: {
          name: user.user_metadata?.name || user.email || 'Utilisateur',
          team: 'Mon Équipe',
          avatar: user.user_metadata?.avatar_url
        },
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        type: 'update'
      };
      
      setPosts(prev => [newPostData, ...prev]);
      setNewPost('');
      toast.success('Publication partagée avec l\'équipe !');
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

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'wellbeing': return '🧘‍♀️';
      case 'event': return '📅';
      default: return '💬';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'wellbeing': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold mb-2">Espace Social Équipe</h1>
          <p className="text-muted-foreground">
            Connectez-vous avec vos collègues et partagez votre parcours bien-être
          </p>
        </header>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">42</p>
                <p className="text-sm text-muted-foreground">Collaborateurs actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-semibold">78%</p>
                <p className="text-sm text-muted-foreground">Score bien-être équipe</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">3</p>
                <p className="text-sm text-muted-foreground">Événements cette semaine</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Post */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Partager avec l'équipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Partagez vos ressentis, une victoire, ou organisez un moment convivial..."
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
                      <Badge variant="outline" className="text-xs">
                        {post.author.team}
                      </Badge>
                      <Badge className={`text-xs ${getPostTypeColor(post.type)}`}>
                        {getPostTypeIcon(post.type)}
                      </Badge>
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

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2 h-auto p-4">
                <Coffee className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Pause café</p>
                  <p className="text-sm text-muted-foreground">Organiser un moment convivial</p>
                </div>
              </Button>
              <Button variant="outline" className="gap-2 h-auto p-4">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Événement bien-être</p>
                  <p className="text-sm text-muted-foreground">Proposer une activité</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={loadTeamPosts}>
            Charger plus de publications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BUserSocialPage;
