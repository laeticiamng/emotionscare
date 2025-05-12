
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, SkipBack, SkipForward, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AudioPlayerSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('relaxation');
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          <TabsTrigger value="meditation">Méditation</TabsTrigger>
          <TabsTrigger value="sleep">Sommeil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="relaxation">
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500" 
                alt="Relaxation audio"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <h3 className="text-xl font-semibold">Sons relaxants de la nature</h3>
            <p className="text-muted-foreground">Écoutez les sons apaisants de la forêt tropicale pour réduire votre stress.</p>
            
            <div className="flex items-center justify-center space-x-4">
              <Button size="icon" variant="outline">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="default" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button size="icon" variant="outline">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1:23</span>
                <span>4:56</span>
              </div>
              <Slider defaultValue={[25]} max={100} step={1} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider defaultValue={[80]} max={100} step={1} className="flex-1 max-w-xs" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="meditation">
          <div className="grid place-items-center h-40">
            <p className="text-muted-foreground">Séances de méditation guidée à venir.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="sleep">
          <div className="grid place-items-center h-40">
            <p className="text-muted-foreground">Histoires pour le sommeil et sons blancs à venir.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Sessions recommandées</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
              <div>
                <p className="font-medium">Méditation de pleine conscience</p>
                <p className="text-xs text-muted-foreground">10:30</p>
              </div>
              <Button size="sm" variant="ghost">
                <Play className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
              <div>
                <p className="font-medium">Sons de la pluie</p>
                <p className="text-xs text-muted-foreground">15:45</p>
              </div>
              <Button size="sm" variant="ghost">
                <Play className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
              <div>
                <p className="font-medium">Musique relaxante</p>
                <p className="text-xs text-muted-foreground">20:15</p>
              </div>
              <Button size="sm" variant="ghost">
                <Play className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioPlayerSection;
