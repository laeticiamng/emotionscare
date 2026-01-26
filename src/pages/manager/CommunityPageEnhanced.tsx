// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Star,
  Plus,
  Search,
  Filter,
  Award
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CommunityPageEnhanced = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [communityStats, setCommunityStats] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [events, setEvents] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées pour la communauté
  const mockStats = {
    totalMembers: 156,
    activeToday: 42,
    monthlyPosts: 287,
    engagement: 78,
    wellbeingScore: 82
  };

  const mockDiscussions = [
    {
      id: 1,
      title: 'Techniques de gestion du stress en télétravail',
      author: 'Sarah M.',
      replies: 23,
      likes: 45,
      lastActivity: '2h',
      category: 'Bien-être',
      isHot: true
    },
    {
      id: 2,
      title: 'Organisation d\'une journée team building virtuel',
      author: 'Alex T.',
      replies: 18,
      likes: 32,
      lastActivity: '4h',
      category: 'Événements',
      isHot: false
    },
    {
      id: 3,
      title: 'Retour d\'expérience: méditation en entreprise',
      author: 'Maria R.',
      replies: 15,
      likes: 28,
      lastActivity: '6h',
      category: 'Témoignages',
      isHot: true
    }
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Atelier Mindfulness Collectif',
      date: '2024-02-15',
      time: '14:00',
      participants: 32,
      maxParticipants: 50,
      type: 'workshop',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Défi Bien-être Mensuel',
      date: '2024-02-20',
      time: '09:00',
      participants: 78,
      maxParticipants: 100,
      type: 'challenge',
      status: 'ongoing'
    }
  ];

  const mockContributors = [
    { name: 'Emma L.', points: 1250, posts: 45, avatar: '', badge: 'Expert' },
    { name: 'Thomas K.', points: 980, posts: 32, avatar: '', badge: 'Mentor' },
    { name: 'Sophie B.', points: 850, posts: 28, avatar: '', badge: 'Inspirateur' },
    { name: 'Lucas M.', points: 720, posts: 24, avatar: '', badge: 'Contributeur' }
  ];

  const createEvent = async (eventData) => {
    try {
      // Simulation de création d'événement
      toast({
        title: "Événement créé",
        description: "L'événement a été ajouté au calendrier communautaire.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement.",
        variant: "destructive"
      });
    }
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Expert': 'bg-purple-500',
      'Mentor': 'bg-blue-500',
      'Inspirateur': 'bg-green-500',
      'Contributeur': 'bg-orange-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  useEffect(() => {
    setCommunityStats(mockStats);
    setDiscussions(mockDiscussions);
    setEvents(mockEvents);
    setTopContributors(mockContributors);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Communauté Entreprise
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gérez et animez votre communauté d'entreprise pour un bien-être collectif
          </p>
        </motion.div>

        {/* Stats globales */}
        {communityStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-5 gap-6 mb-8"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 mb-1">{communityStats.totalMembers}</div>
                <div className="text-sm text-gray-600">Membres totaux</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 mb-1">{communityStats.activeToday}</div>
                <div className="text-sm text-gray-600">Actifs aujourd'hui</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600 mb-1">{communityStats.monthlyPosts}</div>
                <div className="text-sm text-gray-600">Posts ce mois</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600 mb-1">{communityStats.engagement}%</div>
                <div className="text-sm text-gray-600">Engagement</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-yellow-600 mb-1">{communityStats.wellbeingScore}%</div>
                <div className="text-sm text-gray-600">Score bien-être</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Événements
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Membres
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Discussions populaires */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                      Discussions Populaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {discussions.slice(0, 3).map((discussion) => (
                      <div key={discussion.id} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{discussion.title}</h4>
                            {discussion.isHot && <Badge className="bg-red-500 text-white text-xs">🔥 Hot</Badge>}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Par {discussion.author}</span>
                          <div className="flex items-center gap-3">
                            <span>{discussion.replies} réponses</span>
                            <span>{discussion.likes} ❤️</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top contributeurs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Top Contributeurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={contributor.name} className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">#{index + 1}</div>
                        <Avatar>
                          <AvatarImage src={contributor.avatar} />
                          <AvatarFallback className="bg-yellow-100 text-yellow-600">
                            {contributor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{contributor.name}</div>
                          <div className="text-sm text-gray-600">{contributor.posts} posts</div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getBadgeColor(contributor.badge)} text-white mb-1`}>
                            {contributor.badge}
                          </Badge>
                          <div className="text-sm font-bold text-yellow-600">{contributor.points} pts</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Discussions */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle discussion
              </Button>
            </div>

            <div className="space-y-4">
              {discussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{discussion.title}</h3>
                            {discussion.isHot && <Badge className="bg-red-500 text-white">🔥 Hot</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Par {discussion.author}</span>
                            <Badge variant="outline">{discussion.category}</Badge>
                            <span>Il y a {discussion.lastActivity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{discussion.replies}</div>
                            <div className="text-gray-500">réponses</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-red-600">{discussion.likes}</div>
                            <div className="text-gray-500">❤️</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Événements */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Événements Communautaires</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Créer un événement
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{event.title}</span>
                        <Badge className={event.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'}>
                          {event.status === 'ongoing' ? 'En cours' : 'À venir'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Participants</span>
                          <span>{event.participants} / {event.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Voir détails</Button>
                        <Button size="sm" variant="outline">Partager</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Membres */}
          <TabsContent value="members" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Gestion des Membres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {topContributors.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border"
                    >
                      <Avatar className="w-16 h-16 mx-auto mb-3">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold mb-1">{member.name}</h3>
                      <Badge className={`${getBadgeColor(member.badge)} text-white mb-2`}>
                        {member.badge}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {member.points} points • {member.posts} posts
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPageEnhanced;