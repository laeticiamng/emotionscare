
import React, { useState, useEffect } from 'react';
import Shell from '@/Shell';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const SanctuaryPage: React.FC = () => {
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes in seconds
  const [ambientVolume, setAmbientVolume] = useState(70);
  const { toast } = useToast();
  
  // Reset timer when scene changes
  useEffect(() => {
    setTimeElapsed(0);
    setIsPlaying(false);
  }, [activeScene]);
  
  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && timeElapsed < duration) {
      timer = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(timer);
            toast({
              title: "Session terminée",
              description: "Votre session de méditation est terminée"
            });
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, timeElapsed, duration, toast]);
  
  const togglePlayPause = () => {
    if (!activeScene) {
      toast({
        title: "Aucune scène sélectionnée",
        description: "Veuillez d'abord choisir un environnement",
        variant: "destructive"
      });
      return;
    }
    
    if (timeElapsed >= duration) {
      setTimeElapsed(0);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const scenes = [
    {
      id: 'forest',
      title: 'Forêt paisible',
      description: 'Sons apaisants d\'une forêt avec chants d\'oiseaux et bruissement des feuilles',
      image: 'https://placehold.co/800x450/1a1a2e/white?text=Forêt+paisible',
      color: 'bg-emerald-500'
    },
    {
      id: 'beach',
      title: 'Plage au coucher du soleil',
      description: 'Vagues douces et brise marine pour une détente profonde',
      image: 'https://placehold.co/800x450/1a1a2e/white?text=Plage+au+coucher+du+soleil',
      color: 'bg-amber-500'
    },
    {
      id: 'rain',
      title: 'Pluie sur le toit',
      description: 'Le son apaisant de la pluie qui tombe doucement',
      image: 'https://placehold.co/800x450/1a1a2e/white?text=Pluie+sur+le+toit',
      color: 'bg-blue-500'
    },
    {
      id: 'mountains',
      title: 'Méditation en montagne',
      description: 'L\'air frais et le calme des sommets pour une méditation profonde',
      image: 'https://placehold.co/800x450/1a1a2e/white?text=Méditation+en+montagne',
      color: 'bg-indigo-500'
    }
  ];
  
  const selectedScene = scenes.find(scene => scene.id === activeScene);
  
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Sanctuaire</h1>
          <p className="text-muted-foreground mb-6">
            Un espace dédié à la relaxation et la méditation guidée
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                {selectedScene ? (
                  <motion.div
                    key={selectedScene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={selectedScene.image} 
                          alt={selectedScene.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Button 
                            onClick={togglePlayPause} 
                            className="h-16 w-16 rounded-full"
                            variant="outline"
                          >
                            {isPlaying ? 
                              <Pause className="h-8 w-8" /> : 
                              <Play className="h-8 w-8 ml-1" />
                            }
                          </Button>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{selectedScene.title}</CardTitle>
                        <CardDescription>{selectedScene.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{formatTime(timeElapsed)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                            <Slider
                              value={[timeElapsed]}
                              max={duration}
                              step={1}
                              onValueChange={(values) => {
                                setTimeElapsed(values[0]);
                              }}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Volume ambiant</span>
                              <span className="text-sm">{ambientVolume}%</span>
                            </div>
                            <Slider
                              value={[ambientVolume]}
                              max={100}
                              step={1}
                              onValueChange={(values) => {
                                setAmbientVolume(values[0]);
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center bg-muted h-[400px] rounded-lg"
                  >
                    <div className="text-center p-6">
                      <h3 className="text-xl font-medium mb-2">Choisissez un environnement</h3>
                      <p className="text-muted-foreground mb-4">
                        Sélectionnez un environnement dans la liste pour commencer votre session
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Environnements</h2>
              
              {scenes.map((scene) => (
                <Card 
                  key={scene.id}
                  className={`cursor-pointer transition-all hover:border-primary ${activeScene === scene.id ? 'border-primary' : ''}`}
                  onClick={() => setActiveScene(scene.id)}
                >
                  <CardHeader className="py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${scene.color}`}></div>
                      <CardTitle className="text-base">{scene.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              
              <Card className="bg-muted/30">
                <CardHeader className="py-3">
                  <CardTitle className="text-base text-muted-foreground">
                    Bientôt disponible...
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Sessions de méditation guidées</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Vidéo de méditation</span>
                </div>
                <CardHeader>
                  <CardTitle>Méditation pour débutants</CardTitle>
                  <CardDescription>15 minutes • Guidée par Sophie Martin</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Démarrer</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Vidéo de méditation</span>
                </div>
                <CardHeader>
                  <CardTitle>Relaxation progressive</CardTitle>
                  <CardDescription>20 minutes • Guidée par Michel Dubois</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Démarrer</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Vidéo de méditation</span>
                </div>
                <CardHeader>
                  <CardTitle>Méditation sur la gratitude</CardTitle>
                  <CardDescription>10 minutes • Guidée par Claire Rousseau</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Démarrer</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default SanctuaryPage;
