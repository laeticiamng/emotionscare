import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Sparkles, ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useSunoMusic } from '@/hooks/api/useSunoMusic';

export default function MusicGeneratePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateMusic, isGenerating } = useSunoMusic();
  
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('ambient');
  const [mood, setMood] = useState('calm');
  const [duration, setDuration] = useState([30]);
  const [generatedTrack, setGeneratedTrack] = useState<any>(null);

  const genres = [
    { value: 'ambient', label: 'Ambient' },
    { value: 'classical', label: 'Classique' },
    { value: 'electronic', label: 'Électronique' },
    { value: 'piano', label: 'Piano' },
    { value: 'nature', label: 'Sons de la nature' },
    { value: 'lofi', label: 'Lo-Fi' },
  ];

  const moods = [
    { value: 'calm', label: 'Calme' },
    { value: 'energetic', label: 'Énergique' },
    { value: 'happy', label: 'Joyeux' },
    { value: 'melancholic', label: 'Mélancolique' },
    { value: 'meditative', label: 'Méditatif' },
    { value: 'uplifting', label: 'Stimulant' },
  ];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Description requise',
        description: 'Veuillez décrire le type de musique que vous souhaitez générer',
        variant: 'destructive',
      });
      return;
    }

    try {
      const fullPrompt = `${genre} music, ${mood} mood, ${prompt}`;
      const result = await generateMusic({
        prompt: fullPrompt,
        make_instrumental: false,
        tags: `${genre}, ${mood}`,
        title: 'Composition personnalisée',
      });

      if (result.success && result.data) {
        setGeneratedTrack(result.data);
        toast({
          title: 'Musique générée',
          description: 'Votre composition est prête à être écoutée',
        });
      } else {
        throw new Error(result.error || 'Échec de la génération');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération',
        variant: 'destructive',
      });
    }
  }, [prompt, genre, mood, duration, generateMusic, toast]);

  const handleReset = () => {
    setPrompt('');
    setGenre('ambient');
    setMood('calm');
    setDuration([30]);
    setGeneratedTrack(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Générateur de Musique</h1>
              <p className="text-muted-foreground">
                Créez votre musique personnalisée avec l'IA
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Paramètres de génération
              </CardTitle>
              <CardDescription>
                Décrivez la musique que vous souhaitez créer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Description</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Une mélodie apaisante avec des sons de forêt..."
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                  disabled={isGenerating}
                />
                <p className="text-xs text-muted-foreground">
                  {prompt.length}/500 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre musical</Label>
                <Select value={genre} onValueChange={setGenre} disabled={isGenerating}>
                  <SelectTrigger id="genre">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Ambiance</Label>
                <Select value={mood} onValueChange={setMood} disabled={isGenerating}>
                  <SelectTrigger id="mood">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Durée: {duration[0]}s</Label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={15}
                  max={180}
                  step={15}
                  disabled={isGenerating}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Générer la musique
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Résultat
              </CardTitle>
              <CardDescription>
                {generatedTrack ? 'Votre composition est prête' : 'En attente de génération'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedTrack ? (
                <>
                  <div className="rounded-lg border p-4 space-y-3">
                    <h3 className="font-semibold">{generatedTrack.title || 'Composition générée'}</h3>
                    {generatedTrack.audio_url && (
                      <audio
                        controls
                        className="w-full"
                        src={generatedTrack.audio_url}
                      >
                        Votre navigateur ne supporte pas l'élément audio.
                      </audio>
                    )}
                    {generatedTrack.image_url && (
                      <img
                        src={generatedTrack.image_url}
                        alt="Cover"
                        className="w-full rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      Nouvelle composition
                    </Button>
                    <Button onClick={() => navigate('/app/music')} className="flex-1">
                      Voir ma bibliothèque
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Music className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Configurez les paramètres et générez votre musique
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
