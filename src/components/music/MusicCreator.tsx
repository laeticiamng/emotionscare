
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicTrack } from '@/types/music';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MusicCreator: React.FC = () => {
  const { toast } = useToast();
  const { playTrack } = useMusic();
  
  const [emotion, setEmotion] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState('');

  const emotions = [
    { value: 'happy', label: 'Joie' },
    { value: 'calm', label: 'Calme' },
    { value: 'energetic', label: 'Énergique' },
    { value: 'focused', label: 'Concentration' },
    { value: 'melancholic', label: 'Mélancolie' },
    { value: 'relaxed', label: 'Relaxation' }
  ];

  const generateTrack = async () => {
    if (!selectedEmotion && !prompt) {
      toast({
        title: "Information manquante",
        description: "Veuillez sélectionner une émotion ou décrire la musique souhaitée",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulation de génération de musique (dans une vraie application, appel API)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const emotionText = selectedEmotion ? 
        emotions.find(e => e.value === selectedEmotion)?.label || selectedEmotion : 
        'personnalisée';
      
      // Piste générée simulée
      const mockTrack: MusicTrack = {
        id: 'generated-' + Date.now(),
        title: `Mélodie ${emotionText}`,
        artist: 'IA Composer',
        duration: 180,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // URL de démonstration
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        emotion: selectedEmotion
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

  const playGeneratedTrack = () => {
    if (generatedTrack) {
      playTrack(generatedTrack);
    }
  };

  const saveToLibrary = () => {
    if (!generatedTrack) return;
    
    toast({
      title: "Sauvegardé",
      description: "La musique a été ajoutée à votre bibliothèque personnelle",
    });
    
    // Dans une vraie application, sauvegarde dans la bibliothèque de l'utilisateur via API
    setGeneratedTrack(null);
    setEmotion('');
    setPrompt('');
    setSelectedEmotion('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Créateur de musique IA</CardTitle>
        <CardDescription>
          Créez une musique personnalisée basée sur vos émotions ou une description textuelle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emotion-select">Choisissez une émotion</Label>
            <Select 
              value={selectedEmotion}
              onValueChange={setSelectedEmotion}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une émotion" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emotion) => (
                  <SelectItem key={emotion.value} value={emotion.value}>
                    {emotion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emotion-custom">Ou précisez une émotion</Label>
            <Input
              id="emotion-custom"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="Ex: Nostalgie, Espoir, Mystère..."
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
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{generatedTrack.title}</h4>
                  <p className="text-sm text-muted-foreground">Par {generatedTrack.artist}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  onClick={playGeneratedTrack}
                  size="sm"
                  className="flex-1"
                >
                  Écouter
                </Button>
                <Button 
                  variant="outline" 
                  onClick={saveToLibrary}
                  size="sm"
                  className="flex-1"
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
