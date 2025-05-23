
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Users, 
  Heart, 
  MessageSquare, 
  Share2, 
  Plus,
  Search,
  Filter,
  ThumbsUp,
  Send
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  category: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
}

const B2CSocialPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      setIsLoading(true);
      
      // Simuler le chargement des données sociales
      setTimeout(() => {
        const mockPosts: Post[] = [
          {
            id: '1',
            author: 'Sarah M.',
            content: 'Après une semaine difficile au travail, j\'ai essayé la méditation guidée de 10 minutes. Quelle différence ! Je me sens beaucoup plus calme. 🧘‍♀️',
            timestamp: '2h',
            likes: 12,
            comments: 3,
            isLiked: false,
            category: 'meditation'
          },
          {
            id: '2',
            author: 'Marc L.',
            content: 'Partage du jour : j\'ai réussi à maintenir ma série de check-ins émotionnels pendant 30 jours ! Merci à cette communauté pour le soutien 💪',
            timestamp: '4h',
            likes: 25,
            comments: 8,
            isLiked: true,
            category: 'achievement'
          },
          {
            id: '3',
            author: 'Julie K.',
            content: 'Quelqu\'un a-t-il des conseils pour gérer l\'anxiété avant une présentation importante ? Je cherche des techniques qui marchent vraiment.',
            timestamp: '6h',
            likes: 7,
            comments: 15,
            isLiked: false,
            category: 'advice'
          }
        ];

        const mockCommunities: Community[] = [
          {
            id: '1',
            name: 'Méditation & Pleine Conscience',
            description: 'Partagez vos expériences de méditation et techniques de mindfulness',
            members: 247,
            category: 'meditation',
            isJoined: true
          },
          {
            id: '2',
            name: 'Gestion du Stress',
            description: 'Conseils et soutien pour mieux gérer le stress quotidien',
            members: 189,
            category: 'stress',
            isJoined: false
          },
          {
            id: '3',
            name: 'Parentalité Bienveillante',
            description: 'Ressources et soutien pour les parents',
            members: 156,
            category: 'parenting',
            isJoined: true
          },
          {
            id: '4',
            name: 'Vie Professionnelle',
            description: 'Équilibre travail-vie personnelle et bien-être au travail',
            members: 203,
            category: 'work',
            isJoined: false
          }
        ];

        setPosts(mockPosts);
        setCommunities(mockCommunities);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Erreur lors du chargement des données sociales:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données sociales",
        variant: "error"
      });
      setIsLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(communities.map(community =>
      community.id === communityId
        ? { 
            ...community, 
            isJoined: !community.isJoined,
            members: community.isJoined ? community.members - 1 : community.members + 1
          }
        : community
    ));
    
    toast({
      title: community.isJoined ? "Communauté quittée" : "Communauté rejointe",
      description: community.isJoined ? "Vous avez quitté la communauté" : "Bienvenue dans la communauté !",
      variant: "success"
    });
  };

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const newPostObj: Post = {
      id: Date.now().toString(),
      author: user?.name || 'Utilisateur',
      content: newPost,
      timestamp: 'maintenant',
      likes: 0,
      comments: 0,
      isLiked: false,
      category: 'general'
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    
    toast({
      title: "Publication partagée !",
      description: "Votre message a été publié dans la communauté",
      variant: "success"
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de l'espace social..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/b2c/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Espace Social</h1>
          <p className="text-muted-foreground">
            Connectez-vous avec la communauté EmotionsCare
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Communauté
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
          <TabsTrigger value="communities">Communautés</TabsTrigger>
          <TabsTrigger value="my-activity">Mon activité</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Nouvelle publication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Partager avec la communauté
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Que ressentez-vous aujourd'hui ? Partagez votre expérience..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Votre message sera visible par tous les membres de la communauté
                </div>
                <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>

          {/* Publications */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{post.author.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm text-muted-foreground">Il y a {post.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  
                  <p className="mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={post.isLiked ? "text-red-500" : ""}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <CardDescription>{community.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{community.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {community.members} membres
                    </div>
                    <Button
                      variant={community.isJoined ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleJoinCommunity(community.id)}
                    >
                      {community.isJoined ? 'Quitter' : 'Rejoindre'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mon activité sociale</CardTitle>
              <CardDescription>Vos contributions à la communauté</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Votre historique d'activité sociale apparaîtra ici
                </p>
                <Button onClick={() => navigate('/b2c/social')}>
                  Commencer à participer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CSocialPage;
