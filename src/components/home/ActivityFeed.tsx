/**
 * ActivityFeed - Flux d'activité en temps réel pour utilisateurs authentifiés
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Heart, Music, Brain, TrendingUp, Zap } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  description: string;
  icon: React.ReactNode;
  timestamp: string;
  color: string;
}

const ActivityFeed: React.FC = () => {
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
    },
  ]);

  useEffect(() => {
    // Simulation d'une mise à jour d'activité toutes les 30 secondes
    const interval = setInterval(() => {
      const newActivity = activities[Math.floor(Math.random() * activities.length)];
      const updatedActivities = [
        {
          ...newActivity,
          id: Date.now().toString(),
          timestamp: 'À l\'instant',
        },
        ...activities.slice(0, 4),
      ];
      setActivities(updatedActivities);
    }, 30000);

    return () => clearInterval(interval);
  }, [activities]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-4xl font-bold">Activité en direct</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Découvrez ce que font en ce moment nos utilisateurs. Rejoignez une communauté active
              et motivée pour améliorer votre bien-être émotionnel.
            </p>
          </div>

          {/* Activity Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {activities.map((activity, index) => (
              <motion.div key={activity.id} variants={itemVariants}>
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-primary/50">
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
                          <Badge
                            variant="outline"
                            className={`flex-shrink-0 ${activity.color}`}
                          >
                            {activity.icon}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pulse animation */}
                    <div className="mt-3 flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

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
  );
};

export default ActivityFeed;
