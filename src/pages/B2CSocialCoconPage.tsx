import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Sparkles,
  Globe,
  Lock,
  Unlock,
  Send,
  Image,
  Mic,
  Video,
  MapPin,
  Calendar,
  Star,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Coffee,
  Moon,
  Sun,
  Rainbow,
  Flower2,
  UserPlus,
  Bell,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  mood: string;
  level: number;
  badges: string[];
  location?: string;
  lastSeen?: Date;
}

interface Post {
  id: string;
  author: User;
  content: string;
  type: 'text' | 'gratitude' | 'achievement' | 'support';
  timestamp: Date;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  supportLevel?: number;
  mood?: string;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  duration: string;
  reward: string;
  category: 'gratitude' | 'mindfulness' | 'connection' | 'growth';
  icon: React.ComponentType<any>;
  progress: number;
}

const moodEmojis = {
  joyful: { emoji: '😊', color: 'text-yellow-500' },
  calm: { emoji: '😌', color: 'text-blue-500' },
  energetic: { emoji: '⚡', color: 'text-orange-500' },
  grateful: { emoji: '🙏', color: 'text-green-500' },
  peaceful: { emoji: '🧘', color: 'text-purple-500' },
  inspired: { emoji: '✨', color: 'text-pink-500' }
};

const communityChallenges: CommunityChallenge[] = [
  {
    id: '1',
    title: '7 jours de gratitude',
    description: 'Partagez une gratitude quotidienne avec la communauté',
    participants: 1247,
    duration: '7 jours',
    reward: 'Badge Cœur Reconnaissant',
    category: 'gratitude',
    icon: Heart,
    progress: 65
  },
  {
    id: '2',
    title: 'Méditation collective',
    description: 'Rejoignez 10 minutes de méditation guidée ensemble',
    participants: 892,
    duration: '30 jours',
    reward: 'Badge Esprit Zen',
    category: 'mindfulness',
    icon: Moon,
    progress: 42
  },
  {
    id: '3',
    title: 'Connexions bienveillantes',
    description: 'Soutenez 5 personnes avec des messages encourageants',
    participants: 634,
    duration: '14 jours',
    reward: 'Badge Ange Gardien',
    category: 'connection',
    icon: Users,
    progress: 78
  }
];

