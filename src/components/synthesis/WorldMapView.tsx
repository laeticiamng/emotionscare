// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrchestration } from '@/contexts/OrchestrationContext';
import { Globe, ZoomIn, ZoomOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/providers/theme';
import { Skeleton } from '@/components/ui/skeleton';

interface EmotionCluster {
  id: string;
  x: number;
  y: number;
  radius: number;
  emotion: string;
  intensity: number;
  label: string;
  count: number;
}

// Mood to color mapping
const moodColors: Record<string, string> = {
  happy: '#22c55e', // green-500
  calm: '#0ea5e9', // sky-500
  focused: '#3b82f6', // blue-500
  stressed: '#eab308', // yellow-500
  anxious: '#f97316', // orange-500
  sad: '#6366f1', // indigo-500
  angry: '#ef4444', // red-500
  neutral: '#94a3b8', // slate-400
};

// Generate random emotion clusters for demo
const generateClusters = (count: number): EmotionCluster[] => {
  const emotions = ['happy', 'calm', 'focused', 'stressed', 'anxious', 'sad', 'angry', 'neutral'];
  const clusters: EmotionCluster[] = [];
  
  for (let i = 0; i < count; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    clusters.push({
      id: `cluster-${i}`,
      x: Math.random() * 80 + 10, // 10-90% of width
      y: Math.random() * 80 + 10, // 10-90% of height
      radius: Math.random() * 15 + 5, // 5-20px radius
      emotion,
      intensity: Math.random() * 0.8 + 0.2, // 0.2-1.0 intensity
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count: Math.floor(Math.random() * 10) + 1 // 1-10 count
    });
  }
  
  return clusters;
};

const WorldMapView: React.FC = () => {
  const { emotionalLocations } = useOrchestration();
  const [isLoading, setIsLoading] = useState(true);
  const [clusters, setClusters] = useState<EmotionCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { isDarkMode } = useTheme();
  
  const mapBackground = isDarkMode 
    ? "bg-slate-900 bg-opacity-50 bg-[url('/images/world-map-dark.svg')]" 
    : "bg-slate-100 bg-opacity-30 bg-[url('/images/world-map-light.svg')]";
  
  // Initialize clusters
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setClusters(generateClusters(8));
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleZoom = (increment: boolean) => {
    setZoomLevel(prev => {
      const newLevel = increment ? prev + 0.2 : prev - 0.2;
      return Math.max(0.6, Math.min(1.6, newLevel));
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white dark:from-blue-900 dark:to-indigo-900">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-white">
              <Globe className="h-5 w-5" />
              Carte Monde Émotionnelle
            </CardTitle>
            <CardDescription className="text-blue-100">
              Visualisation globale des tendances émotionnelles
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleZoom(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réduire la carte</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleZoom(true)}
                    className="text-white hover:bg-white/10"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agrandir la carte</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`p-0 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-[400px] w-full rounded-md" />
          </div>
        ) : (
          <div className="relative">
            <div 
              className={`relative aspect-video max-h-[500px] ${mapBackground} bg-no-repeat bg-center bg-contain`}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence>
                  {clusters.map((cluster) => (
                    <motion.div
                      key={cluster.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="absolute"
                      style={{
                        left: `${cluster.x}%`,
                        top: `${cluster.y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                      onMouseEnter={() => setSelectedCluster(cluster.id)}
                      onMouseLeave={() => setSelectedCluster(null)}
                    >
                      <motion.div
                        className="rounded-full cursor-pointer shadow-lg"
                        style={{ 
                          backgroundColor: moodColors[cluster.emotion] || "#94a3b8",
                          width: `${cluster.radius * 2}px`, 
                          height: `${cluster.radius * 2}px`,
                          opacity: cluster.intensity
                        }}
                        animate={{
                          scale: selectedCluster === cluster.id ? [1, 1.1, 1] : 1
                        }}
                        transition={{
                          repeat: selectedCluster === cluster.id ? Infinity : 0,
                          duration: 2
                        }}
                      />
                      
                      {selectedCluster === cluster.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} shadow-md`}
                        >
                          <div className="font-semibold">{cluster.label}</div>
                          <div className="text-xs opacity-80">{cluster.count} occurences</div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="p-4 flex flex-wrap gap-2 justify-center">
              {Object.entries(moodColors).map(([mood, color]) => (
                <div key={mood} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-xs capitalize">{mood}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorldMapView;
