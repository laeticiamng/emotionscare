/**
 * ActivityFeed - Flux d'activité enrichi avec filtres, interactions et temps réel
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sparkles, Heart, Music, Brain, TrendingUp, Zap, Filter, 
  RefreshCw, Bell, BellOff, Share2, MessageCircle, ThumbsUp,
  Clock, Users, Pause, Play
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  description: string;
  icon: React.ReactNode;
  timestamp: string;
  color: string;
  category: 'scan' | 'music' | 'streak' | 'achievement' | 'social' | 'vr';
  likes: number;
  comments: number;
  isLiked: boolean;
}

type CategoryFilter = 'all' | 'scan' | 'music' | 'streak' | 'achievement' | 'social' | 'vr';

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'Tout',
  scan: 'Scans',
  music: 'Musique',
  streak: 'Séries',
  achievement: 'Succès',
  social: 'Social',
  vr: 'VR/AR',
};

const categoryIcons: Record<string, React.ReactNode> = {
  scan: <Brain className="h-4 w-4" />,
  music: <Music className="h-4 w-4" />,
  streak: <TrendingUp className="h-4 w-4" />,
  achievement: <Heart className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
  vr: <Zap className="h-4 w-4" />,
};

const ActivityFeed: React.FC = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      user: 'Sophie M.',
      avatar: '/avatars/avatar-1.jpg',
      action: 'Scan émotionnel complété',
      description: 'A découvert sa signature émotionnelle',
      icon: <Brain className="h-4 w-4" />,
      timestamp: 'À l\'instant',
      color: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      category: 'scan',
      likes: 12,
      comments: 3,
      isLiked: false,
    },
    {
      id: '2',
      user: 'Marc D.',
      avatar: '/avatars/avatar-2.jpg',
      action: 'Nouvelle composition musicale',
      description: 'A découvert une musique adaptée à son état',
      icon: <Music className="h-4 w-4" />,
      timestamp: 'Il y a 2 min',
      color: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
      category: 'music',
      likes: 8,
      comments: 1,
      isLiked: true,
    },
    {
      id: '3',
      user: 'Lisa K.',
      avatar: '/avatars/avatar-3.jpg',
      action: 'Série de 7 jours',
      description: 'A maintenu sa connexion quotidienne',
      icon: <TrendingUp className="h-4 w-4" />,
      timestamp: 'Il y a 5 min',
      color: 'bg-green-500/20 text-green-600 border-green-500/30',
      category: 'streak',
      likes: 24,
      comments: 5,
      isLiked: false,
    },
    {
      id: '4',
      user: 'Thomas R.',
      avatar: '/avatars/avatar-4.jpg',
      action: 'Nouvel objectif atteint',
      description: 'A complété 10 sessions de bien-être',
      icon: <Heart className="h-4 w-4" />,
      timestamp: 'Il y a 8 min',
      color: 'bg-red-500/20 text-red-600 border-red-500/30',
      category: 'achievement',
      likes: 31,
      comments: 7,
      isLiked: false,
    },
    {
      id: '5',
      user: 'Amélie S.',
      avatar: '/avatars/avatar-5.jpg',
      action: 'Session VR complétée',
      description: 'A exploré une expérience immersive',
      icon: <Zap className="h-4 w-4" />,
      timestamp: 'Il y a 10 min',
      color: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
      category: 'vr',
      likes: 15,
      comments: 2,
      isLiked: true,
    },
    {
      id: '6',
      user: 'Pierre L.',
      avatar: '/avatars/avatar-6.jpg',
      action: 'A rejoint un groupe',
      description: 'Groupe de méditation du matin',
      icon: <Users className="h-4 w-4" />,
      timestamp: 'Il y a 15 min',
      color: 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
      category: 'social',
      likes: 9,
      comments: 0,
      isLiked: false,
    },
  ]);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isAutoRefresh, _setIsAutoRefresh] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Filtrer les activités
  const filteredActivities = useMemo(() => {
    if (categoryFilter === 'all') return activities;
    return activities.filter(a => a.category === categoryFilter);
  }, [activities, categoryFilter]);

  // Statistiques
  const stats = useMemo(() => {
    const totalLikes = activities.reduce((sum, a) => sum + a.likes, 0);
    const totalComments = activities.reduce((sum, a) => sum + a.comments, 0);
    const categoryCounts = activities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'scan';
    
    return { totalLikes, totalComments, topCategory };
  }, [activities]);

  // Mise à jour automatique
  useEffect(() => {
    if (!isAutoRefresh || isPaused) return;

    const interval = setInterval(() => {
      const templates = [
        { action: 'Scan émotionnel complété', category: 'scan' as const, color: 'bg-blue-500/20 text-blue-600 border-blue-500/30', icon: <Brain className="h-4 w-4" /> },
        { action: 'Session musicale terminée', category: 'music' as const, color: 'bg-purple-500/20 text-purple-600 border-purple-500/30', icon: <Music className="h-4 w-4" /> },
        { action: 'Nouveau palier atteint', category: 'streak' as const, color: 'bg-green-500/20 text-green-600 border-green-500/30', icon: <TrendingUp className="h-4 w-4" /> },
        { action: 'Badge débloqué', category: 'achievement' as const, color: 'bg-red-500/20 text-red-600 border-red-500/30', icon: <Heart className="h-4 w-4" /> },
      ];
      
      const names = ['Emma T.', 'Lucas M.', 'Chloé B.', 'Hugo D.', 'Léa P.', 'Nathan R.'];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        user: name,
        avatar: `/avatars/avatar-${Math.floor(Math.random() * 6) + 1}.jpg`,
        action: template.action,
        description: 'Activité récente sur la plateforme',
        icon: template.icon,
        timestamp: 'À l\'instant',
        color: template.color,
        category: template.category,
        likes: Math.floor(Math.random() * 10),
        comments: Math.floor(Math.random() * 3),
        isLiked: false,
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);

      if (notificationsEnabled) {
        toast({
          title: `${name} - ${template.action}`,
          description: 'Nouvelle activité dans le flux',
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [isAutoRefresh, isPaused, notificationsEnabled, toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({ title: 'Flux actualisé' });
  };

  const handleLike = (activityId: string) => {
    setActivities(prev => prev.map(a => {
      if (a.id === activityId) {
        return {
          ...a,
          isLiked: !a.isLiked,
          likes: a.isLiked ? a.likes - 1 : a.likes + 1,
        };
      }
      return a;
    }));
  };

  const handleShare = async (activity: Activity) => {
    const text = `🌟 ${activity.user} vient de: ${activity.action} sur EmotionsCare !`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Activité EmotionsCare', text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Lien copié dans le presse-papier' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <TooltipProvider>
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-4xl font-bold">Activité en direct</h2>
                  {!isPaused && (
                    <Badge variant="outline" className="animate-pulse bg-green-500/10 text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      En direct
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground max-w-2xl">
                  Découvrez ce que font en ce moment nos utilisateurs. Rejoignez une communauté active.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          {key !== 'all' && categoryIcons[key]}
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsPaused(!isPaused)}
                    >
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isPaused ? 'Reprendre' : 'Pause'}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    >
                      {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {notificationsEnabled ? 'Désactiver notifications' : 'Activer notifications'}
                  </TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Mini Stats */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <ThumbsUp className="h-3 w-3 mr-1" />
                {stats.totalLikes} réactions
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <MessageCircle className="h-3 w-3 mr-1" />
                {stats.totalComments} commentaires
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                Mise à jour: toutes les 45s
              </Badge>
            </div>

            {/* Activity Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredActivities.map((activity) => (
                  <motion.div 
                    key={activity.id} 
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="hover:shadow-lg transition-all border-l-4 border-l-primary/50 group">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                              <AvatarImage src={activity.avatar} alt={activity.user} />
                              <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{activity.user}</p>
                                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                              </div>
                              <Badge variant="outline" className={`flex-shrink-0 ${activity.color}`}>
                                {activity.icon}
                              </Badge>
                            </div>

                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {activity.description}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-3 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => handleLike(activity.id)}
                              >
                                <ThumbsUp className={`h-3 w-3 mr-1 ${activity.isLiked ? 'fill-primary text-primary' : ''}`} />
                                {activity.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {activity.comments}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 ml-auto"
                                onClick={() => handleShare(activity)}
                              >
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredActivities.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune activité dans cette catégorie</p>
                  <Button variant="link" onClick={() => setCategoryFilter('all')}>
                    Voir toutes les activités
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {[
                { label: '25K+', desc: 'Utilisateurs actifs', color: 'text-blue-500' },
                { label: '150K+', desc: 'Sessions quotidiennes', color: 'text-green-500' },
                { label: '98.7%', desc: 'Satisfaction', color: 'text-purple-500' },
                { label: '24/7', desc: 'Support premium', color: 'text-orange-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center p-4 rounded-lg bg-muted/50 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default ActivityFeed;
