
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Sparkles, Wand, Clock } from 'lucide-react';
import { MusicTrack } from '@/types';

interface MusicCreatorProps {
  onGenerate: (params: any) => void;
  isGenerating?: boolean;
}

const MusicCreator: React.FC<MusicCreatorProps> = ({ 
  onGenerate,
  isGenerating = false
}) => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(60);
  const [genre, setGenre] = useState<string>('ambient');
  const [emotion, setEmotion] = useState<string>('calm');
  
  const handleGenerate = () => {
    if (activeTab === 'prompt' && !prompt) return;
    
    let params = {};
    
    if (activeTab === 'prompt') {
      params = { prompt, duration };
    } else if (activeTab === 'emotion') {
      params = { emotion, duration };
    } else {
      params = { genre, duration };
    }
    
    const mockTrack: MusicTrack = {
      id: Math.random().toString(),
      title: activeTab === 'prompt' ? prompt : activeTab === 'emotion' ? `${emotion} melody` : `${genre} track`,
      artist: 'AI Composer',
      duration,
      track_url: '/sample-audio.mp3'
    };
    
    onGenerate(mockTrack);
  };
  
  const emotions = [
    { value: 'calm', label: 'Calme', color: 'bg-blue-500' },
    { value: 'happy', label: 'Joyeux', color: 'bg-yellow-500' },
    { value: 'sad', label: 'Mélancolique', color: 'bg-indigo-500' },
    { value: 'energetic', label: 'Énergique', color: 'bg-red-500' },
    { value: 'focused', label: 'Concentré', color: 'bg-green-500' },
    { value: 'dreamy', label: 'Rêveur', color: 'bg-purple-500' },
  ];
  
  const genres = [
    { value: 'ambient', label: 'Ambiant' },
    { value: 'classical', label: 'Classique' },
    { value: 'electronic', label: 'Électronique' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'lofi', label: 'Lo-Fi' },
    { value: 'nature', label: 'Sons naturels' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="prompt" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <Wand className="h-4 w-4" />
              <span>Prompt</span>
            </TabsTrigger>
            <TabsTrigger value="emotion" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Émotion</span>
            </TabsTrigger>
            <TabsTrigger value="genre" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Genre</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Description de la musique souhaitée</Label>
                <Input
                  id="prompt"
                  placeholder="Ex: Une ambiance relaxante avec des sons de pluie et un piano doux"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="emotion">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {emotions.map(emotionOption => (
                  <Button
                    key={emotionOption.value}
                    variant={emotion === emotionOption.value ? "default" : "outline"}
                    className="flex flex-col h-auto py-3 px-4 gap-1"
                    onClick={() => setEmotion(emotionOption.value)}
                  >
                    <div className={`w-4 h-4 rounded-full ${emotionOption.color}`}></div>
                    <span>{emotionOption.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="genre">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genres.map(genreOption => (
                  <Button
                    key={genreOption.value}
                    variant={genre === genreOption.value ? "default" : "outline"}
                    className="h-auto py-3"
                    onClick={() => setGenre(genreOption.value)}
                  >
                    {genreOption.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Durée: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</Label>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Slider
                value={[duration]}
                min={30}
                max={300}
                step={30}
                onValueChange={(value) => setDuration(value[0])}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">30s</span>
                <span className="text-xs text-muted-foreground">5m</span>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating || (activeTab === 'prompt' && !prompt)}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer la musique
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
