import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Heart, MessageCircle, Share2, Users, Star, Plus, ArrowLeft, 
         Search, Filter, TrendingUp, Award, Calendar, Clock, 
         ThumbsUp, BookOpen, Target, Zap, Brain, Activity, 
         Globe, Compass, Shield, Gift, Mic, Video, Image,
         Bell, Settings, Crown, Flame, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  category: 'success' | 'support' | 'question' | 'inspiration' | 'challenge' | 'achievement';
  mood?: string;
  engagement: number;
  mediaUrls?: string[];
  location?: string;
  verified?: boolean;
}

interface Community {
  id: string;
  name: string;
  members: number;
  description: string;
  avatar: string;
  topics: string[];
  category: string;
  isJoined?: boolean;
  activityLevel: number;
  moderators: string[];
  featured?: boolean;
  growthRate: number;
}

interface LiveEvent {
  id: string;
  title: string;
  host: string;
  participants: number;
  startTime: Date;
  category: 'meditation' | 'discussion' | 'workshop' | 'game';
  isLive: boolean;
  duration: number;
}

interface Challenge {
  id: string;
  title: string;
  participants: number;
  description: string;
  endDate: string;
  reward: string;
  category: 'wellness' | 'meditation' | 'journal' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  progress?: number;
  isParticipating?: boolean;
  prize: string;
}

interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  badges: string[];
  totalPosts: number;
  totalLikes: number;
  helpfulAnswers: number;
  communityRank: string;
}

