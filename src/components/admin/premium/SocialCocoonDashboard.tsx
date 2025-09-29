
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialCocoonDashboardProps {
  isActive: boolean;
  onClick: () => void;
  visualStyle: 'minimal' | 'artistic';
  zenMode: boolean;
  className?: string;
}

const mockHashtags = [
  { tag: '#bienetre', count: 42, trend: 'up' },
  { tag: '#entraide', count: 36, trend: 'up' },
  { tag: '#motivation', count: 31, trend: 'stable' },
  { tag: '#teamspirit', count: 28, trend: 'up' },
  { tag: '#pausecafe', count: 22, trend: 'down' },
];

const SocialCocoonDashboard: React.FC<SocialCocoonDashboardProps> = ({
  isActive,
  onClick,
  visualStyle,
  zenMode,
  className
}) => {
  return (
    <Card 
      className={cn(
        "premium-card overflow-hidden relative transition-all ease-in-out", 
        isActive ? "shadow-xl border-primary/20" : "",
        zenMode ? "bg-background/70 backdrop-blur-lg border-border/50" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="relative">
        <CardTitle className="flex items-center text-xl">
          <div className="w-10 h-10 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="text-primary" />
          </div>
          Cocoon social
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-sm">Publications</span>
            </div>
            <span className="font-medium">248</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-500" />
              <span className="text-sm">Interactions</span>
            </div>
            <span className="font-medium">1,243</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
              <span className="text-sm">Taux d'engagement</span>
            </div>
            <span className="font-medium">72%</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Hashtags populaires
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockHashtags.map((tag) => (
              <motion.div
                key={tag.tag}
                whileHover={{ scale: 1.05 }}
                className="inline-flex"
              >
                <Badge 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 border",
                    visualStyle === 'artistic' ? 'rounded-lg' : '',
                    tag.trend === 'up' 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/30' 
                      : tag.trend === 'down'
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30'
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30'
                  )}
                >
                  <span>{tag.tag}</span>
                  <span className="ml-1 text-xs opacity-70">{tag.count}</span>
                  {tag.trend === 'up' && (
                    <span className="text-green-500 text-xs">↑</span>
                  )}
                  {tag.trend === 'down' && (
                    <span className="text-red-500 text-xs">↓</span>
                  )}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
        
        {visualStyle === 'artistic' && (
          <motion.div 
            className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium mb-2">Tendance d'interaction</h3>
            <p className="text-sm text-muted-foreground">
              Les discussions sur le bien-être et l'entraide dominent les conversations
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialCocoonDashboard;
