
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { motion } from "framer-motion";
import { Loader2, Heart, MessageSquare, Share2, UserPlus, Send, Users, Calendar, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Shell from '@/Shell';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Données factices pour la démonstration
const mockPosts = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Marie Dubois',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: "J'ai essayé la méditation guidée aujourd'hui et je me sens tellement plus détendue ! Quelqu'un d'autre l'utilise régulièrement ?",
    timestamp: '2023-05-22T14:23:00Z',
    likes: 24,
    comments: 8,
    liked: false,
    category: 'méditation'
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Thomas Martin',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    content: "La dernière session de respiration profonde a vraiment aidé à réduire mon stress au travail. Je recommande vivement à tous ceux qui font face à des journées chargées !",
    timestamp: '2023-05-21T09:15:00Z',
    likes: 17,
    comments: 5,
    liked: true,
    category: 'respiration'
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Sophie Bernard',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    content: "J'ai terminé ma première semaine de suivi émotionnel et les résultats sont fascinants. Je commence à voir des modèles clairs dans mes fluctuations d'humeur.",
    timestamp: '2023-05-20T16:40:00Z',
    likes: 32,
    comments: 12,
    liked: false,
    category: 'émotions'
  }
];

const mockEvents = [
  {
    id: 'event1',
    title: 'Atelier de Méditation Pleine Conscience',
    description: 'Apprenez les techniques de base de la méditation pleine conscience pour réduire le stress quotidien.',
    date: '2023-06-05',
    time: '18:00',
    duration: '1h30',
    location: 'En ligne',
    host: 'Dr. Claire Fontaine',
    participants: 18,
    maxParticipants: 30,
    category: 'méditation',
    joined: false
  },
  {
    id: 'event2',
    title: 'Groupe de Soutien - Gestion du Stress',
    description: 'Partagez vos expériences et stratégies pour gérer le stress au travail dans un environnement bienveillant.',
    date: '2023-06-10',
    time: '12:00',
    duration: '1h',
    location: 'En ligne',
    host: 'Marc Leroy, Psychologue',
    participants: 12,
    maxParticipants: 15,
    category: 'soutien',
    joined: true
  },
  {
    id: 'event3',
    title: 'Séance de Respiration Guidée',
    description: 'Techniques de respiration pour l\'anxiété et l\'amélioration du sommeil.',
    date: '2023-06-12',
    time: '20:00',
    duration: '45min',
    location: 'En ligne',
    host: 'Emma Durand',
    participants: 25,
    maxParticipants: 50,
    category: 'respiration',
    joined: false
  }
];

const mockGroups = [
  {
    id: 'group1',
    name: 'Méditation Quotidienne',
    description: 'Groupe pour partager des conseils et expériences de méditation quotidienne',
    members: 128,
    category: 'méditation',
    joined: true,
    avatar: '🧘‍♀️'
  },
  {
    id: 'group2',
    name: 'Vaincre l\'Anxiété',
    description: 'Soutien mutuel pour surmonter l\'anxiété et le stress',
    members: 256,
    category: 'anxiété',
    joined: false,
    avatar: '🌱'
  },
  {
    id: 'group3',
    name: 'Sommeil et Récupération',
    description: 'Astuces et discussions pour améliorer la qualité du sommeil',
    members: 97,
    category: 'sommeil',
    joined: false,
    avatar: '😴'
  },
  {
    id: 'group4',
    name: 'Bien-être au Travail',
    description: 'Stratégies pour maintenir son équilibre émotionnel en milieu professionnel',
    members: 189,
    category: 'travail',
    joined: true,
    avatar: '💼'
  }
];

