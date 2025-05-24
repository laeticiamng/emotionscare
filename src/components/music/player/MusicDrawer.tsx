
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import PremiumMusicPlayer from './PremiumMusicPlayer';
import ImmersiveFullscreenPlayer from './ImmersiveFullscreenPlayer';
import { useMusic } from '@/hooks/useMusic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MusicDrawerProps {
  children?: React.ReactNode;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ children }) => {
  const { currentTrack } = useMusic();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed bottom-4 left-4 z-50 shadow-lg bg-gradient-to-r from-primary to-secondary text-white border-0 hover:shadow-xl transition-all duration-300 animate-pulse-glow"
          >
            <Music className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[95vh] p-0">
        <SheetHeader className="p-6 pb-0 bg-gradient-to-r from-primary/10 to-secondary/10">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Studio Musical Premium
          </SheetTitle>
          {currentTrack && (
            <p className="text-muted-foreground">
              En cours : {currentTrack.title} - {currentTrack.artist}
            </p>
          )}
        </SheetHeader>
        
        <div className="p-6 pt-4 h-full overflow-auto">
          <Tabs defaultValue="premium" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="premium">Lecteur Premium</TabsTrigger>
              <TabsTrigger value="immersive">Mode Immersif</TabsTrigger>
            </TabsList>
            
            <TabsContent value="premium" className="h-full">
              <PremiumMusicPlayer className="max-w-6xl mx-auto h-full" />
            </TabsContent>
            
            <TabsContent value="immersive" className="h-full">
              <ImmersiveFullscreenPlayer className="max-w-6xl mx-auto h-full" />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
