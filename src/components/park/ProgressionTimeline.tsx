/**
 * Timeline visuelle de la progression du joueur dans le parc émotionnel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  timestamp: Date;
  type: 'attraction' | 'badge' | 'quest' | 'milestone';
  completed: boolean;
}

interface ProgressionTimelineProps {
  events: TimelineEvent[];
  title?: string;
  maxDisplay?: number;
}

export const ProgressionTimeline: React.FC<ProgressionTimelineProps> = ({
  events,
  title = '📊 Votre Progression',
  maxDisplay = 10
}) => {
  const sortedEvents = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxDisplay);

  if (sortedEvents.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-border/50">
          <p className="text-muted-foreground">
            Commencez votre voyage pour remplir votre timeline de progression
          </p>
        </Card>
      </motion.section>
    );
  }

  const typeIcons = {
    attraction: '🏛️',
    badge: '🏆',
    quest: '⚡',
    milestone: '🎯'
  };

  const typeColors = {
    attraction: 'from-blue-500/20 to-cyan-500/20',
    badge: 'from-yellow-500/20 to-orange-500/20',
    quest: 'from-purple-500/20 to-pink-500/20',
    milestone: 'from-green-500/20 to-emerald-500/20'
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {sortedEvents.length} événement{sortedEvents.length > 1 ? 's' : ''} dans votre histoire
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-transparent" />

        {/* Events */}
        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const date = new Date(event.timestamp);
            const formattedDate = date.toLocaleDateString('fr-FR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-20"
              >
                {/* Timeline node */}
                <motion.div
                  className="absolute left-0 w-12 h-12 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full" />
                  <div className="relative text-lg">
                    {event.completed ? (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {typeIcons[event.type]}
                      </motion.div>
                    ) : (
                      <span>{typeIcons[event.type]}</span>
                    )}
                  </div>
                </motion.div>

                {/* Event card */}
                <Card className={`
                  relative overflow-hidden
                  bg-gradient-to-br ${typeColors[event.type]}
                  border-2 border-border/50
                  hover:border-primary/50 transition-all
                  p-4 group
                `}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                          {event.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {formattedDate}
                      </p>
                    </div>
                    {event.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      </motion.div>
                    )}
                  </div>

                  {/* Background glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: sortedEvents.length * 0.05 + 0.2 }}
          className="relative pl-20 pt-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀
              </motion.div>
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Votre aventure continue...
              </p>
              <p className="text-xs text-muted-foreground">
                Restez engagé pour débloquer plus de contenus
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProgressionTimeline;