const B2CCommunitySocialEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // États principaux
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 7,
    badges: ['early-adopter', 'helper', 'motivator', 'zen-master'],
    totalPosts: 45,
    totalLikes: 892,
    helpfulAnswers: 23,
    communityRank: 'Community Champion'
  });

  // États d'interface
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState({ 
    content: '', 
    tags: '', 
    category: 'inspiration' as const,
    mood: 'neutral',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);

  const moods = [
    { name: 'joyful', emoji: '😊', color: '#FFD700' },
    { name: 'calm', emoji: '😌', color: '#87CEEB' },
    { name: 'excited', emoji: '🤩', color: '#FF6B6B' },
    { name: 'grateful', emoji: '🙏', color: '#4ECDC4' },
    { name: 'motivated', emoji: '💪', color: '#45B7D1' },
    { name: 'peaceful', emoji: '🕊️', color: '#96CEB4' }
  ];

  useEffect(() => {
    initializeData();
    const interval = setInterval(() => {
      updateLiveData();
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const initializeData = () => {
    // Initialiser les posts avec plus de détails
    setPosts([
      {
        id: 1,
        author: "Emma Wellness",
        avatar: "EW",
        time: "Il y a 15 min",
        content: "Incroyable session de méditation VR ce matin ! L'environnement de forêt tropicale m'a transportée. J'ai réussi à maintenir ma concentration pendant 25 minutes. Les sons binauraux étaient parfaits 🧘‍♀️✨ #VRMeditation #Mindfulness",
        likes: 124,
        comments: 18,
        shares: 7,
        tags: ["méditation", "vr", "mindfulness", "nature"],
        category: "success",
        mood: "peaceful",
        engagement: 89,
        location: "Paris, France",
        verified: true,
        mediaUrls: ["https://example.com/vr-forest.jpg"]
      },
      {
        id: 2,
        author: "Alex MindGym",
        avatar: "AM",
        time: "Il y a 32 min",
        content: "Défi de gratitude : Jour 7/30 ✅ Aujourd'hui je suis reconnaissant pour ma famille, le coaching IA qui m'aide à structurer mes pensées et cette communauté bienveillante ! Qui rejoint le défi ? 💚 #Gratitude #30DaysChallenge",
        likes: 89,
        comments: 25,
        shares: 12,
        tags: ["gratitude", "défi", "famille", "communauté"],
        category: "challenge",
        mood: "joyful",
        engagement: 76,
        location: "Lyon, France",
        verified: false
      },
      {
        id: 3,
        author: "Sophie ZenFlow",
        avatar: "SZ",
        time: "Il y a 1h",
        content: "Question pour les experts : Comment gérez-vous l'anxiété avant les présentations importantes ? J'ai testé la respiration 4-7-8 et les affirmations positives, mais je cherche d'autres techniques. Vos retours d'expérience ? 🤔💼 #Anxiété #TravailConscient",
        likes: 67,
        comments: 34,
        shares: 5,
        tags: ["anxiété", "présentation", "techniques", "travail"],
        category: "question",
        mood: "neutral",
        engagement: 82,
        location: "Toulouse, France"
      },
      {
        id: 4,
        author: "Dr. Thomas MindHealth",
        avatar: "TM",
        time: "Il y a 2h",
        content: "Nouvelle étude fascinante : La musicothérapie combinée à l'IA personnalisée améliore l'humeur de 78% en moyenne. Les algorithmes adaptatifs créent des playlists qui évoluent avec votre état émotionnel en temps réel 🎵🧠 #Recherche #Musicothérapie #IA",
        likes: 203,
        comments: 56,
        shares: 28,
        tags: ["recherche", "musicothérapie", "ia", "science"],
        category: "inspiration",
        mood: "excited",
        engagement: 95,
        verified: true,
        location: "Montpellier, France"
      }
    ]);

    // Communautés avec plus de détails
    setCommunities([
      {
        id: '1',
        name: "Zen Masters Elite",
        members: 4820,
        description: "Communauté premium pour maîtres de méditation et pratiquants avancés",
        avatar: "ZM",
        topics: ["méditation avancée", "mindfulness", "spiritualité", "enseignement"],
        category: "Méditation",
        isJoined: true,
        activityLevel: 92,
        moderators: ["Dr. Sarah Chen", "Master Liu"],
        featured: true,
        growthRate: 15
      },
      {
        id: '2',
        name: "Wellness Warriors Global",
        members: 8950,
        description: "Guerriers du bien-être connectés mondialement pour transformer les vies",
        avatar: "WW",
        topics: ["fitness mental", "nutrition consciente", "challenges", "motivation"],
        category: "Bien-être",
        isJoined: true,
        activityLevel: 87,
        moderators: ["Emma Wellness", "Coach Mike"],
        featured: true,
        growthRate: 22
      },
      {
        id: '3',
        name: "Creative Healing Circle",
        members: 2340,
        description: "Art-thérapie et expression créative pour la guérison émotionnelle",
        avatar: "CH",
        topics: ["art-thérapie", "créativité", "expression", "guérison"],
        category: "Créativité",
        activityLevel: 74,
        moderators: ["Artist Luna"],
        growthRate: 8
      },
      {
        id: '4',
        name: "AI & Mental Health Hub",
        members: 6720,
        description: "Exploration des technologies IA pour améliorer la santé mentale",
        avatar: "AI",
        topics: ["ia", "technologie", "innovation", "recherche"],
        category: "Technologie",
        activityLevel: 89,
        moderators: ["Dr. Alex AI", "TechGuru"],
        featured: true,
        growthRate: 35
      }
    ]);

    // Défis en cours
    setChallenges([
      {
        id: '1',
        title: "30 Jours de Gratitude Quotidienne",
        participants: 1247,
        description: "Exprimez 3 gratitudes chaque jour et partagez une avec la communauté",
        endDate: "2024-03-15",
        reward: "Badge Cœur Reconnaissant + 500 XP",
        category: "wellness",
        difficulty: "easy",
        progress: 23,
        isParticipating: true,
        prize: "Badge exclusif + Accès VIP 1 mois"
      },
      {
        id: '2',
        title: "Marathon Méditation Collective",
        participants: 892,
        description: "Séances VR synchronisées tous les matins à 7h pendant 21 jours",
        endDate: "2024-03-10",
        reward: "Badge Zen Master + Certificat personnalisé",
        category: "meditation",
        difficulty: "medium",
        progress: 67,
        isParticipating: true,
        prize: "Retraite virtuelle premium"
      },
      {
        id: '3',
        title: "Innovation Bien-être Hackathon",
        participants: 156,
        description: "Créez des solutions innovantes pour améliorer le bien-être mental",
        endDate: "2024-03-20",
        reward: "Prix de 1000€ + Mentorat IA personnalisé",
        category: "social",
        difficulty: "hard",
        prize: "Prix en argent + Reconnaissance"
      }
    ]);

    // Événements en direct
    setLiveEvents([
      {
        id: '1',
        title: "Méditation Guidée Matinale",
        host: "Master Sarah",
        participants: 234,
        startTime: new Date(),
        category: "meditation",
        isLive: true,
        duration: 20
      },
      {
        id: '2',
        title: "Session Q&A Gestion du Stress",
        host: "Dr. Thomas",
        participants: 89,
        startTime: new Date(Date.now() + 3600000),
        category: "discussion",
        isLive: false,
        duration: 45
      }
    ]);
  };

  const updateLiveData = () => {
    // Simuler des mises à jour en temps réel
    setPosts(prevPosts => prevPosts.map(post => ({
      ...post,
      likes: post.likes + Math.floor(Math.random() * 3),
      comments: post.comments + Math.floor(Math.random() * 2)
    })));
  };

  const handleLike = (postId: number) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
    
    if (!posts.find(p => p.id === postId)?.isLiked) {
      toast({
        title: "❤️ Post aimé!",
        description: "Votre appréciation compte pour la communauté",
      });
    }
  };

  const handleShare = (postId: number) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, shares: post.shares + 1 } : post
    ));
    
    toast({
      title: "🔗 Post partagé!",
      description: "Merci de faire grandir notre communauté",
    });
  };

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prevCommunities => prevCommunities.map(community =>
      community.id === communityId 
        ? { ...community, isJoined: !community.isJoined, members: community.isJoined ? community.members - 1 : community.members + 1 }
        : community
    ));
    
    const community = communities.find(c => c.id === communityId);
    toast({
      title: community?.isJoined ? "📤 Communauté quittée" : "🎉 Bienvenue dans la communauté!",
      description: community?.name,
    });
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prevChallenges => prevChallenges.map(challenge =>
      challenge.id === challengeId 
        ? { 
            ...challenge, 
            isParticipating: !challenge.isParticipating,
            participants: challenge.isParticipating ? challenge.participants - 1 : challenge.participants + 1
          }
        : challenge
    ));
    
    toast({
      title: "🏆 Défi rejoint!",
      description: "Bonne chance dans ce nouveau défi!",
    });
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
        shares: 0,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: newPost.category,
        mood: newPost.mood,
        engagement: 0,
        location: newPost.location
      };
      setPosts(prevPosts => [post, ...prevPosts]);
      setNewPost({ content: '', tags: '', category: 'inspiration', mood: 'neutral', location: '' });
      
      toast({
        title: "📝 Post publié!",
        description: "Votre message a été partagé avec la communauté",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      success: '🎉',
      support: '🤝',
      question: '❓',
      inspiration: '✨',
      challenge: '🏆',
      achievement: '👑'
    };
    return icons[category as keyof typeof icons] || '💬';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      support: 'bg-blue-100 text-blue-800 border-blue-200',
      question: 'bg-orange-100 text-orange-800 border-orange-200',
      inspiration: 'bg-purple-100 text-purple-800 border-purple-200',
      challenge: 'bg-red-100 text-red-800 border-red-200',
      achievement: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const UserStatsCard = () => (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16 border-4 border-purple-300">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-xl font-bold">
              VV
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              Votre Profil
              <Crown className="w-5 h-5 text-yellow-500" />
            </h3>
            <p className="text-purple-700 font-medium">{userStats.communityRank}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-orange-500 text-white">Niveau {userStats.level}</Badge>
              <Badge variant="outline" className="border-purple-300">
                <Flame className="w-3 h-3 mr-1" />
                {userStats.streak} jours
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Progression</span>
              <span className="text-sm">{userStats.xp}/{userStats.nextLevelXp} XP</span>
            </div>
            <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{userStats.totalPosts}</div>
              <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">{userStats.totalLikes}</div>
              <div className="text-xs text-gray-600">Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{userStats.helpfulAnswers}</div>
              <div className="text-xs text-gray-600">Aides</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {userStats.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                🏅 {badge}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Enhanced */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
                <Users className="text-emerald-600" />
                Cocon Social Pro
              </h1>
              <p className="text-xl text-gray-600">
                Communauté globale de bien-être connectée • 12,847 membres actifs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  {notificationsCount}
                </Badge>
              )}
            </Button>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Connecté mondialement
            </Badge>
            <Badge 
              variant={isLiveMode ? "default" : "secondary"} 
              className={isLiveMode ? "bg-red-500 animate-pulse" : ""}
              onClick={() => setIsLiveMode(!isLiveMode)}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {isLiveMode ? 'LIVE' : 'Hors ligne'}
            </Badge>
          </div>
        </motion.div>

        {/* Barre d'onglets améliorée */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-gray-200">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Feed Live
              </TabsTrigger>
              <TabsTrigger value="communities" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Communautés
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Défis
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Événements
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Insights IA
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Bien-être
              </TabsTrigger>
            </TabsList>

            {/* Feed Tab Enhanced */}
            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Feed principal */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Créer un post amélioré */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="border-2 border-emerald-300">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">Vous</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              value={newPost.content}
                              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Partagez votre expérience, posez une question, inspirez la communauté... ✨"
                              rows={3}
                              className="resize-none border-0 bg-gray-50 focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <Input
                            value={newPost.tags}
                            onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="Tags #wellness #inspiration"
                            className="text-sm"
                          />
                          <Input
                            value={newPost.location}
                            onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="📍 Localisation"
                            className="text-sm"
                          />
                          <select 
                            value={newPost.category}
                            onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value as any }))}
                            className="px-3 py-2 border rounded-md text-sm bg-white"
                          >
                            <option value="inspiration">✨ Inspiration</option>
                            <option value="success">🎉 Succès</option>
                            <option value="support">🤝 Demande d'aide</option>
                            <option value="question">❓ Question</option>
                            <option value="challenge">🏆 Défi</option>
                            <option value="achievement">👑 Accomplissement</option>
                          </select>
                          <select 
                            value={newPost.mood}
                            onChange={(e) => setNewPost(prev => ({ ...prev, mood: e.target.value }))}
                            className="px-3 py-2 border rounded-md text-sm bg-white"
                          >
                            {moods.map(mood => (
                              <option key={mood.name} value={mood.name}>
                                {mood.emoji} {mood.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Image className="w-4 h-4 mr-2" />
                              Photo
                            </Button>
                            <Button variant="outline" size="sm">
                              <Video className="w-4 h-4 mr-2" />
                              Vidéo
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mic className="w-4 h-4 mr-2" />
                              Audio
                            </Button>
                          </div>
                          
                          <Button 
                            onClick={handleNewPost}
                            disabled={!newPost.content.trim()}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Publier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Filtres avancés */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3 items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200"
                  >
                    <div className="flex-1 min-w-64">
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="🔍 Rechercher posts, utilisateurs, hashtags..."
                        className="bg-white"
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
                      {['success', 'challenge', 'inspiration', 'question'].map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          onClick={() => setSelectedCategory(category)}
                          size="sm"
                          className="hidden md:flex"
                        >
                          {getCategoryIcon(category)}
                        </Button>
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Plus de filtres
                    </Button>
                  </motion.div>

                  {/* Posts avec engagement en temps réel */}
                  <div className="space-y-6">
                    <AnimatePresence>
                      {posts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30 border border-gray-200">
                            <CardContent className="p-6 space-y-4">
                              {/* En-tête du post */}
                              <div className="flex items-start gap-4">
                                <Avatar className="border-2 border-gray-200">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                    {post.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold flex items-center gap-2">
                                      {post.author}
                                      {post.verified && <Shield className="w-4 h-4 text-blue-500" />}
                                    </h4>
                                    <Badge className={getCategoryColor(post.category)} variant="outline">
                                      {getCategoryIcon(post.category)} {post.category}
                                    </Badge>
                                    {post.mood && (
                                      <Badge variant="secondary" className="text-xs">
                                        {moods.find(m => m.name === post.mood)?.emoji} {post.mood}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{post.time}</span>
                                    {post.location && (
                                      <>
                                        <span>•</span>
                                        <span>📍 {post.location}</span>
                                      </>
                                    )}
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      {post.engagement}% engagement
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Contenu */}
                              <p className="text-gray-800 leading-relaxed text-lg">{post.content}</p>
                              
                              {/* Médias (si présents) */}
                              {post.mediaUrls && post.mediaUrls.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {post.mediaUrls.slice(0, 4).map((url, i) => (
                                    <div key={i} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                      <img src={url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs hover:bg-emerald-50 cursor-pointer">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              {/* Actions avec animations */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex gap-6">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLike(post.id)}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                      post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                    }`}
                                  >
                                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current animate-pulse' : ''}`} />
                                    {post.likes}
                                  </motion.button>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                  >
                                    <MessageCircle className="w-5 h-5" />
                                    {post.comments}
                                  </motion.button>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleShare(post.id)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                                  >
                                    <Share2 className="w-5 h-5" />
                                    {post.shares}
                                  </motion.button>
                                </div>
                                
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-amber-600">
                                  <BookOpen className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sidebar améliorée */}
                <div className="space-y-6">
                  {/* Stats utilisateur */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <UserStatsCard />
                  </motion.div>

                  {/* Événements live */}
                  {liveEvents.length > 0 && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            Événements Live
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {liveEvents.map(event => (
                            <div key={event.id} className="p-3 bg-white rounded-xl border border-red-100">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-sm">{event.title}</h5>
                                {event.isLive && (
                                  <Badge className="bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">Par {event.host}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{event.participants} participants</span>
                                <Button size="sm" variant={event.isLive ? "default" : "outline"}>
                                  {event.isLive ? 'Rejoindre' : 'Programmer'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Communautés tendances */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Tendances
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {communities.filter(c => c.featured).slice(0, 3).map((community, index) => (
                          <div key={community.id} className="p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Avatar className="border-2 border-emerald-300">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs">
                                  {community.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm">{community.name}</h5>
                                <p className="text-xs text-gray-600">{community.members.toLocaleString()} membres</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-600">+{community.growthRate}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            {/* Communautés Tab */}
            <TabsContent value="communities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                      community.featured ? 'ring-2 ring-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50' : 'hover:shadow-lg'
                    }`}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-4 border-emerald-200">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xl font-bold">
                              {community.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              {community.name}
                              {community.featured && <Star className="w-5 h-5 text-yellow-500" />}
                            </h3>
                            <p className="text-sm text-gray-600">{community.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">{community.members.toLocaleString()} membres</span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600">+{community.growthRate}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">{community.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {community.topics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-gray-600">Activité</span>
                              <span className="text-xs font-semibold">{community.activityLevel}%</span>
                            </div>
                            <Progress value={community.activityLevel} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleJoinCommunity(community.id)}
                            className={`flex-1 ${
                              community.isJoined 
                                ? 'bg-gray-500 hover:bg-gray-600' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                            }`}
                          >
                            {community.isJoined ? (
                              <>
                                <Users className="w-4 h-4 mr-2" />
                                Membre
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Rejoindre
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Défis Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                      challenge.isParticipating ? 'ring-2 ring-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : 'hover:shadow-lg'
                    }`}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              {challenge.title}
                              <Badge className={`text-xs ${
                                challenge.difficulty === 'easy' ? 'bg-green-500' :
                                challenge.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}>
                                {challenge.difficulty}
                              </Badge>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{challenge.category}</p>
                          </div>
                          <Award className="w-8 h-8 text-yellow-500" />
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Participants</span>
                            <span className="text-sm font-semibold">{challenge.participants.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Se termine le</span>
                            <span className="text-sm font-semibold">{challenge.endDate}</span>
                          </div>
                          {challenge.progress && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">Votre progression</span>
                                <span className="text-sm font-semibold">{challenge.progress}%</span>
                              </div>
                              <Progress value={challenge.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm font-semibold text-yellow-800 mb-1">🏆 Récompense</p>
                          <p className="text-sm text-yellow-700">{challenge.reward}</p>
                        </div>
                        
                        <Button 
                          onClick={() => handleJoinChallenge(challenge.id)}
                          className={`w-full ${
                            challenge.isParticipating 
                              ? 'bg-yellow-500 hover:bg-yellow-600' 
                              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                          }`}
                        >
                          {challenge.isParticipating ? (
                            <>
                              <Award className="w-4 h-4 mr-2" />
                              En cours
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Rejoindre le défi
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Autres onglets avec contenu placeholder amélioré */}
            <TabsContent value="events" className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Événements à venir</h3>
                <p className="text-gray-600 mb-6">Découvrez les prochains événements de la communauté</p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Créer un événement
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Insights IA Personnalisés</h3>
                <p className="text-gray-600 mb-6">Analyses et recommandations basées sur votre activité communautaire</p>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
                  Générer des insights
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wellness" className="space-y-6">
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Programme Bien-être Communautaire</h3>
                <p className="text-gray-600 mb-6">Ressources et programmes spécialement conçus pour notre communauté</p>
                <Button className="bg-gradient-to-r from-green-500 to-teal-500">
                  Explorer les programmes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CCommunitySocialEnhanced;