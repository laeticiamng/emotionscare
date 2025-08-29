import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, Users, Star, Plus, ArrowLeft, 
         Search, Filter, TrendingUp, Award, Calendar, Clock, 
         ThumbsUp, BookOpen, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
  category: 'success' | 'support' | 'question' | 'inspiration';
}

interface Challenge {
  title: string;
  participants: number;
  description: string;
  endDate: string;
  reward: string;
  category: 'wellness' | 'meditation' | 'journal';
}

interface SupportGroup {
  name: string;
  members: number;
  category: string;
  description: string;
  lastActivity: string;
  isJoined?: boolean;
}

interface Community {
  name: string;
  members: number;
  description: string;
  avatar: string;
  topics: string[];
}

const B2CSocialCoconPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Emma D.",
      avatar: "ED",
      time: "Il y a 2h",
      content: "Belle session de méditation ce matin ! Le module VR m'a vraiment aidée à me détendre. L'environnement forestier était si réaliste que j'ai oublié mes soucis pendant 20 minutes. 🧘‍♀️✨",
      likes: 12,
      comments: 3,
      tags: ["méditation", "vr", "détente"],
      category: "success"
    },
    {
      id: 2,
      author: "Alex M.",
      avatar: "AM",
      time: "Il y a 4h",
      content: "Incroyable comme la musicothérapie peut changer une journée difficile. J'ai utilisé le module émotionnel et c'était exactement ce dont j'avais besoin. Merci EmotionsCare ! 🎵💚",
      likes: 18,
      comments: 7,
      tags: ["musicothérapie", "gratitude"],
      category: "success"
    },
    {
      id: 3,
      author: "Sophie L.",
      avatar: "SL",
      time: "Il y a 6h",
      content: "Partage de ma progression cette semaine : 5 scans d'émotions, 3 sessions coach IA, 2 sessions VR. Je me sens plus équilibrée ! Le graphique de progression est très motivant 📈💪",
      likes: 25,
      comments: 12,
      tags: ["progression", "équilibre"],
      category: "success"
    },
    {
      id: 4,
      author: "Thomas R.",
      avatar: "TR",
      time: "Il y a 8h",
      content: "Quelqu'un a-t-il des conseils pour gérer l'anxiété avant les présentations ? J'ai essayé la respiration mais j'aimerais d'autres techniques. Merci d'avance ! 🙏",
      likes: 8,
      comments: 15,
      tags: ["anxiété", "conseils", "travail"],
      category: "question"
    }
  ]);

  const [newPost, setNewPost] = useState({ content: '', tags: '', category: 'inspiration' as const });
  const [activeTab, setActiveTab] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const challenges: Challenge[] = [
    { 
      title: "Défi Bien-être Collectif", 
      participants: 127, 
      description: "30 jours de pratiques positives quotidiennes",
      endDate: "2024-02-15",
      reward: "Badge Communauté Bienveillante",
      category: "wellness"
    },
    { 
      title: "Méditation en Groupe", 
      participants: 89, 
      description: "Sessions VR synchronisées chaque matin à 8h",
      endDate: "2024-02-20",
      reward: "Badge Zen Collectif",
      category: "meditation"
    },
    { 
      title: "Journal Collaboratif", 
      participants: 156, 
      description: "Partage d'expériences positives quotidiennes",
      endDate: "2024-02-28",
      reward: "Badge Écrivain Communautaire",
      category: "journal"
    }
  ];

  const supportGroups: SupportGroup[] = [
    { 
      name: "Gestion du Stress", 
      members: 234, 
      category: "Anxiété",
      description: "Techniques et soutien pour gérer le stress quotidien",
      lastActivity: "Il y a 2h",
      isJoined: true
    },
    { 
      name: "Confiance en Soi", 
      members: 187, 
      category: "Développement",
      description: "Booster sa confiance et son estime personnelle",
      lastActivity: "Il y a 4h"
    },
    { 
      name: "Équilibre Travail-Vie", 
      members: 298, 
      category: "Professionnel",
      description: "Trouver l'harmonie entre vie pro et personnelle",
      lastActivity: "Il y a 1h"
    },
    { 
      name: "Parents Bienveillants", 
      members: 156, 
      category: "Famille",
      description: "Conseils et soutien pour une parentalité épanouie",
      lastActivity: "Il y a 3h"
    }
  ];

  const communities: Community[] = [
    {
      name: "Zen Masters",
      members: 1420,
      description: "Communauté dédiée à la méditation et à la pleine conscience",
      avatar: "ZM",
      topics: ["méditation", "mindfulness", "spiritualité"]
    },
    {
      name: "Wellness Warriors",
      members: 2890,
      description: "Guerriers du bien-être partageant conseils et motivations",
      avatar: "WW",
      topics: ["fitness", "nutrition", "mental health"]
    },
    {
      name: "Creative Minds",
      members: 890,
      description: "Esprits créatifs explorant l'art-thérapie et l'expression",
      avatar: "CM",
      topics: ["art-thérapie", "créativité", "expression"]
    }
  ];

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleNewPost = () => {
    if (newPost.content.trim()) {
      const post: Post = {
        id: Date.now(),
        author: "Vous",
        avatar: "VV",
        time: "À l'instant",
        content: newPost.content,
        likes: 0,
        comments: 0,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: newPost.category
      };
      setPosts([post, ...posts]);
      setNewPost({ content: '', tags: '', category: 'inspiration' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success': return '🎉';
      case 'support': return '🤝';
      case 'question': return '❓';
      case 'inspiration': return '✨';
      default: return '💬';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'question': return 'bg-orange-100 text-orange-800';
      case 'inspiration': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/app/home')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="text-green-600" />
                Cocon Social
              </h1>
              <p className="text-xl text-gray-600">
                Connectez-vous avec la communauté EmotionsCare
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              2,847 membres actifs
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Défis
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Groupes
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Communautés
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Événements
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Feed principal */}
              <div className="lg:col-span-3 space-y-6">
                {/* Créer un post */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">Vous</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Partagez votre expérience, posez une question, ou inspirez la communauté..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <Input
                          value={newPost.tags}
                          onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="Tags (séparés par des virgules)"
                        />
                      </div>
                      <select 
                        value={newPost.category}
                        onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value as any }))}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="inspiration">✨ Inspiration</option>
                        <option value="success">🎉 Succès</option>
                        <option value="support">🤝 Demande d'aide</option>
                        <option value="question">❓ Question</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleNewPost}
                        disabled={!newPost.content.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Publier
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Progression
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Filtres */}
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher dans les posts..."
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? "default" : "outline"}
                      onClick={() => setSelectedCategory('all')}
                      size="sm"
                    >
                      Tous
                    </Button>
                    {['success', 'support', 'question', 'inspiration'].map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        size="sm"
                      >
                        {getCategoryIcon(category)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Posts */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="shadow-lg hover:shadow-xl transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                  {post.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{post.author}</h4>
                                  <Badge className={getCategoryColor(post.category)}>
                                    {getCategoryIcon(post.category)} {post.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">{post.time}</p>
                              </div>
                            </div>
                            
                            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex gap-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleLike(post.id)}
                                  className={post.isLiked ? 'text-red-600' : 'text-gray-600'}
                                >
                                  <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                  <Share2 className="w-4 h-4 mr-1" />
                                  Partager
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Statistiques personnelles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Votre impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Posts partagés</span>
                      <Badge>12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Likes reçus</span>
                      <Badge>156</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Commentaires</span>
                      <Badge>43</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Personnes aidées</span>
                      <Badge className="bg-green-100 text-green-800">28</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Tendances */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Tendances
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['#méditation', '#gratitude', '#progression', '#bien-être', '#motivation'].map((trend, index) => (
                      <div key={trend} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend}</span>
                        <span className="text-xs text-gray-500">+{15 - index * 2}%</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Prochains événements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Événements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <h5 className="font-medium text-sm">Méditation collective</h5>
                      <p className="text-xs text-gray-600">Demain 8h00</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3">
                      <h5 className="font-medium text-sm">Atelier bien-être</h5>
                      <p className="text-xs text-gray-600">Vendredi 19h00</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-xl transition-all group">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {challenge.title}
                        <Award className="w-6 h-6 text-yellow-500" />
                      </CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Participants</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Users className="w-3 h-3 mr-1" />
                          {challenge.participants}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Se termine le:</span>
                        <span className="font-medium">
                          {new Date(challenge.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-yellow-800 mb-1">Récompense:</div>
                        <div className="text-sm text-yellow-700">{challenge.reward}</div>
                      </div>
                      
                      <Button className="w-full group-hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Rejoindre le défi
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportGroups.map((group, index) => (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.isJoined && (
                          <Badge className="bg-green-100 text-green-800">Rejoint</Badge>
                        )}
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {group.members} membres
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {group.lastActivity}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {group.category}
                      </Badge>
                      
                      <Button 
                        className="w-full" 
                        variant={group.isJoined ? "outline" : "default"}
                      >
                        {group.isJoined ? (
                          <>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Voir les discussions
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Rejoindre le groupe
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community, index) => (
                <motion.div
                  key={community.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-xl transition-all group">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {community.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{community.description}</p>
                      
                      <div className="flex items-center justify-center gap-1 mb-4 text-sm text-gray-500">
                        <Users className="w-3 h-3" />
                        {community.members.toLocaleString()} membres
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4 justify-center">
                        {community.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full group-hover:bg-primary/90">
                        <Star className="w-4 h-4 mr-2" />
                        Rejoindre
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Méditation collective matinale",
                  date: "2024-01-20",
                  time: "08:00",
                  duration: "30 min",
                  participants: 45,
                  description: "Session de méditation guidée en groupe pour bien commencer la journée",
                  type: "Récurrent"
                },
                {
                  title: "Atelier Gestion du Stress",
                  date: "2024-01-22",
                  time: "19:00",
                  duration: "2h",
                  participants: 28,
                  description: "Techniques avancées pour gérer le stress au quotidien",
                  type: "Workshop"
                },
                {
                  title: "Session VR Collective",
                  date: "2024-01-25",
                  time: "20:30",
                  duration: "45 min",
                  participants: 67,
                  description: "Exploration d'environnements relaxants en réalité virtuelle",
                  type: "Innovation"
                }
              ].map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge>{event.type}</Badge>
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          {event.time} ({event.duration})
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-purple-500" />
                        {event.participants} participants inscrits
                      </div>
                      
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        S'inscrire
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CSocialCoconPage;