// Composant pour les commentaires
const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        // Simuler le chargement des commentaires
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setComments([
          {
            id: `comment-${postId}-1`,
            author: { name: 'Jean Dupont', avatar: 'https://i.pravatar.cc/150?img=4' },
            content: 'Je suis totalement d\'accord ! La méditation a changé ma vie.',
            timestamp: '2023-05-22T15:30:00Z'
          },
          {
            id: `comment-${postId}-2`,
            author: { name: 'Léa Martin', avatar: 'https://i.pravatar.cc/150?img=5' },
            content: 'Quelles techniques utilisez-vous ? J\'aimerais essayer aussi !',
            timestamp: '2023-05-22T16:05:00Z'
          }
        ]);
      } catch (error) {
        toast.error('Impossible de charger les commentaires');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Simuler l'envoi du commentaire
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newCommentObj = {
        id: `comment-${postId}-${Date.now()}`,
        author: { name: 'Vous', avatar: 'https://i.pravatar.cc/150?img=8' },
        content: newComment,
        timestamp: new Date().toISOString()
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      toast.success('Commentaire ajouté');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <h4 className="font-medium">Commentaires</h4>
      
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://i.pravatar.cc/150?img=8" alt="Votre avatar" />
          <AvatarFallback>Vous</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea 
            placeholder="Ajouter un commentaire..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px]"
          />
          <Button 
            size="sm" 
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
            className="ml-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publier
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleDateString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex mt-1 text-xs text-muted-foreground">
                  <button className="hover:text-foreground">J'aime</button>
                  <span className="mx-2">•</span>
                  <button className="hover:text-foreground">Répondre</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </p>
      )}
    </div>
  );
};

