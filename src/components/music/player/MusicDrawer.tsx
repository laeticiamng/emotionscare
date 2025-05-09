
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

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, volume, setVolume } = useMusic();
  const { handleGenerateLyrics, createMusicTrack, isLoading, isProcessing, progress } = useMusicalCreation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("player");
  const [promptText, setPromptText] = useState<string>("");

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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-md border-l transition-transform duration-300 ease-in-out">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Lecteur Musical</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="player">Lecteur</TabsTrigger>
            <TabsTrigger value="generate">Générer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="player" className="py-4">
            <MusicPlayer />
          </TabsContent>
          
          <TabsContent value="generate" className="py-4">
            <Card className="bg-muted/40">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Créer une musique</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Décrivez l'ambiance ou le type de musique que vous souhaitez générer
                    </p>
                    
                    <textarea 
                      className="w-full resize-none border rounded-md p-3 h-24 bg-background"
                      placeholder="Ex: Une mélodie relaxante avec des sons de piano et de nature..."
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                    />
                    
                    <div className="mt-4 flex items-center justify-between">
                      {isProcessing && (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse h-2 bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleGenerateMusic} 
                        disabled={isLoading || isProcessing || !promptText.trim()}
                        className="ml-auto bg-[#6366F1] hover:bg-[#4F46E5]"
                      >
                        {isLoading ? "Chargement..." : "Générer"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Suggestions rapides */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggestions rapides</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Méditation matinale", "Motivation sportive", "Ambiance de travail"].map((suggestion) => (
                        <Button 
                          key={suggestion} 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPromptText(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Liste des créations récentes */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Vos créations récentes</h3>
              <p className="text-sm text-muted-foreground">
                Accédez à toutes vos créations dans la section Musique.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Mini lecteur en bas du drawer */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={handleTogglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
