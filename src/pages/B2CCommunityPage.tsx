import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, MessageCircle, Share2, ThumbsUp, Star, 
  Trophy, Zap, Calendar, Filter, Search, Plus, Flame,
  UserCheck, Globe, Lock, Sparkles, Award, BookHeart,
  Camera, Video, Mic, Send, Image, Smile, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PremiumBackground from '@/components/premium/PremiumBackground';
import ImmersiveExperience from '@/components/premium/ImmersiveExperience';
import EnhancedCard from '@/components/premium/EnhancedCard';

import GamificationSystem from '@/components/premium/GamificationSystem';
import { cn } from '@/lib/utils';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    badge: string;
    isOnline: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  category: string;
  isLiked: boolean;
  isPinned?: boolean;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  tags: string[];
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  badge: string;
  isOnline: boolean;
  mutualFriends?: number;
  speciality: string;
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
}

const B2CCommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [topMembers, setTopMembers] = useState<CommunityMember[]>([]);
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  const categories = [
    { id: 'all', name: 'Tout', icon: Globe, color: 'bg-blue-500', count: 156 },
    { id: 'wellness', name: 'Bien-être', icon: Heart, color: 'bg-pink-500', count: 42 },
    { id: 'motivation', name: 'Motivation', icon: Zap, color: 'bg-yellow-500', count: 38 },
    { id: 'success', name: 'Réussites', icon: Trophy, color: 'bg-green-500', count: 24 },
    { id: 'support', name: 'Entraide', icon: UserCheck, color: 'bg-purple-500', count: 52 }
  ];

  // Données simulées - Posts
  useEffect(() => {
    setPosts([
      {
        id: '1',
        author: { 
          name: 'Marie L.', 
          avatar: '/placeholder.svg', 
          level: 15, 
          badge: 'Ambassadrice',
          isOnline: true
        },
        content: '🌟 Incroyable séance de méditation ce matin ! J\'ai enfin réussi à tenir 20 minutes sans distraction. Le module de respiration guidée m\'a vraiment aidée. Qui d\'autre a essayé ? #meditation #respiration #progress',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        comments: 8,
        category: 'wellness',
        isLiked: false,
        isPinned: true,
        tags: ['meditation', 'respiration', 'progress']
      },
      {
        id: '2',
        author: { 
          name: 'Thomas R.', 
          avatar: '/placeholder.svg', 
          level: 12, 
          badge: 'Explorateur',
          isOnline: false
        },
        content: 'Le module VR Galactique est absolument bluffant ! 🚀 Je me suis senti transporté dans un autre univers. La combinaison avec la musicothérapie IA crée une expérience unique. Merci à toute l\'équipe ! 10/10 recommande',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 31,
        comments: 12,
        category: 'success',
        isLiked: true,
        media: {
          type: 'image',
          url: '/placeholder.svg'
        },
        tags: ['vr', 'musicotherapie', 'experience']
      }
    ]);

    setTopMembers([
      { 
        id: '1', 
        name: 'Emma K.', 
        avatar: '/placeholder.svg', 
        level: 20, 
        points: 2850, 
        badge: 'Maître Zen', 
        isOnline: true, 
        mutualFriends: 5,
        speciality: 'Méditation avancée'
      },
      { 
        id: '2', 
        name: 'Lucas P.', 
        avatar: '/placeholder.svg', 
        level: 18, 
        points: 2340, 
        badge: 'Mentor', 
        isOnline: true, 
        mutualFriends: 3,
        speciality: 'Coaching émotionnel'
      }
    ]);

    setCommunityGroups([
      {
        id: '1',
        name: 'Méditation Matinale',
        description: 'Groupe pour partager vos sessions de méditation du matin',
        members: 1247,
        category: 'wellness',
        isPrivate: false,
        activity: 'high',
        image: '/placeholder.svg'
      },
      {
        id: '2',
        name: 'Défis Bien-être',
        description: 'Relevez des défis quotidiens pour améliorer votre bien-être',
        members: 892,
        category: 'motivation',
        isPrivate: false,
        activity: 'high',
        image: '/placeholder.svg'
      }
    ]);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      const post: CommunityPost = {
        id: Date.now().toString(),
        author: { 
          name: 'Vous', 
          avatar: '/placeholder.svg', 
          level: 10, 
          badge: 'Membre',
          isOnline: true
        },
        content: newPost,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        category: selectedCategory === 'all' ? 'wellness' : selectedCategory,
        isLiked: false,
        tags: newPost.match(/#\w+/g)?.map(tag => tag.slice(1)) || []
      };
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      setShowNewPostDialog(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen relative" data-testid="page-root">
      <PremiumBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <ImmersiveExperience
          title="Communauté EmotionsCare"
          subtitle="Partagez, connectez-vous et inspirez-vous dans notre écosystème bienveillant"
          variant="community"
        />

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Fil d'actualité
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Groupes
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Membres
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Événements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="grid lg:grid-cols-4 gap-6">
            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filtres et recherche */}
              <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2"
                        >
                          <category.icon className="w-4 h-4" />
                          {category.name}
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {category.count}
                          </Badge>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans la communauté..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={() => setShowNewPostDialog(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Publier
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Nouveau post dialog */}
              <AnimatePresence>
                {showNewPostDialog && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="animate-fade-in"
                  >
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Partager avec la communauté
                      </h3>
                      
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Partagez votre expérience, posez une question ou inspirez les autres... Utilisez # pour les hashtags"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="mb-4 resize-none"
                            rows={4}
                          />
                          
                          {/* Outils de publication */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Image className="w-4 h-4 mr-1" />
                                Photo
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Video className="w-4 h-4 mr-1" />
                                Vidéo
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Smile className="w-4 h-4 mr-1" />
                                Emoji
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                                Annuler
                              </Button>
                              <Button onClick={handleNewPost} disabled={!newPost.trim()}>
                                <Send className="w-4 h-4 mr-2" />
                                Publier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

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
                      className="animate-fade-in"
                    >
                      <Card className={cn(
                        "p-6 transition-all duration-300 hover:shadow-lg hover-scale",
                        post.isPinned && "ring-2 ring-primary/20 bg-primary/5"
                      )}>
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {post.author.level}
                            </div>
                            {post.author.isOnline && (
                              <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{post.author.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {post.author.badge}
                              </Badge>
                              {post.isPinned && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                                  <Star className="w-3 h-3 mr-1" />
                                  Épinglé
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground ml-auto">
                                {post.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            
                            <p className="text-sm mb-4 leading-relaxed">{post.content}</p>
                            
                            {/* Tags */}
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {post.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs hover-scale cursor-pointer">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Média */}
                            {post.media && (
                              <div className="mb-4 rounded-lg overflow-hidden">
                                <img 
                                  src={post.media.url} 
                                  alt="Post media" 
                                  className="w-full h-48 object-cover hover-scale cursor-pointer"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4">
                              <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(post.id)}
                                  className={cn(
                                    "flex items-center gap-2 hover-scale",
                                    post.isLiked && "text-red-500 hover:text-red-600"
                                  )}
                                >
                                  <Heart className={cn("w-4 h-4", post.isLiked && "fill-current")} />
                                  {post.likes}
                                </Button>
                              </motion.div>
                              
                              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover-scale">
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                              </Button>
                              
                              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover-scale">
                                <Share2 className="w-4 h-4" />
                                Partager
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistiques communauté */}
              <EnhancedCard title="Communauté Active" icon={Users}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Membres connectés</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold">2,847</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Posts aujourd'hui</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Likes partagés</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engagement</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">+18%</span>
                    </div>
                  </div>
                </div>
              </EnhancedCard>

              {/* Gamification compacte */}
              <GamificationSystem 
                currentXP={890}
                level={12}
                nextLevelXP={1000}
                achievements={[
                  { name: "Connecteur Social", description: "50 interactions", icon: "🤝" },
                  { name: "Inspirateur", description: "10 posts appréciés", icon: "✨" }
                ]}
                compact
              />

              {/* Top membres */}
              <EnhancedCard title="Membres Inspirants" icon={Trophy}>
                <div className="space-y-3">
                  {topMembers.map((member, index) => (
                    <motion.div 
                      key={member.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors hover-scale cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {index < 3 && (
                          <div className="absolute -top-2 -left-2">
                            <Award className={cn(
                              "w-4 h-4",
                              index === 0 && "text-yellow-500",
                              index === 1 && "text-gray-500",
                              index === 2 && "text-orange-500"
                            )} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{member.name}</span>
                          <Badge variant="outline" className="text-xs">Niv.{member.level}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.badge} • {member.points} pts
                        </div>
                        <div className="text-xs text-blue-600">
                          {member.speciality}
                        </div>
                        {member.mutualFriends && (
                          <div className="text-xs text-green-600">
                            {member.mutualFriends} amis en commun
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </EnhancedCard>

              {/* Actions rapides */}
              <EnhancedCard title="Actions Rapides" icon={Zap}>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BookHeart className="w-4 h-4 mr-2" />
                    Créer un groupe
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Organiser un événement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Flame className="w-4 h-4 mr-2" />
                    Challenges du jour
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Trouver des amis
                  </Button>
                </div>
              </EnhancedCard>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EnhancedCard className="hover-scale cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{group.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{group.members} membres</Badge>
                            <Badge variant="outline" className={cn(
                              group.activity === 'high' && "bg-green-50 text-green-700",
                              group.activity === 'medium' && "bg-yellow-50 text-yellow-700",
                              group.activity === 'low' && "bg-gray-50 text-gray-700"
                            )}>
                              {group.activity === 'high' ? 'Très actif' : 
                               group.activity === 'medium' ? 'Actif' : 'Peu actif'}
                            </Badge>
                          </div>
                        </div>
                        {group.isPrivate ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Globe className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <Button className="w-full" variant="outline">
                        Rejoindre le groupe
                      </Button>
                    </div>
                  </EnhancedCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="animate-fade-in">
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Section Membres</h3>
              <p className="text-muted-foreground">Découvrez tous les membres de la communauté</p>
            </div>
          </TabsContent>

          <TabsContent value="events" className="animate-fade-in">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Événements Communautaires</h3>
              <p className="text-muted-foreground">Participez aux événements et ateliers</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CCommunityPage;