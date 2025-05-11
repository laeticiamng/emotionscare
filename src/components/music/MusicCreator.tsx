
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music } from 'lucide-react';
import { useMusic } from '@/providers/MusicProvider';
import { Track } from '@/types';

const MusicCreator: React.FC = () => {
  const { toast } = useToast();
  const { setOpenDrawer } = useMusic();
  
  const [emotion, setEmotion] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<Track | null>(null);

  const generateTrack = async () => {
    if (!emotion && !prompt) {
      toast({
        title: "Information manquante",
        description: "Veuillez indiquer une émotion ou un prompt pour générer une musique",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock generated track
      const mockTrack: Track = {
        id: 'generated-' + Date.now(),
        title: `Mélodie ${emotion || 'personnalisée'}`,
        artist: 'IA Composer',
        duration: 180,
        url: '/audio/generated-track.mp3',
        coverUrl: '/images/music/generated-cover.jpg'
      };
      
      setGeneratedTrack(mockTrack);
      
      toast({
        title: "Musique générée",
        description: "Votre création musicale personnalisée est prête à être écoutée",
      });
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Une erreur s'est produite lors de la génération de la musique",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = () => {
    if (!generatedTrack) return;
    
    toast({
      title: "Sauvegardé",
      description: "La musique a été ajoutée à votre bibliothèque personnelle",
    });
    
    // Here you would normally save to the user's library via API
    setGeneratedTrack(null);
    setEmotion('');
    setPrompt('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Créateur de musique IA</CardTitle>
        <CardDescription>
          Créez une musique personnalisée basée sur vos émotions ou un prompt textuel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emotion">Émotion principale</Label>
            <Input
              id="emotion"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="Ex: Joie, Sérénité, Mélancolie..."
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prompt">Description détaillée (optionnel)</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez l'ambiance, le style musical ou les instruments souhaités..."
              className="h-24"
              disabled={loading}
            />
          </div>
          
          <Button 
            onClick={generateTrack} 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Music className="mr-2 h-4 w-4" />
                Générer ma musique
              </>
            )}
          </Button>
          
          {generatedTrack && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{generatedTrack.title}</h4>
                  <p className="text-sm text-muted-foreground">Par {generatedTrack.artist}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => saveToLibrary()}
                    size="sm"
                  >
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
