
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useOrchestration } from '@/contexts/OrchestrationContext';
import { Clock, Play, Sun, Moon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/components/theme-provider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

const AMBIENT_MODES = [
  { id: 'calm', label: 'Calme', icon: Sun, color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'focus', label: 'Concentration', icon: Clock, color: 'bg-indigo-100 dark:bg-indigo-900' },
  { id: 'sleep', label: 'Repos', icon: Moon, color: 'bg-purple-100 dark:bg-purple-900' }
];

const SanctuaryView: React.FC = () => {
  const { sanctuaryWidgets } = useOrchestration();
  const [isLoading, setIsLoading] = useState(true);
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(50);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes in seconds
  const [timerRemaining, setTimerRemaining] = useState(300);
  const { isDarkMode } = useTheme();

  // Simulate loading widgets from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerRemaining <= 0 && timerActive) {
      setTimerActive(false);
      alert("Votre session de relaxation est terminée");
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerRemaining]);

  const toggleTimer = () => {
    if (!timerActive && timerRemaining <= 0) {
      // Reset timer if it's completed
      setTimerRemaining(timerDuration);
    }
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerRemaining(timerDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAmbientChange = (id: string) => {
    if (activeAmbient === id) {
      setActiveAmbient(null);
    } else {
      setActiveAmbient(id);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white dark:from-purple-900 dark:to-indigo-900">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl text-white">
              Sanctuaire
            </CardTitle>
            <CardDescription className="text-purple-100">
              Un espace de calme et de bien-être
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`p-4 md:p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ambiance selector */}
            <section>
              <h3 className="font-medium text-lg mb-3">Ambiance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <AnimatePresence>
                  {AMBIENT_MODES.map(mode => (
                    <motion.div
                      key={mode.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          activeAmbient === mode.id 
                            ? 'ring-2 ring-primary ring-offset-2' 
                            : 'hover:shadow-md'
                        } ${mode.color}`}
                        onClick={() => handleAmbientChange(mode.id)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white bg-opacity-20 rounded-full">
                              <mode.icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium">{mode.label}</span>
                          </div>
                          
                          {activeAmbient === mode.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 rounded-full bg-primary"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {activeAmbient && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <label className="block text-sm font-medium mb-1">Volume</label>
                  <Slider
                    value={[ambientVolume]}
                    onValueChange={(values) => setAmbientVolume(values[0])}
                    max={100}
                    step={1}
                    className="max-w-md"
                  />
                </motion.div>
              )}
            </section>
            
            {/* Focus timer */}
            <section className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Minuteur de relaxation
              </h3>
              
              <div className="flex flex-col gap-4 items-center">
                <div className="text-3xl font-mono font-semibold">
                  {formatTime(timerRemaining)}
                </div>
                
                <Progress 
                  value={(timerRemaining / timerDuration) * 100} 
                  className="w-full max-w-md h-2"
                />
                
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={timerActive ? "secondary" : "default"}
                          onClick={toggleTimer}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {timerActive ? 'Pause' : 'Démarrer'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{timerActive ? 'Mettre en pause' : 'Démarrer'} le minuteur</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={resetTimer}
                        >
                          Réinitialiser
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Réinitialiser le minuteur</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </section>
            
            {/* Exercises grid */}
            <section>
              <h3 className="font-medium text-lg mb-3">Exercices recommandés</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {sanctuaryWidgets.map((widget, index) => (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center justify-between">
                            <span>{widget.title}</span>
                            <Badge variant="outline">{widget.type}</Badge>
                          </CardTitle>
                          <CardDescription>{widget.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-end">
                          <div className="text-xs text-muted-foreground">
                            Recommandé pour: <span className="capitalize">{widget.emotion}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SanctuaryView;
