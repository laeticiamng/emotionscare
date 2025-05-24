
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Music, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GeneratedTrack {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  prompt: string;
  style: string;
}

const B2BUserMusicPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [musicStyle, setMusicStyle] = useState('relaxing');
  const [duration, setDuration] = useState([60]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const musicStyles = [
    { value: 'relaxing', label: '🧘 Relaxante' },
    { value: 'energetic', label: '⚡ Énergique' },
    { value: 'focus', label: '🎯 Concentration' },
    { value: 'ambient', label: '🌊 Ambiance' },
    { value: 'classical', label: '🎼 Classique' },
    { value: 'nature', label: '🌿 Nature' }
  ];

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt requis",
        description: "Veuillez décrire la musique que vous souhaitez générer",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          prompt: prompt.trim(),
          style: musicStyle,
          duration: duration[0],
          userId: user?.id
        }
      });

      if (error) throw error;

      const newTrack: GeneratedTrack = {
        id: `gen-${Date.now()}`,
        title: data.title || `Musique ${musicStyle}`,
        audioUrl: data.audioUrl,
        duration: data.duration || duration[0],
        prompt: prompt.trim(),
        style: musicStyle
      };

      setGeneratedTrack(newTrack);
      
      // Envoyer l'événement analytics
      await supabase.functions.invoke('analytics', {
        body: {
          event: 'musicGenerationFinished',
          properties: {
            style: musicStyle,
            duration: duration[0],
            prompt: prompt.trim()
          }
        }
      });

      toast({
        title: "Musique générée",
        description: "Votre piste musicale a été créée avec succès",
      });
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!generatedTrack) return;

    if (!audio) {
      const newAudio = new Audio(generatedTrack.audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = () => {
    if (!generatedTrack) return;
    
    const link = document.createElement('a');
    link.href = generatedTrack.audioUrl;
    link.download = `${generatedTrack.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Génération Musicale</h1>
          <p className="text-muted-foreground">
            Créez de la musique personnalisée avec l'IA
          </p>
        </div>
        <Music className="h-8 w-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de génération */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de génération</CardTitle>
            <CardDescription>
              Décrivez la musique que vous souhaitez créer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Description de la musique</Label>
              <Textarea
                id="prompt"
                placeholder="Ex: Une mélodie douce et apaisante pour la méditation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style musical</Label>
              <Select value={musicStyle} onValueChange={setMusicStyle} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un style" />
                </SelectTrigger>
                <SelectContent>
                  {musicStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durée: {duration[0]} secondes</Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={180}
                min={30}
                step={15}
                disabled={isGenerating}
              />
            </div>

            <Button 
              onClick={handleGenerateMusic}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-4 w-4" />
                  Générer la musique
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Lecteur et résultat */}
        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
            <CardDescription>
              Votre musique générée apparaîtra ici
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <Music className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Génération en cours...</p>
                  <p className="text-sm text-muted-foreground">Cela peut prendre jusqu'à 30 secondes</p>
                </div>
              </div>
            )}

            {!isGenerating && !generatedTrack && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                <Music className="h-12 w-12" />
                <p>Aucune musique générée</p>
                <p className="text-sm text-center">
                  Remplissez le formulaire et cliquez sur "Générer la musique" pour commencer
                </p>
              </div>
            )}

            {generatedTrack && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">{generatedTrack.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {generatedTrack.duration}s • Style: {musicStyles.find(s => s.value === generatedTrack.style)?.label}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Prompt:</span> {generatedTrack.prompt}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserMusicPage;
