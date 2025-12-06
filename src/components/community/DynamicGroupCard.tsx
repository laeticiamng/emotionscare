
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Music, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface GroupActivity {
  type: 'post' | 'comment' | 'reaction';
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DynamicGroupProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  emotionTheme?: string;
  tags: string[];
  activity?: GroupActivity[];
  recommended?: boolean;
  className?: string;
  recentPostCount?: number;
  hasUnreadMessages?: boolean;
}

export const DynamicGroupCard: React.FC<DynamicGroupProps> = ({
  id,
  name,
  description,
  memberCount,
  emotionTheme,
  tags,
  activity,
  recommended = false,
  className,
  recentPostCount = 0,
  hasUnreadMessages = false,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Obtenir la couleur d'arrière-plan basée sur l'émotion thématique
  const getEmotionColor = (emotion?: string): string => {
    if (!emotion) return 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20';
    
    const emotionColors: Record<string, string> = {
      'calm': 'from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20',
      'energetic': 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      'creative': 'from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20',
      'reflective': 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      'anxious': 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
      'default': 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
    };
    
    return emotionColors[emotion.toLowerCase()] || emotionColors.default;
  };
  
  const handleNavigateToGroup = () => {
    navigate(`/community/groups/${id}`);
  };
  
  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "h-full transition-all duration-300 border overflow-hidden",
          isHovered ? "shadow-md" : "shadow-sm",
          recommended ? "ring-2 ring-primary/50" : ""
        )}
      >
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40 -z-10",
          getEmotionColor(emotionTheme)
        )} />
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {name}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            
            {recommended && (
              <Badge className="bg-primary">Recommandé</Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="bg-background/50"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {activity && activity.length > 0 && (
            <div className="grid grid-cols-3 gap-2 px-2">
              {activity.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-semibold">{item.count}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    {item.type === 'post' && <MessageSquare className="h-3 w-3" />}
                    {item.type === 'comment' && <MessageSquare className="h-3 w-3" />}
                    {item.type === 'reaction' && <Activity className="h-3 w-3" />}
                    <span>{item.type}s</span>
                    {item.trend === 'up' && <span className="text-green-500">↑</span>}
                    {item.trend === 'down' && <span className="text-red-500">↓</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{memberCount} membres</span>
            </div>
            
            {emotionTheme && (
              <div className="flex items-center gap-1">
                <Music className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{emotionTheme}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleNavigateToGroup}
            className="w-full"
            variant={recommended ? "default" : "outline"}
          >
            <span>Rejoindre le groupe</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
        
        {hasUnreadMessages && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center rounded-full">
              {recentPostCount}
            </Badge>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default DynamicGroupCard;
