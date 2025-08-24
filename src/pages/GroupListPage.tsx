
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Plus, Users, BarChart, BookOpen, MessageCircle, 
  Heart, Star, Crown, Sparkles, Globe, Shield, Zap,
  TrendingUp, Calendar, Activity, Award, Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGroups } from '@/lib/communityService';
import GroupForm from '@/components/community/GroupForm';
import { cn } from '@/lib/utils';

// Enhanced interface for immersive experience
interface Group {
  id: string;
  name: string;
  topic: string;
  description: string;
  members: GroupMember[];
  category: string;
  privacy: 'public' | 'private' | 'premium';
  activity: number;
  trending: boolean;
  featured: boolean;
  mood: string;
  color: string;
  stats: {
    dailyMessages: number;
    weeklyGrowth: number;
    engagement: number;
    satisfaction: number;
  };
  lastActivity: string;
  moderators: string[];
  tags: string[];
  createdAt: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'online' | 'away' | 'offline';
  joinedAt: string;
  contributions: number;
}

interface GroupListComponentProps {
  groups: Group[];
  loading?: boolean;
}

const GroupListComponent: React.FC<GroupListComponentProps> = ({ groups, loading }) => {
  const shouldReduceMotion = useReducedMotion();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <motion.div
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ 
            y: shouldReduceMotion ? 0 : [0, -10, 0],
            rotate: shouldReduceMotion ? 0 : [0, 5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Users className="mx-auto h-16 w-16 text-purple-400" />
        </motion.div>
        <h3 className="mt-6 text-2xl font-bold text-white">Créez Votre Communauté</h3>
        <p className="mt-2 text-lg text-purple-200 max-w-md mx-auto">
          Soyez le premier à créer un espace de connexion et de bien-être partagé
        </p>
        <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Créer le Premier Groupe
        </Button>
      </motion.div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'wellness': return Heart;
      case 'meditation': return Star;
      case 'support': return Shield;
      case 'creativity': return Sparkles;
      case 'fitness': return Zap;
      default: return Users;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'energetic': return 'from-orange-500 to-red-500';
      case 'calm': return 'from-blue-500 to-cyan-500';
      case 'creative': return 'from-purple-500 to-pink-500';
      case 'supportive': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {groups.map((group, index) => {
          const CategoryIcon = getCategoryIcon(group.category);
          const onlineMembers = group.members.filter(m => m.status === 'online').length;
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: shouldReduceMotion ? 0.1 : 0.6,
                delay: shouldReduceMotion ? 0 : index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="cursor-pointer"
            >
              <Card className="h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 group overflow-hidden">
                {/* Header with mood gradient */}
                <div className={cn(
                  "h-2 bg-gradient-to-r",
                  getMoodColor(group.mood)
                )} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-br",
                        getMoodColor(group.mood),
                        "shadow-lg"
                      )}>
                        <CategoryIcon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-white text-lg group-hover:text-purple-200 transition-colors">
                            {group.name}
                          </CardTitle>
                          {group.featured && (
                            <Crown className="h-4 w-4 text-yellow-400" />
                          )}
                          {group.trending && (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        <p className="text-xs text-purple-300 capitalize">{group.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          group.privacy === 'premium' && "border-yellow-500/50 text-yellow-300",
                          group.privacy === 'private' && "border-red-500/50 text-red-300",
                          group.privacy === 'public' && "border-green-500/50 text-green-300"
                        )}
                      >
                        {group.privacy === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                        {group.privacy === 'private' && <Shield className="h-3 w-3 mr-1" />}
                        {group.privacy === 'public' && <Globe className="h-3 w-3 mr-1" />}
                        {group.privacy}
                      </Badge>
                      
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-300">{onlineMembers} en ligne</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {group.description}
                  </p>
                  
                  {/* Member Avatars */}
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member, i) => (
                        <div key={member.id} className="relative">
                          <Avatar className="h-6 w-6 border-2 border-gray-800">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-800",
                            member.status === 'online' && "bg-green-500",
                            member.status === 'away' && "bg-yellow-500",
                            member.status === 'offline' && "bg-gray-500"
                          )} />
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className="h-6 w-6 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center">
                          <span className="text-xs text-gray-300">
                            +{group.members.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {group.members.length} membres
                    </span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Activité</span>
                        <span>{group.stats.engagement}%</span>
                      </div>
                      <Progress value={group.stats.engagement} className="h-1" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Satisfaction</span>
                        <span>{group.stats.satisfaction}%</span>
                      </div>
                      <Progress value={group.stats.satisfaction} className="h-1" />
                    </div>
                  </div>
                  
                  {/* Activity Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{group.stats.dailyMessages} msg/jour</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">+{group.stats.weeklyGrowth}% cette semaine</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {group.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag}
                        variant="secondary" 
                        className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {group.tags.length > 3 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-gray-500/20 text-gray-400"
                      >
                        +{group.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-400">
                      Actif {group.lastActivity}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Rejoindre
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const GroupListPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [groups, setGroups] = useState<Group[]>([
    // Mock enhanced data
    {
      id: '1',
      name: 'Méditation Matinale',
      topic: 'Méditation',
      description: 'Communauté bienveillante pour commencer chaque journée en pleine conscience',
      members: [
        { id: '1', name: 'Marie Durand', avatar: '/api/placeholder/32/32', role: 'admin', status: 'online', joinedAt: '2024-01-01', contributions: 156 },
        { id: '2', name: 'Pierre Martin', avatar: '/api/placeholder/32/32', role: 'moderator', status: 'online', joinedAt: '2024-01-15', contributions: 89 },
        { id: '3', name: 'Sophie Chen', avatar: '/api/placeholder/32/32', role: 'member', status: 'away', joinedAt: '2024-02-01', contributions: 45 },
        { id: '4', name: 'Alex Rivera', avatar: '/api/placeholder/32/32', role: 'member', status: 'online', joinedAt: '2024-02-10', contributions: 23 },
        { id: '5', name: 'Luna Garcia', avatar: '/api/placeholder/32/32', role: 'member', status: 'offline', joinedAt: '2024-02-15', contributions: 12 }
      ],
      category: 'meditation',
      privacy: 'public',
      activity: 95,
      trending: true,
      featured: true,
      mood: 'calm',
      color: 'blue',
      stats: {
        dailyMessages: 47,
        weeklyGrowth: 12,
        engagement: 89,
        satisfaction: 94
      },
      lastActivity: 'il y a 5min',
      moderators: ['1', '2'],
      tags: ['méditation', 'mindfulness', 'bien-être', 'routine matinale'],
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Créatifs Zen',
      topic: 'Art-thérapie',
      description: 'Expression artistique et créativité comme chemin vers le bien-être émotionnel',
      members: [
        { id: '6', name: 'Emma Wilson', avatar: '/api/placeholder/32/32', role: 'admin', status: 'online', joinedAt: '2024-01-05', contributions: 234 },
        { id: '7', name: 'David Kim', avatar: '/api/placeholder/32/32', role: 'member', status: 'online', joinedAt: '2024-01-20', contributions: 67 },
        { id: '8', name: 'Chloe Brown', avatar: '/api/placeholder/32/32', role: 'member', status: 'away', joinedAt: '2024-02-05', contributions: 34 }
      ],
      category: 'creativity',
      privacy: 'public',
      activity: 78,
      trending: false,
      featured: false,
      mood: 'creative',
      color: 'purple',
      stats: {
        dailyMessages: 23,
        weeklyGrowth: 8,
        engagement: 76,
        satisfaction: 88
      },
      lastActivity: 'il y a 1h',
      moderators: ['6'],
      tags: ['art', 'créativité', 'expression', 'thérapie'],
      createdAt: '2024-01-05'
    },
    {
      id: '3',
      name: 'Warriors du Wellness',
      topic: 'Fitness Mental',
      description: 'Communauté énergique combinant fitness physique et mental pour un bien-être complet',
      members: [
        { id: '9', name: 'Jake Thompson', avatar: '/api/placeholder/32/32', role: 'admin', status: 'online', joinedAt: '2024-01-10', contributions: 189 },
        { id: '10', name: 'Mia Rodriguez', avatar: '/api/placeholder/32/32', role: 'member', status: 'online', joinedAt: '2024-01-25', contributions: 95 },
        { id: '11', name: 'Ryan Clark', avatar: '/api/placeholder/32/32', role: 'member', status: 'online', joinedAt: '2024-02-08', contributions: 56 },
        { id: '12', name: 'Zoe Lee', avatar: '/api/placeholder/32/32', role: 'member', status: 'away', joinedAt: '2024-02-12', contributions: 28 }
      ],
      category: 'fitness',
      privacy: 'premium',
      activity: 92,
      trending: true,
      featured: true,
      mood: 'energetic',
      color: 'orange',
      stats: {
        dailyMessages: 67,
        weeklyGrowth: 18,
        engagement: 91,
        satisfaction: 96
      },
      lastActivity: 'il y a 2min',
      moderators: ['9'],
      tags: ['fitness', 'motivation', 'énergie', 'challenge'],
      createdAt: '2024-01-10'
    }
  ]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with mock data for enhanced experience
    setFilteredGroups(groups);
  }, [groups]);

  useEffect(() => {
    let filtered = groups;
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        group =>
          group.name.toLowerCase().includes(lowerCaseQuery) ||
          group.description.toLowerCase().includes(lowerCaseQuery) ||
          group.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
          group.category.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(group => 
        selectedCategory === 'trending' ? group.trending :
        selectedCategory === 'featured' ? group.featured :
        selectedCategory === 'premium' ? group.privacy === 'premium' :
        group.category === selectedCategory
      );
    }
    
    setFilteredGroups(filtered);
  }, [searchQuery, groups, selectedCategory]);

  const handleCreateGroupSuccess = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
    setShowCreateForm(false);
    toast({
      title: 'Groupe créé',
      description: `Le groupe "${newGroup.name}" a été créé avec succès`,
    });
  };

  const myGroups = groups.filter(
    group => user && group.members.includes(user.id)
  );

  const myGroups = groups.filter(
    group => user && group.members.some(member => member.id === user.id)
  );

  const categories = [
    { id: 'all', name: 'Tous', icon: BarChart, count: groups.length },
    { id: 'trending', name: 'Tendances', icon: TrendingUp, count: groups.filter(g => g.trending).length },
    { id: 'featured', name: 'Mis en avant', icon: Star, count: groups.filter(g => g.featured).length },
    { id: 'meditation', name: 'Méditation', icon: Heart, count: groups.filter(g => g.category === 'meditation').length },
    { id: 'creativity', name: 'Créativité', icon: Sparkles, count: groups.filter(g => g.category === 'creativity').length },
    { id: 'fitness', name: 'Fitness', icon: Zap, count: groups.filter(g => g.category === 'fitness').length },
    { id: 'premium', name: 'Premium', icon: Crown, count: groups.filter(g => g.privacy === 'premium').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" data-testid="page-root">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4 space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 shadow-lg"
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.1, 
                rotate: [0, -5, 5, 0] 
              }}
              transition={{ duration: 0.6 }}
            >
              <Users className="h-12 w-12 text-purple-400" />
            </motion.div>
          </div>
          
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              🌟 Communautés Bienveillantes
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Rejoignez des espaces de connexion authentique pour votre bien-être émotionnel
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg rounded-full"
            >
              <Plus className="mr-2 h-5 w-5" />
              {showCreateForm ? 'Annuler' : 'Créer une Communauté'}
            </Button>
            
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300 px-4 py-2">
              <Activity className="mr-2 h-4 w-4" />
              {groups.reduce((sum, g) => sum + g.members.filter(m => m.status === 'online').length, 0)} membres actifs
            </Badge>
          </div>
        </motion.div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/30 backdrop-blur-md">
                <CardContent className="p-6">
                  <GroupForm
                    onSuccess={handleCreateGroupSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Search Bar */}
          <Card className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher par nom, description, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-transparent border-purple-500/30 text-white placeholder-purple-300 text-lg py-6"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center space-x-2",
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                )}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-gray-800/60 border-gray-700 p-1">
              <TabsTrigger 
                value="all" 
                className="flex items-center data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Globe className="mr-2 h-4 w-4" />
                <span>Explorer</span>
                <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300">
                  {filteredGroups.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="my" 
                className="flex items-center data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Mes Groupes</span>
                <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300">
                  {myGroups.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="recommended" 
                className="flex items-center data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Star className="mr-2 h-4 w-4" />
                <span>Recommandés</span>
                <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300">
                  {Math.min(6, filteredGroups.length)}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <GroupListComponent groups={filteredGroups} loading={isLoading} />
            </TabsContent>
            
            <TabsContent value="my" className="space-y-6">
              <GroupListComponent groups={myGroups} loading={isLoading} />
            </TabsContent>
            
            <TabsContent value="recommended" className="space-y-6">
              <GroupListComponent groups={filteredGroups.slice(0, 6)} loading={isLoading} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-indigo-500/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-6 w-6 mr-3 text-yellow-400" />
                Statistiques de la Communauté
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">
                    {groups.reduce((sum, g) => sum + g.members.length, 0)}
                  </div>
                  <div className="text-cyan-200 text-sm">Membres Actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {groups.reduce((sum, g) => sum + g.stats.dailyMessages, 0)}
                  </div>
                  <div className="text-green-200 text-sm">Messages/Jour</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.round(groups.reduce((sum, g) => sum + g.stats.satisfaction, 0) / groups.length)}%
                  </div>
                  <div className="text-purple-200 text-sm">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {groups.filter(g => g.trending).length}
                  </div>
                  <div className="text-yellow-200 text-sm">En Tendance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GroupListPage;