export default function B2CCoconSocialEnhanced() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'text' | 'gratitude' | 'achievement' | 'support'>('text');
  const [selectedMood, setSelectedMood] = useState('calm');
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'buddies' | 'live'>('feed');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [liveParticipants, setLiveParticipants] = useState(0);

  // Données utilisateur simulées
  const currentUser: User = {
    id: 'current',
    name: 'Vous',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    mood: selectedMood,
    level: 15,
    badges: ['Cœur Bienveillant', 'Esprit Zen', 'Connexion Magique'],
    location: 'France'
  };

  // Utilisateurs en ligne simulés
  useEffect(() => {
    const users: User[] = [
      {
        id: '1',
        name: 'Emma',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        mood: 'joyful',
        level: 12,
        badges: ['Gratitude Master'],
        location: 'Paris'
      },
      {
        id: '2',
        name: 'Lucas',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        mood: 'peaceful',
        level: 18,
        badges: ['Zen Master', 'Support Hero'],
        location: 'Lyon'
      },
      {
        id: '3',
        name: 'Sophie',
        avatar: '/api/placeholder/40/40',
        status: 'away',
        mood: 'calm',
        level: 9,
        badges: ['Rising Star'],
        location: 'Marseille'
      }
    ];
    setOnlineUsers(users);
  }, []);

  // Posts simulés
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: '1',
        author: onlineUsers[0] || currentUser,
        content: "Aujourd'hui j'ai pris le temps d'observer un coucher de soleil. Ces moments de beauté simple me rappellent à quel point la vie peut être merveilleuse. 🌅",
        type: 'gratitude',
        timestamp: new Date(Date.now() - 3600000),
        likes: 12,
        comments: [],
        isLiked: false,
        tags: ['gratitude', 'nature', 'beauté'],
        visibility: 'public',
        supportLevel: 85,
        mood: 'grateful'
      },
      {
        id: '2',
        author: onlineUsers[1] || currentUser,
        content: "Milestone atteint ! 30 jours consécutifs de méditation. Le voyage intérieur continue... 🧘‍♂️",
        type: 'achievement',
        timestamp: new Date(Date.now() - 7200000),
        likes: 24,
        comments: [],
        isLiked: true,
        tags: ['méditation', 'accomplissement', 'croissance'],
        visibility: 'public',
        supportLevel: 92,
        mood: 'peaceful'
      }
    ];
    setPosts(samplePosts);
  }, [onlineUsers]);

  const publishPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: currentUser,
      content: newPost,
      type: postType,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      isLiked: false,
      tags: [],
      visibility: 'public',
      supportLevel: Math.floor(Math.random() * 100),
      mood: selectedMood
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return Heart;
      case 'achievement': return Award;
      case 'support': return Shield;
      default: return MessageCircle;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'gratitude': return 'text-red-500';
      case 'achievement': return 'text-yellow-500';
      case 'support': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const joinLiveSession = () => {
    setIsLiveSessionActive(true);
    setLiveParticipants(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Cocon Social
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connectez-vous à une communauté bienveillante pour partager, soutenir et grandir ensemble
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-full p-1 shadow-lg border">
            {[
              { id: 'feed', label: 'Flux', icon: Globe },
              { id: 'challenges', label: 'Défis', icon: Star },
              { id: 'buddies', label: 'Amis', icon: Users },
              { id: 'live', label: 'Live', icon: Video }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar gauche - Profil et Statistiques */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Profil utilisateur */}
            <Card className="border-2 border-pink-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-pink-200">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg mb-2">{currentUser.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={moodEmojis[selectedMood as keyof typeof moodEmojis]?.emoji}>
                    {moodEmojis[selectedMood as keyof typeof moodEmojis]?.emoji}
                  </span>
                  <span className="text-sm text-gray-600 capitalize">{selectedMood}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-pink-600">Niveau {currentUser.level}</div>
                    <div>Évolution</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{currentUser.badges.length}</div>
                    <div>Badges</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {currentUser.badges.slice(0, 2).map(badge => (
                    <Badge key={badge} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Utilisateurs en ligne */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-purple-500" />
                  En ligne ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onlineUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-green-500' : 
                          user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className={moodEmojis[user.mood as keyof typeof moodEmojis]?.emoji}>
                            {moodEmojis[user.mood as keyof typeof moodEmojis]?.emoji}
                          </span>
                          {user.location}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'feed' && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Composer un post */}
                  <Card className="border-2 border-blue-200 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex gap-4 mb-4">
                        <Avatar>
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Partagez votre état d'esprit, une gratitude, une réussite..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[100px] resize-none border-0 focus:ring-0 text-base"
                          />
                        </div>
                      </div>
                      
                      {/* Type de post */}
                      <div className="flex gap-2 mb-4">
                        {[
                          { type: 'text', label: 'Pensée', icon: MessageCircle },
                          { type: 'gratitude', label: 'Gratitude', icon: Heart },
                          { type: 'achievement', label: 'Réussite', icon: Award },
                          { type: 'support', label: 'Besoin de soutien', icon: Shield }
                        ].map(({ type, label, icon: Icon }) => (
                          <Button
                            key={type}
                            variant={postType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPostType(type as any)}
                            className={postType === type ? "bg-gradient-to-r from-pink-500 to-rose-500" : ""}
                          >
                            <Icon className="w-4 h-4 mr-1" />
                            {label}
                          </Button>
                        ))}
                      </div>

                      {/* Sélection d'humeur */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-gray-700">Humeur:</span>
                        <div className="flex gap-2">
                          {Object.entries(moodEmojis).map(([mood, data]) => (
                            <button
                              key={mood}
                              onClick={() => setSelectedMood(mood)}
                              className={`p-2 rounded-full transition-all ${
                                selectedMood === mood ? 'bg-pink-100 ring-2 ring-pink-500' : 'hover:bg-gray-100'
                              }`}
                            >
                              <span className="text-lg">{data.emoji}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Image className="w-4 h-4 mr-1" />
                            Photo
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mic className="w-4 h-4 mr-1" />
                            Audio
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            Lieu
                          </Button>
                        </div>
                        <Button
                          onClick={publishPost}
                          disabled={!newPost.trim()}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flux de posts */}
                  <div className="space-y-6">
                    {posts.map((post, index) => {
                      const PostIcon = getPostTypeIcon(post.type);
                      const postTypeColor = getPostTypeColor(post.type);
                      
                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-gray-200 hover:border-pink-300 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex gap-4 mb-4">
                                <Avatar>
                                  <AvatarImage src={post.author.avatar} />
                                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{post.author.name}</span>
                                    <Badge variant="outline" className={`text-xs ${postTypeColor}`}>
                                      <PostIcon className="w-3 h-3 mr-1" />
                                      {post.type}
                                    </Badge>
                                    {post.mood && (
                                      <span className="text-lg">
                                        {moodEmojis[post.mood as keyof typeof moodEmojis]?.emoji}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-3">
                                    {post.timestamp.toLocaleString()}
                                  </div>
                                  <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                                  
                                  {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                      {post.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          #{tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleLike(post.id)}
                                        className={post.isLiked ? "text-red-500" : ""}
                                      >
                                        <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                                        {post.likes}
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        {post.comments.length}
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Share2 className="w-4 h-4 mr-1" />
                                        Partager
                                      </Button>
                                    </div>
                                    {post.supportLevel && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Sparkles className="w-4 h-4" />
                                        {post.supportLevel}% d'énergie positive
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'challenges' && (
                <motion.div
                  key="challenges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card className="border-2 border-yellow-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Défis Communautaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        {communityChallenges.map((challenge, index) => {
                          const Icon = challenge.icon;
                          return (
                            <motion.div
                              key={challenge.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                                    <Icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-lg">{challenge.title}</h3>
                                    <p className="text-gray-600 text-sm">{challenge.description}</p>
                                  </div>
                                </div>
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                  {challenge.reward}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                <div className="text-center">
                                  <div className="font-bold text-purple-600">{challenge.participants}</div>
                                  <div className="text-gray-500">Participants</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-blue-600">{challenge.duration}</div>
                                  <div className="text-gray-500">Durée</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-green-600">{challenge.progress}%</div>
                                  <div className="text-gray-500">Progression</div>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">Progression collective</span>
                                  <span className="text-sm text-gray-600">{challenge.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${challenge.progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Rejoindre le défi
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar droite - Sessions live et notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Session live */}
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-green-500" />
                  Session Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLiveSessionActive ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">Méditation guidée</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Rejoignez la méditation collective quotidienne
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      Commence dans 15 minutes
                    </div>
                    <Button
                      onClick={joinLiveSession}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Rejoindre (23 participants)
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                    </div>
                    <h3 className="font-bold mb-2 text-green-600">Session en cours</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {liveParticipants} participants connectés
                    </p>
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-green-800">
                        "Respirez profondément et ressentez la connexion avec la communauté..."
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                      Quitter la session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications récentes */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: 'like',
                      message: 'Emma a aimé votre gratitude',
                      time: '5min',
                      avatar: '/api/placeholder/32/32'
                    },
                    {
                      type: 'comment',
                      message: 'Lucas a commenté votre réussite',
                      time: '1h',
                      avatar: '/api/placeholder/32/32'
                    },
                    {
                      type: 'challenge',
                      message: 'Nouveau défi disponible: "Sourire quotidien"',
                      time: '2h',
                      avatar: null
                    },
                    {
                      type: 'buddy',
                      message: 'Sophie souhaite être votre amie bien-être',
                      time: '1j',
                      avatar: '/api/placeholder/32/32'
                    }
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      {notif.avatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notif.avatar} />
                          <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-orange-600 hover:text-orange-700">
                  Voir toutes les notifications
                </Button>
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Votre Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-600">47</div>
                    <div className="text-xs text-gray-500">Cœurs reçus</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-xs text-gray-500">Personnes aidées</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-gray-500">Défis complétés</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-xs text-gray-500">Points karma</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}