const SocialCocoon: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostingContent, setIsPostingContent] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simuler le chargement des données depuis une API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPosts(mockPosts);
        setEvents(mockEvents);
        setGroups(mockGroups);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur de chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Aimer un post
  const toggleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !post.liked, 
              likes: post.liked ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );
    
    const targetPost = posts.find(post => post.id === postId);
    const action = targetPost?.liked ? "retiré" : "ajouté";
    toast.success(`J'aime ${action}`);
  };
  
  // Joindre ou quitter un événement
  const toggleJoinEvent = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              joined: !event.joined,
              participants: event.joined 
                ? event.participants - 1 
                : event.participants + 1
            }
          : event
      )
    );
    
    const targetEvent = events.find(event => event.id === eventId);
    const action = targetEvent?.joined ? "quitté" : "rejoint";
    toast.success(`Vous avez ${action} l'événement`);
  };
  
  // Joindre ou quitter un groupe
  const toggleJoinGroup = (groupId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              joined: !group.joined,
              members: group.joined 
                ? group.members - 1 
                : group.members + 1 
            }
          : group
      )
    );
    
    const targetGroup = groups.find(group => group.id === groupId);
    const action = targetGroup?.joined ? "quitté" : "rejoint";
    toast.success(`Vous avez ${action} le groupe`);
  };
  
  // Publier un nouveau post
  const handlePostContent = async () => {
    if (!newPostContent.trim()) {
      toast.error("Veuillez écrire quelque chose avant de publier");
      return;
    }
    
    setIsPostingContent(true);
    
    try {
      // Simuler l'envoi à une API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          id: user?.id || 'current-user',
          name: user?.name || 'Vous',
          avatar: user?.avatar || 'https://i.pravatar.cc/150?img=4'
        },
        content: newPostContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        liked: false,
        category: 'général'
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostContent('');
      toast.success("Publication ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la publication");
    } finally {
      setIsPostingContent(false);
    }
  };
  
  // Filtrer les groupes/événements en fonction de la recherche
  const filteredGroups = searchTerm 
    ? groups.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups;
    
  const filteredEvents = searchTerm
    ? events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : events;

  // Si les données sont en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <h2 className="mt-4 text-xl font-medium">Chargement de votre espace social...</h2>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Social Cocoon</h1>
          
          <Tabs defaultValue="feed" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="groups">Groupes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Formulaire de publication */}
                <Card>
                  <CardHeader>
                    <CardTitle>Partagez quelque chose</CardTitle>
                    <CardDescription>Comment vous sentez-vous aujourd'hui ?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Qu'avez-vous en tête ?"
                      className="min-h-[100px] mb-2"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      disabled={isPostingContent}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Ajouter une photo</Button>
                    <Button 
                      onClick={handlePostContent}
                      disabled={isPostingContent || !newPostContent.trim()}
                    >
                      {isPostingContent ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Publication en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Publier
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Liste des publications */}
                {posts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <Card id={`post-${post.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base font-medium">{post.author.name}</CardTitle>
                            <CardDescription>{formatDate(post.timestamp)}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base">{post.content}</p>
                        {post.category && (
                          <Badge variant="outline" className="mt-2">
                            {post.category}
                          </Badge>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between pt-3 border-t">
                        <div className="flex space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center space-x-1 text-muted-foreground"
                            onClick={() => toggleLikePost(post.id)}
                          >
                            <Heart className={`h-4 w-4 ${post.liked ? "fill-red-500 text-red-500" : ""}`} />
                            <span>{post.likes}</span>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center space-x-1 text-muted-foreground"
                            onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/social-cocoon#post-${post.id}`);
                            toast.success("Lien de partage copié dans le presse-papier");
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Partager</span>
                        </Button>
                      </CardFooter>
                      
                      {/* Section de commentaires (conditionnelle) */}
                      {expandedPost === post.id && (
                        <CommentSection postId={post.id} />
                      )}
                    </Card>
                  </motion.div>
                ))}
                
                {posts.length === 0 && (
                  <Card className="py-12">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Aucune publication pour le moment</h3>
                      <p className="text-muted-foreground mt-2">Soyez le premier à partager quelque chose !</p>
                    </div>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="events">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Événements à venir</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un événement..."
                        className="pl-9 w-full max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button size="sm" onClick={() => toast.info("Création d'événements disponible prochainement")}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Créer
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <motion.div key={event.id} variants={itemVariants}>
                        <Card>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <Calendar className="h-4 w-4 mr-1" /> 
                                  {event.date} à {event.time} • 
                                  <Clock className="h-4 w-4 mx-1" /> 
                                  {event.duration}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">
                                {event.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{event.description}</p>
                            
                            <div className="flex justify-between text-sm">
                              <p className="text-muted-foreground">
                                <span className="font-medium">Lieu:</span> {event.location}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-medium">Animateur:</span> {event.host}
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>
                                {event.participants}/{event.maxParticipants} participants
                              </span>
                            </div>
                            
                            <Button 
                              variant={event.joined ? "outline" : "default"}
                              onClick={() => toggleJoinEvent(event.id)}
                            >
                              {event.joined ? "Quitter" : "Participer"}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card className="py-12">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-medium mt-4">Aucun événement trouvé</h3>
                        {searchTerm ? (
                          <p className="text-muted-foreground mt-2">
                            Aucun événement ne correspond à votre recherche
                          </p>
                        ) : (
                          <p className="text-muted-foreground mt-2">
                            Aucun événement n'est prévu pour le moment
                          </p>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="groups">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Groupes de soutien</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un groupe..."
                        className="pl-9 w-full max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => toast.info("Création de groupes disponible prochainement")}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Créer un groupe
                    </Button>
                  </div>
                </div>
                
                {filteredGroups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredGroups.map((group) => (
                      <motion.div key={group.id} variants={itemVariants}>
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                  {group.avatar}
                                </div>
                                <div>
                                  <CardTitle className="text-base font-medium">{group.name}</CardTitle>
                                  <CardDescription className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" /> 
                                    {group.members} membres
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {group.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-3 border-t">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                toast.info(`Détails du groupe "${group.name}" disponible prochainement`);
                                // Navigator vers la page détaillée du groupe
                              }}
                            >
                              Voir détails
                            </Button>
                            
                            <Button 
                              size="sm"
                              variant={group.joined ? "outline" : "default"}
                              onClick={() => toggleJoinGroup(group.id)}
                            >
                              {group.joined ? "Quitter" : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Rejoindre
                                </>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="py-12">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium mt-4">Aucun groupe trouvé</h3>
                      {searchTerm ? (
                        <p className="text-muted-foreground mt-2">
                          Aucun groupe ne correspond à votre recherche
                        </p>
                      ) : (
                        <p className="text-muted-foreground mt-2">
                          Aucun groupe n'est disponible pour le moment
                        </p>
                      )}
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm('');
                          toast.info("Création de groupe disponible prochainement");
                        }}
                      >
                        Créer un nouveau groupe
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Shell>
  );
};

export default SocialCocoon;
