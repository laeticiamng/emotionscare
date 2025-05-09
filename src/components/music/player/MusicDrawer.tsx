
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, Music, Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import MusicPlayer from './MusicPlayer';
import { useToast } from '@/hooks/use-toast';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, volume, setVolume, nextTrack, previousTrack } = useMusic();
  const { handleGenerateLyrics, createMusicTrack, isLoading, isProcessing, progress } = useMusicalCreation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("player");
  const [promptText, setPromptText] = useState<string>("");
  const isMobile = useIsMobile();

  // Assurer que le lecteur fonctionne correctement lors de l'ouverture/fermeture du drawer
  useEffect(() => {
    // Réinitialiser l'état du formulaire à l'ouverture
    if (open) {
      setPromptText("");
    }
  }, [open]);

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };

  const handleTogglePlay = () => {
    if (isPlaying && currentTrack) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  const handleGenerateMusic = async () => {
    if (!promptText.trim()) {
      toast({
        title: "Prompt requis",
        description: "Veuillez saisir une description pour générer de la musique",
        variant: "destructive"
      });
      return;
    }

    try {
      // Générer les paroles basées sur le prompt si nécessaire
      let lyrics = "";
      if (promptText.length > 30) {
        lyrics = await handleGenerateLyrics(promptText);
      }

      // Créer la piste musicale
      await createMusicTrack({
        title: `Musique générée: ${promptText.substring(0, 20)}...`,
        prompt: promptText,
        lyrics: lyrics || undefined,
        instrumental: !lyrics
      });

      toast({
        title: "Génération en cours",
        description: "Votre musique est en préparation",
      });
    } catch (error) {
      console.error("Erreur lors de la génération de musique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la musique pour le moment",
        variant: "destructive"
      });
    }
  };

  // Version mobile avec Drawer (bottom sheet)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh]">
          <div className="p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <SheetTitle className="text-center flex-1">Lecteur Musical</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="player" className="text-sm">Lecteur</TabsTrigger>
                <TabsTrigger value="generate" className="text-sm">Générer</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === "player" ? (
                    <div className="py-2">
                      <MusicPlayer />
                    </div>
                  ) : (
                    <div className="py-2">
                      <GenerateMusicContent 
                        promptText={promptText}
                        setPromptText={setPromptText}
                        isLoading={isLoading}
                        isProcessing={isProcessing}
                        progress={progress}
                        handleGenerateMusic={handleGenerateMusic}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
          
          {/* Mini player for mobile */}
          <AnimatePresence>
            {currentTrack && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {currentTrack.coverUrl || currentTrack.cover ? (
                      <img 
                        src={currentTrack.coverUrl || currentTrack.cover} 
                        alt={currentTrack.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-5 w-5 text-primary/70" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 mx-2">
                    <p className="font-medium truncate text-sm">{currentTrack.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={previousTrack}>
                      <SkipBack size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleTogglePlay}>
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextTrack}>
                      <SkipForward size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DrawerContent>
      </Drawer>
    );
  }

  // Version desktop avec Sheet (sidebar)
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-md border-l transition-transform duration-300 ease-in-out p-0 flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between p-4 border-b">
          <SheetTitle>Lecteur Musical</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="player">Lecteur</TabsTrigger>
              <TabsTrigger value="generate">Générer</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "player" ? (
                  <div className="py-4">
                    <MusicPlayer />
                  </div>
                ) : (
                  <div className="py-4">
                    <GenerateMusicContent 
                      promptText={promptText}
                      setPromptText={setPromptText}
                      isLoading={isLoading}
                      isProcessing={isProcessing}
                      progress={progress}
                      handleGenerateMusic={handleGenerateMusic}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
        
        {/* Mini player en bas du drawer */}
        <AnimatePresence>
          {currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="border-t bg-background p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {currentTrack.coverUrl || currentTrack.cover ? (
                    <img 
                      src={currentTrack.coverUrl || currentTrack.cover} 
                      alt={currentTrack.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="h-6 w-6 text-primary/70" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 mx-3">
                  <p className="font-medium truncate">{currentTrack.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={previousTrack}>
                    <SkipBack size={18} />
                  </Button>
                  <Button 
                    variant={isPlaying ? "secondary" : "default"} 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={handleTogglePlay}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={nextTrack}>
                    <SkipForward size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

// Composant extrait pour le contenu de génération de musique
interface GenerateMusicContentProps {
  promptText: string;
  setPromptText: (text: string) => void;
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  handleGenerateMusic: () => void;
}

const GenerateMusicContent: React.FC<GenerateMusicContentProps> = ({ 
  promptText, 
  setPromptText, 
  isLoading, 
  isProcessing, 
  progress, 
  handleGenerateMusic 
}) => {
  return (
    <Card className="bg-muted/40">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Créer une musique</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Décrivez l'ambiance ou le type de musique que vous souhaitez générer
            </p>
            
            <textarea 
              className="w-full resize-none border rounded-md p-3 h-24 bg-background focus-visible:ring-1 focus-visible:ring-primary transition-all"
              placeholder="Ex: Une mélodie relaxante avec des sons de piano et de nature..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            
            <div className="mt-4 flex items-center justify-between">
              {isProcessing && (
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-2 bg-primary/30 rounded-full flex-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary rounded-full" 
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{progress}%</span>
                </div>
              )}
              
              <Button 
                onClick={handleGenerateMusic} 
                disabled={isLoading || isProcessing || !promptText.trim()}
                className={`ml-auto bg-[#6366F1] hover:bg-[#4F46E5] transition-all ${isLoading ? "animate-pulse" : ""}`}
              >
                {isLoading ? "Chargement..." : "Générer"}
              </Button>
            </div>
          </div>
          
          {/* Suggestions rapides */}
          <div>
            <h4 className="text-sm font-medium mb-2">Suggestions rapides</h4>
            <div className="flex flex-wrap gap-2">
              {["Méditation matinale", "Motivation sportive", "Ambiance de travail", "Sons de nature", "Relaxation"].map((suggestion) => (
                <Button 
                  key={suggestion} 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPromptText(suggestion)}
                  className="text-xs transition-all hover:bg-primary/10"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Vos créations récentes</h3>
      <p className="text-sm text-muted-foreground">
        Accédez à toutes vos créations dans la section Musique.
      </p>
    </div>
  );
};

export default MusicDrawer;
