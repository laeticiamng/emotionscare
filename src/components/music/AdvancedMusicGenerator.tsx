import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Wand2, Download, Play, Pause, Volume2, Settings, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSunoMusic } from '@/hooks/api/useSunoMusic';

interface GenerationSettings {
  emotion: string;
  mood: string;
  genre: string;
  duration: number;
  intensity: number;
  instrumental: boolean;
  prompt: string;
  style: string;
  bpm: number;
  key: string;
}

interface EmotionalContext {
  valence: number;
  arousal: number;
  dominance: number;
  stress_level: number;
  energy_level: number;
}

const AdvancedMusicGenerator: React.FC = () => {
  const { toast } = useToast();
  const { generateMusic, isGenerating, generatedTracks } = useSunoMusic();
  
  const [settings, setSettings] = useState<GenerationSettings>({
    emotion: 'calm',
    mood: 'peaceful',
    genre: 'ambient',
    duration: 120,
    intensity: 0.5,
    instrumental: true,
    prompt: 'Une musique thérapeutique apaisante pour la relaxation',
    style: 'cinematic',
    bpm: 80,
    key: 'C major'
  });

  const [emotionalContext, setEmotionalContext] = useState<EmotionalContext>({
    valence: 0.5,
    arousal: 0.3,
    dominance: 0.4,
    stress_level: 0.6,
    energy_level: 0.4
  });

  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const emotions = [
    { value: 'calm', label: 'Calme', color: 'bg-blue-100 text-blue-800' },
    { value: 'energetic', label: 'Énergique', color: 'bg-orange-100 text-orange-800' },
    { value: 'melancholic', label: 'Mélancolique', color: 'bg-purple-100 text-purple-800' },
    { value: 'joyful', label: 'Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contemplative', label: 'Contemplatif', color: 'bg-green-100 text-green-800' },
    { value: 'focused', label: 'Concentré', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const genres = [
    'ambient', 'cinematic', 'electronic', 'classical', 'nature', 
    'binaural', 'meditation', 'jazz', 'world', 'ethereal'
  ];

  const styles = [
    'cinematic', 'minimal', 'orchestral', 'synthetic', 'organic',
    'dreamy', 'powerful', 'subtle', 'atmospheric', 'rhythmic'
  ];

  const keys = [
    'C major', 'D major', 'E major', 'F major', 'G major', 'A major', 'B major',
    'C minor', 'D minor', 'E minor', 'F minor', 'G minor', 'A minor', 'B minor'
  ];

  const updateSetting = useCallback((key: keyof GenerationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateEmotionalContext = useCallback((key: keyof EmotionalContext, value: number) => {
    setEmotionalContext(prev => ({ ...prev, [key]: value }));
  }, []);

  const generateEnhancedPrompt = useCallback(() => {
    const { emotion, mood, genre, style, bpm, key } = settings;
    const { valence, arousal, stress_level } = emotionalContext;

    let enhancedPrompt = settings.prompt;

    // Add emotional modifiers
    if (valence > 0.6) enhancedPrompt += ', bright and uplifting tones';
    else if (valence < 0.4) enhancedPrompt += ', gentle and soothing tones';

    if (arousal > 0.7) enhancedPrompt += ', energetic and dynamic';
    else if (arousal < 0.3) enhancedPrompt += ', calm and peaceful';

    if (stress_level > 0.6) enhancedPrompt += ', stress-relief qualities, healing frequencies';

    // Add musical characteristics
    enhancedPrompt += `, ${genre} genre, ${style} style, ${bpm} BPM, ${key}`;

    // Add therapeutic elements
    enhancedPrompt += ', therapeutic music, designed for emotional wellness';

    return enhancedPrompt;
  }, [settings, emotionalContext]);

  const handleGenerate = useCallback(async () => {
    try {
      const enhancedPrompt = generateEnhancedPrompt();
      
      const track = await generateMusic({
        prompt: enhancedPrompt,
        emotion: settings.emotion,
        mood: settings.mood,
        genre: settings.genre,
        instrumental: settings.instrumental,
        duration: settings.duration,
        intensity: settings.intensity
      });

      setCurrentTrack(track);
      
      toast({
        title: "Musique générée avec succès",
        description: `"${track.title}" est prête à être écoutée`,
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [generateEnhancedPrompt, generateMusic, settings, toast]);

  const handlePlay = useCallback(() => {
    if (!currentTrack?.audioUrl) return;

    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(currentTrack.audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('loadstart', () => setIsPlaying(true));
      setAudioElement(audio);
      audio.play();
    }
  }, [currentTrack, audioElement, isPlaying]);

  const handleDownload = useCallback(async () => {
    if (!currentTrack?.audioUrl) return;

    try {
      const response = await fetch(currentTrack.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTrack.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Téléchargement démarré",
        description: "La musique est en cours de téléchargement",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger la musique",
        variant: "destructive"
      });
    }
  }, [currentTrack, toast]);

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.remove();
      }
    };
  }, [audioElement]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            Générateur Musical Avancé
            <Badge variant="outline" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              IA SUNO
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="emotional">État Émotionnel</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Description de la musique</Label>
                    <Textarea
                      id="prompt"
                      value={settings.prompt}
                      onChange={(e) => updateSetting('prompt', e.target.value)}
                      placeholder="Décrivez la musique que vous souhaitez générer..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emotion">Émotion</Label>
                      <Select value={settings.emotion} onValueChange={(value) => updateSetting('emotion', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emotions.map(emotion => (
                            <SelectItem key={emotion.value} value={emotion.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${emotion.color.split(' ')[0]}`} />
                                {emotion.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="genre">Genre</Label>
                      <Select value={settings.genre} onValueChange={(value) => updateSetting('genre', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map(genre => (
                            <SelectItem key={genre} value={genre}>
                              {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Durée: {settings.duration}s</Label>
                    <Slider
                      value={[settings.duration]}
                      onValueChange={([value]) => updateSetting('duration', value)}
                      min={30}
                      max={300}
                      step={30}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Intensité: {Math.round(settings.intensity * 100)}%</Label>
                    <Slider
                      value={[settings.intensity]}
                      onValueChange={([value]) => updateSetting('intensity', value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="instrumental"
                      checked={settings.instrumental}
                      onCheckedChange={(checked) => updateSetting('instrumental', checked)}
                    />
                    <Label htmlFor="instrumental">Version instrumentale</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentTrack && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold">{currentTrack.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {currentTrack.artist} • {Math.round(currentTrack.duration)}s
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handlePlay}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              {isPlaying ? 'Pause' : 'Écouter'}
                            </Button>

                            <Button
                              onClick={handleDownload}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Télécharger
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary">{currentTrack.emotion}</Badge>
                            <Badge variant="secondary">{currentTrack.mood}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center gap-2"
                    size="lg"
                  >
                    <Wand2 className="h-5 w-5" />
                    {isGenerating ? 'Génération en cours...' : 'Générer la Musique'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emotional" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Valence (Positivité): {Math.round(emotionalContext.valence * 100)}%</Label>
                    <Slider
                      value={[emotionalContext.valence]}
                      onValueChange={([value]) => updateEmotionalContext('valence', value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Arousal (Éveil): {Math.round(emotionalContext.arousal * 100)}%</Label>
                    <Slider
                      value={[emotionalContext.arousal]}
                      onValueChange={([value]) => updateEmotionalContext('arousal', value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dominance (Contrôle): {Math.round(emotionalContext.dominance * 100)}%</Label>
                    <Slider
                      value={[emotionalContext.dominance]}
                      onValueChange={([value]) => updateEmotionalContext('dominance', value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Niveau de Stress: {Math.round(emotionalContext.stress_level * 100)}%</Label>
                    <Slider
                      value={[emotionalContext.stress_level]}
                      onValueChange={([value]) => updateEmotionalContext('stress_level', value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Niveau d'Énergie: {Math.round(emotionalContext.energy_level * 100)}%</Label>
                    <Slider
                      value={[emotionalContext.energy_level]}
                      onValueChange={([value]) => updateEmotionalContext('energy_level', value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <Card className="bg-primary/5">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">Recommandation IA</h4>
                      <p className="text-sm text-muted-foreground">
                        Basé sur votre profil émotionnel, nous recommandons une musique{' '}
                        {emotionalContext.stress_level > 0.6 ? 'apaisante et thérapeutique' : 
                         emotionalContext.energy_level > 0.7 ? 'énergisante et motivante' :
                         'équilibrée et harmonieuse'}.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select value={settings.style} onValueChange={(value) => updateSetting('style', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map(style => (
                        <SelectItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="key">Tonalité</Label>
                  <Select value={settings.key} onValueChange={(value) => updateSetting('key', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {keys.map(key => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>BPM: {settings.bpm}</Label>
                  <Slider
                    value={[settings.bpm]}
                    onValueChange={([value]) => updateSetting('bpm', value)}
                    min={40}
                    max={180}
                    step={10}
                  />
                </div>
              </div>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    Aperçu du Prompt Généré
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono bg-background p-3 rounded border">
                    {generateEnhancedPrompt()}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedMusicGenerator;