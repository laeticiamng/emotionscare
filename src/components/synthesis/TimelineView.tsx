// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrchestration } from '@/contexts/OrchestrationContext';
import { 
  Timeline, 
  TimelineItem, 
  TimelineHeader, 
  TimelineIcon, 
  TimelineTitle, 
  TimelineContent, 
  TimelineBody 
} from '@/components/ui/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Star, 
  Clock, 
  Flag, 
  Download, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/providers/theme';
import { Skeleton } from '@/components/ui/skeleton';

const getMoodColor = (mood: string) => {
  switch (mood.toLowerCase()) {
    case 'happy': return 'bg-green-500';
    case 'focused': return 'bg-blue-500';
    case 'calm': return 'bg-sky-400';
    case 'stress': case 'stressed': return 'bg-yellow-500';
    case 'anxious': return 'bg-orange-500';
    case 'sad': return 'bg-indigo-400';
    case 'angry': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getMoodIcon = (mood: string) => {
  switch (mood.toLowerCase()) {
    case 'happy': return <Star className="h-4 w-4 text-white" />;
    case 'focused': return <ZoomIn className="h-4 w-4 text-white" />;
    case 'calm': return <Clock className="h-4 w-4 text-white" />;
    default: return <Calendar className="h-4 w-4 text-white" />;
  }
};

const TimelineView: React.FC = () => {
  const { events, addEvent } = useOrchestration();
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { isDarkMode } = useTheme();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    // Simulate export functionality
    const exportStarted = setTimeout(() => {
      alert("Synthèse exportée avec succès");
    }, 800);
    
    return () => clearTimeout(exportStarted);
  };

  const changeZoom = (increment: boolean) => {
    setZoomLevel(prev => {
      const newZoom = increment ? prev + 0.2 : prev - 0.2;
      return Math.max(0.6, Math.min(1.4, newZoom));
    });
  };

  // Sort events by time, most recent first
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Identify important events (for demonstration, every third event)
  const isImportantEvent = (index: number) => index % 3 === 0;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl text-white">Timeline Émotionnelle</CardTitle>
            <CardDescription className="text-slate-300">
              Visualisation de votre parcours émotionnel
            </CardDescription>
          </div>

          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => changeZoom(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réduire</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => changeZoom(true)}
                    className="text-white hover:bg-white/10"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agrandir</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExport}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exporter
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Télécharger la synthèse</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`p-4 md:p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }} className="transition-transform duration-300">
            <Timeline>
              <AnimatePresence>
                {sortedEvents.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-8 text-muted-foreground"
                  >
                    Aucun événement enregistré dans la timeline.
                  </motion.div>
                ) : (
                  sortedEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <TimelineItem>
                        <TimelineHeader>
                          <TimelineIcon className={`${getMoodColor(event.mood)} text-white`}>
                            {getMoodIcon(event.mood)}
                          </TimelineIcon>
                          <TimelineTitle className="flex items-center gap-2">
                            {event.mood}
                            {isImportantEvent(index) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                              >
                                <Badge variant="outline" className="ml-2 border-amber-500 text-amber-500 flex items-center gap-1">
                                  <Flag className="h-3 w-3" />
                                  <span>Important</span>
                                </Badge>
                              </motion.div>
                            )}
                          </TimelineTitle>
                        </TimelineHeader>
                        <TimelineContent>
                          <TimelineBody>
                            Source: {event.source}
                            <div className="text-xs mt-1 text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </TimelineBody>
                        </TimelineContent>
                      </TimelineItem>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </Timeline>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimelineView;
