import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageCircle, Calendar, Trophy, Star,
  Flame, Heart, Share, Plus, Search, Filter,
  MapPin, Clock, Award, Target, Sparkles,
  UserPlus, Bell, Settings, TrendingUp,
  Globe, Lock, Camera, Mic, Video
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    badge: string;
  };
  content: string;
  emotion: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  tags: string[];
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isPrivate: boolean;
  activity: 'high' | 'medium' | 'low';
  image: string;
  moderators: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'online' | 'offline' | 'hybrid';
  participants: number;
  maxParticipants: number;
  location?: string;
  tags: string[];
  host: string;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  participants: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
}

const B2CCommunityPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [posts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: {
        name: 'Marie Dubois',
        avatar: '/avatars/marie.jpg',
        level: 15,
        badge: 'Mentor Émotionnel'
      },
      content: 'Journée incroyable ! J\'ai terminé ma session de méditation matinale et je me sens complètement alignée. La technique de respiration 4-7-8 fait vraiment des merveilles. Quelqu\'un d\'autre l\'a essayée ?',
      emotion: 'sérénité',
      timestamp: '2 heures',
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ['méditation', 'respiration', 'bien-être']
    },
    {
      id: '2',
      author: {
        name: 'Lucas Martin',
        avatar: '/avatars/lucas.jpg',
        level: 8,
        badge: 'Explorateur'
      },
      content: 'Première semaine de défi "Gratitude Quotidienne" terminée ! Écrire 3 choses positives chaque matin change vraiment ma perspective. Merci à la communauté pour le soutien 🙏',
      emotion: 'gratitude',
      timestamp: '4 heures',
      likes: 31,
      comments: 12,
      shares: 7,
      media: {
        type: 'image',
        url: '/posts/gratitude-journal.jpg'
      },
      tags: ['gratitude', 'défi', 'positif']
    },
    {
      id: '3',
      author: {
        name: 'Sophie Chen',
        avatar: '/avatars/sophie.jpg',
        level: 22,
        badge: 'Coach Certifiée'
      },
      content: 'Rappel amical : Il est normal d\'avoir des hauts et des bas émotionnels. L\'important est d\'observer sans jugement et d\'accepter avec bienveillance. Vous n\'êtes pas seuls dans ce voyage ! 💝',
      emotion: 'bienveillance',
      timestamp: '6 heures',
      likes: 89,
      comments: 23,
      shares: 15,
      tags: ['soutien', 'acceptation', 'communauté']
    }
  ]);

  const [groups] = useState<CommunityGroup[]>([
    {
      id: '1',
      name: 'Méditation & Pleine Conscience',
      description: 'Partageons nos pratiques de méditation et techniques de pleine conscience',
      members: 1247,
      category: 'Bien-être',
      isPrivate: false,
      activity: 'high',
      image: '/groups/meditation.jpg',
      moderators: ['Sophie Chen', 'Marc Durand']
    },
    {
      id: '2',
      name: 'Gestion du Stress Professionnel',
      description: 'Conseils et stratégies pour gérer le stress au travail',
      members: 892,
      category: 'Professionnel',
      isPrivate: false,
      activity: 'high',
      image: '/groups/stress.jpg',
      moderators: ['Julie Laurent']
    },
    {
      id: '3',
      name: 'Parents Sereins',
      description: 'Groupe de soutien pour parents cherchant l\'équilibre émotionnel',
      members: 654,
      category: 'Famille',
      isPrivate: true,
      activity: 'medium',
      image: '/groups/parents.jpg',
      moderators: ['Anne Moreau', 'Thomas Roux']
    }
  ]);

  const [events] = useState<CommunityEvent[]>([
    {
      id: '1',
      title: 'Atelier Respiration Transformatrice',
      description: 'Découvrez les techniques avancées de respiration pour la gestion émotionnelle',
      date: '2024-02-15',
      time: '19:00',
      type: 'online',
      participants: 23,
      maxParticipants: 50,
      tags: ['respiration', 'atelier', 'débutant'],
      host: 'Dr. Patricia Lemoine'
    },
    {
      id: '2',
      title: 'Cercle de Parole - Anxiété',
      description: 'Espace bienveillant pour partager et recevoir du soutien',
      date: '2024-02-17',
      time: '14:30',
      type: 'hybrid',
      participants: 12,
      maxParticipants: 15,
      location: 'Paris 11ème',
      tags: ['anxiété', 'soutien', 'partage'],
      host: 'Sophie Chen'
    },
    {
      id: '3',
      title: 'Challenge Gratitude - Finale',
      description: 'Célébration de fin du défi communautaire de 30 jours',
      date: '2024-02-20',
      time: '18:00',
      type: 'online',
      participants: 156,
      maxParticipants: 200,
      tags: ['gratitude', 'challenge', 'célébration'],
      host: 'Communauté EmotionsCare'
    }
  ]);

  const [challenges] = useState<CommunityChallenge[]>([
    {
      id: '1',
      title: '30 Jours de Méditation',
      description: 'Méditer au moins 10 minutes chaque jour pendant un mois',
      category: 'Méditation',
      duration: '30 jours',
      participants: 342,
      reward: 'Badge "Méditant Assidu"',
      difficulty: 'medium',
      progress: 67
    },
    {
      id: '2',
      title: 'Semaine Sans Stress',
      description: 'Techniques quotidiennes pour réduire le stress',
      category: 'Gestion du Stress',
      duration: '7 jours',
      participants: 198,
      reward: '500 XP + Guide PDF',
      difficulty: 'easy',
      progress: 23
    },
    {
      id: '3',
      title: 'Maître de l\'Émotion',
      description: 'Développer une conscience émotionnelle avancée',
      category: 'Intelligence Émotionnelle',
      duration: '90 jours',
      participants: 89,
      reward: 'Certification + Session 1:1',
      difficulty: 'hard',
      progress: 12
    }
  ]);

  const handleLike = (postId: string) => {
    toast({
      title: "❤️ J'aime ajouté",
      description: "Votre soutien fait du bien à la communauté !",
    });
  };

  const handleJoinGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    toast({
      title: `Demande envoyée`,
      description: `Vous avez rejoint "${group?.name}" !`,
    });
  };

  const handleJoinEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    toast({
      title: "✅ Inscription confirmée",
      description: `Vous participez à "${event?.title}"`,
    });
  };

  const handleJoinChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    toast({
      title: "🏆 Défi accepté !",
      description: `Vous participez au "${challenge?.title}"`,
    });
  };

  const renderFeed = () => (
    <div className="space-y-6">
      {/* Créer un post */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback>Moi</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input 
                placeholder="Partagez votre état émotionnel avec la communauté..."
                className="bg-gray-50 border-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Vidéo
              </Button>
              <Button variant="ghost" size="sm">
                <Mic className="w-4 h-4 mr-2" />
                Audio
              </Button>
            </div>
            <Button>Publier</Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <Badge variant="outline">Niv. {post.author.level}</Badge>
                    <Badge variant="secondary">{post.author.badge}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Il y a {post.timestamp}</span>
                    <span className="mx-2">•</span>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      {post.emotion}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="mb-4">{post.content}</p>

              {post.media && (
                <div className="mb-4">
                  <img 
                    src={post.media.url} 
                    alt="Post media" 
                    className="rounded-lg max-h-64 w-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors">
                    <Share className="w-4 h-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Groupes de Soutien</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Créer un Groupe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={group.image} 
                  alt={group.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  {group.isPrivate ? (
                    <Badge variant="secondary">
                      <Lock className="w-3 h-3 mr-1" />
                      Privé
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <Globe className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge 
                    className={
                      group.activity === 'high' ? 'bg-green-500' :
                      group.activity === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                    }
                  >
                    <Flame className="w-3 h-3 mr-1" />
                    {group.activity === 'high' ? 'Très actif' : 
                     group.activity === 'medium' ? 'Actif' : 'Calme'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    {group.members.toLocaleString()} membres
                  </div>
                  <Badge variant="outline">{group.category}</Badge>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  Modérateurs: {group.moderators.join(', ')}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleJoinGroup(group.id)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Rejoindre
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Événements Communautaires</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Créer un Événement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <Badge 
                    variant={event.type === 'online' ? 'default' : 
                           event.type === 'offline' ? 'secondary' : 'outline'}
                  >
                    {event.type === 'online' ? 'En ligne' : 
                     event.type === 'offline' ? 'Présentiel' : 'Hybride'}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {event.participants}/{event.maxParticipants} participants
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  Organisé par: <strong>{event.host}</strong>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleJoinEvent(event.id)}
                  disabled={event.participants >= event.maxParticipants}
                >
                  {event.participants >= event.maxParticipants ? 'Complet' : 'Participer'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Défis Communautaires</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Proposer un Défi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <Badge 
                    variant={challenge.difficulty === 'easy' ? 'default' :
                           challenge.difficulty === 'medium' ? 'secondary' : 'destructive'}
                  >
                    {challenge.difficulty === 'easy' ? 'Facile' :
                     challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Catégorie:</span>
                    <Badge variant="outline">{challenge.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Durée:</span>
                    <span>{challenge.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Participants:</span>
                    <span>{challenge.participants}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Récompense:</span>
                    <span className="text-yellow-600 font-medium">{challenge.reward}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression globale</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleJoinChallenge(challenge.id)}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Relever le Défi
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Communauté EmotionsCare
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connectez-vous avec une communauté bienveillante, partagez vos expériences et grandissez ensemble
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher dans la communauté..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Fil d'actualité
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Groupes
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Événements
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Défis
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="feed" className="mt-0">
                  {renderFeed()}
                </TabsContent>
                <TabsContent value="groups" className="mt-0">
                  {renderGroups()}
                </TabsContent>
                <TabsContent value="events" className="mt-0">
                  {renderEvents()}
                </TabsContent>
                <TabsContent value="challenges" className="mt-0">
                  {renderChallenges()}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CCommunityPage;