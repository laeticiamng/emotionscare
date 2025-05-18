
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { MusicTrack } from '@/types/music';
import { useMusic } from '@/contexts/music';
import { Music, Wand2 } from 'lucide-react';

const MusicCreator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { generateMusic, setCurrentTrack } = useMusic();

  const examplePrompts = [
    "Une musique douce et relaxante avec piano et nature",
    "Un rythme énergique pour se motiver au travail",
    "Une ambiance jazz café pour la concentration",
    "Musique méditative avec des bols tibétains"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !generateMusic || !setCurrentTrack) return;
    
    setIsGenerating(true);
    try {
      const track = await generateMusic(prompt);
      
      if (track) {
        // Create a compatible track object
        const fullTrack: MusicTrack = {
          id: track.id || `generated-${Date.now()}`,
          name: track.name || 'Musique générée',
          title: track.title || track.name || 'Musique générée',
          artist: 'IA Composer',
          url: track.url || track.audioUrl || track.src,
          src: track.src || track.audioUrl || track.url,
          audioUrl: track.audioUrl || track.src || track.url,
          cover: track.cover || track.coverUrl || '/images/music/ai-generated.jpg',
        };
        
        setCurrentTrack(fullTrack);
      }
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <Card className="w-full border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Créateur de Musique IA
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Décrivez la musique que vous souhaitez
          </label>
          <Textarea
            id="prompt"
            placeholder="Ex: Une mélodie relaxante au piano avec des sons de nature..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Exemples d'inspiration :</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Durée approximative
          </label>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Court</span>
            <span>Moyen</span>
            <span>Long</span>
          </div>
          <Slider
            defaultValue={[50]}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt.trim() || !generateMusic}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer ma musique
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicCreator;
