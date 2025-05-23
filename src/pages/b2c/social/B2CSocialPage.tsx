
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Heart, Share, Send, Users, Globe, User, BellPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  hasLiked: boolean;
}

interface UserSuggestion {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
}

const B2CSocialPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  
  // Simulation de chargement des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Attente simulée pour l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Posts simulés
      const mockPosts: Post[] = [
        {
          id: '1',
          author: {
            id: '2',
            name: 'Sophie Martin',
            avatar: undefined
          },
          content: "J'ai médité ce matin et je me sens tellement plus calme et concentrée aujourd'hui. Quelqu'un d'autre pratique la méditation ici?",
          likes: 12,
          comments: 4,
          timestamp: '2h',
          hasLiked: false
        },
        {
          id: '2',
          author: {
            id: '3',
            name: 'Thomas Dubois',
            avatar: undefined
          },
          content: "J'ai eu une journée difficile aujourd'hui, mais j'ai utilisé les techniques de respiration que j'ai apprises ici et ça m'a vraiment aidé à gérer mon stress.",
          likes: 8,
          comments: 2,
          timestamp: '5h',
          hasLiked: true
        },
        {
          id: '3',
          author: {
            id: '4',
            name: 'Julie Petit',
            avatar: undefined
          },
          content: "Petit rappel: n'oubliez pas de prendre soin de vous aujourd'hui ! Même 5 minutes de pause peuvent faire une différence dans votre bien-être émotionnel.",
          likes: 23,
          comments: 7,
          timestamp: '1j',
          hasLiked: false
        }
      ];
      
      // Suggestions d'amis simulées
      const mockSuggestions: UserSuggestion[] = [
        {
          id: '5',
          name: 'Marie Bernard',
          bio: 'Coach en bien-être et méditation',
          avatar: undefined
        },
        {
          id: '6',
          name: 'Pierre Lambert',
          bio: 'Passionné de développement personnel',
          avatar: undefined
        },
        {
          id: '7',
          name: 'Claire Moulin',
          bio: 'Psychologue et praticienne en pleine conscience',
          avatar: undefined
        }
      ];
      
      setPosts(mockPosts);
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) return;
    
    setIsPosting(true);
    
    // Simuler le temps de traitement de l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: user?.id || '0',
        name: user?.name || 'Utilisateur',
        avatar: undefined
      },
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'à l\'instant',
      hasLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsPosting(false);
    toast.success("Votre message a été publié!");
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };
  
  const handleFollow = (userId: string) => {
    toast.success("Abonnement effectué !");
    // Logique pour suivre l'utilisateur
  };
  
  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Espace Social</h1>
          <p className="text-muted-foreground">
            Partagez votre parcours émotionnel et connectez-vous avec d'autres
          </p>
        </div>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handlePostSubmit}>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Partagez ce que vous ressentez..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={!newPostContent.trim() || isPosting}
                      >
                        {isPosting ? (
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
              </form>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Fil d'actualités
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Communautés
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mon profil
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Chargement du fil d'actualités...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Aucune publication</h3>
                  <p className="text-muted-foreground mb-4">
                    Soyez le premier à partager quelque chose !
                  </p>
                </div>
              ) : (
                posts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                          {post.author.avatar && <AvatarImage src={post.author.avatar} />}
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">Il y a {post.timestamp}</p>
                        </div>
                      </div>
                      
                      <p className="mb-4">{post.content}</p>
                      
                      <div className="flex justify-between items-center border-t pt-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className={post.hasLiked ? "text-red-500" : ""}
                        >
                          <Heart className={`mr-1 h-4 w-4 ${post.hasLiked ? "fill-current" : ""}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="mr-1 h-4 w-4" />
                          Partager
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="community" className="mt-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Communautés émotionnelles</h3>
                  <p className="text-muted-foreground mb-6">
                    Rejoignez des groupes partageant des défis similaires ou des objectifs communs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { name: "Gestion du stress", members: 128, category: "Bien-être" },
                      { name: "Méditation quotidienne", members: 94, category: "Pleine conscience" },
                      { name: "Équilibre travail-vie", members: 203, category: "Carrière" },
                      { name: "Pensées positives", members: 156, category: "Développement personnel" }
                    ].map((group, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <h4 className="font-medium">{group.name}</h4>
                          <p className="text-xs text-muted-foreground">{group.category}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm">{group.members} membres</p>
                            <Button size="sm">
                              Rejoindre
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button variant="outline">
                    Voir toutes les communautés
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Avatar className="h-20 w-20 mr-4">
                      <AvatarFallback className="text-xl">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{user?.name || 'Utilisateur'}</CardTitle>
                      <CardDescription>{user?.email || ''}</CardDescription>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <p className="font-medium">12</p>
                          <p className="text-xs text-muted-foreground">Publications</p>
                        </div>
                        <div>
                          <p className="font-medium">48</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div>
                          <p className="font-medium">52</p>
                          <p className="text-xs text-muted-foreground">Following</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">À propos</h3>
                    <p className="text-sm text-muted-foreground">
                      Aucune bio renseignée. Ajoutez des informations sur vous pour vous présenter à la communauté.
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Éditer le profil
                  </Button>
                </CardContent>
                <CardFooter>
                  <div className="space-y-4 w-full">
                    <h3 className="font-medium">Vos publications récentes</h3>
                    
                    {posts.filter(post => post.author.id === user?.id).length === 0 ? (
                      <div className="text-center py-6">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Vous n'avez pas encore publié de contenu
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {posts
                          .filter(post => post.author.id === user?.id)
                          .map(post => (
                            <Card key={post.id}>
                              <CardContent className="p-4">
                                <p className="text-sm">{post.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Il y a {post.timestamp} • {post.likes} likes • {post.comments} commentaires
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>Personnes susceptibles de vous intéresser</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map(person => (
                    <div key={person.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          {person.avatar && <AvatarImage src={person.avatar} />}
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.bio}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFollow(person.id)}
                      >
                        Suivre
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tendances</CardTitle>
              <CardDescription>Sujets populaires aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { tag: "#BienEtreEmotionnel", posts: 342 },
                    { tag: "#GestionDuStress", posts: 256 },
                    { tag: "#PleinConscience", posts: 198 },
                    { tag: "#PsychologiePositive", posts: 157 },
                  ].map((trend, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium text-sm hover:text-primary cursor-pointer">
                        {trend.tag}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trend.posts} publications
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full flex justify-center items-center gap-2">
                <BellPlus className="h-4 w-4" />
                Activer les notifications de tendances
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CSocialPage;
