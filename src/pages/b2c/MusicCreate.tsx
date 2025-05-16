
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Music, Wand2, Mic, Clock, Loader2 } from 'lucide-react';

const B2CMusicCreate: React.FC = () => {
  const [creationMethod, setCreationMethod] = useState<'prompt' | 'parameters'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<any>(null);
  const { toast } = useToast();
  
  // Parameters for advanced generation
  const [parameters, setParameters] = useState({
    emotion: 'calm',
    intensity: 50,
    tempo: 'medium',
    duration: 120, // seconds
    withVoice: false,
  });
  
  const handleEmotionChange = (emotion: string) => {
    setParameters(prev => ({ ...prev, emotion }));
  };
  
  const handleIntensityChange = (values: number[]) => {
    setParameters(prev => ({ ...prev, intensity: values[0] }));
  };
  
  const handleTempoChange = (tempo: string) => {
    setParameters(prev => ({ ...prev, tempo }));
  };
  
  const handleDurationChange = (values: number[]) => {
    setParameters(prev => ({ ...prev, duration: values[0] }));
  };
  
  const handleVoiceToggle = (checked: boolean) => {
    setParameters(prev => ({ ...prev, withVoice: checked }));
  };
  
  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated track
      const mockTrack = {
        id: 'gen-' + Date.now(),
        title: creationMethod === 'prompt' 
          ? 'Composition basée sur votre prompt' 
          : `${parameters.emotion.charAt(0).toUpperCase() + parameters.emotion.slice(1)} Melody`,
        artist: 'IA Composer',
        duration: parameters.duration,
        cover_url: 'https://via.placeholder.com/300',
      };
      
      setGeneratedTrack(mockTrack);
      
      toast({
        title: 'Musique générée avec succès',
        description: 'Votre nouvelle composition est prête à être écoutée.',
      });
    } catch (error) {
      console.error('Error generating music:', error);
      toast({
        title: 'Erreur lors de la génération',
        description: 'Un problème est survenu. Veuillez réessayer plus tard.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Création musicale</h1>
        <p className="text-muted-foreground">
          Créez votre propre musique adaptée à vos émotions et besoins
        </p>
      </div>
      
      <Tabs defaultValue={creationMethod} onValueChange={(value) => setCreationMethod(value as 'prompt' | 'parameters')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt">Par description</TabsTrigger>
          <TabsTrigger value="parameters">Par paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompt" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Décrivez la musique que vous souhaitez</CardTitle>
              <CardDescription>
                Utilisez des mots-clés comme "relaxant", "énergique", ou décrivez une ambiance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Par exemple : Une musique relaxante avec des sons de nature, idéale pour méditer..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {prompt.length} / 500 caractères
                </p>
                <Button 
                  onClick={handleGenerateMusic}
                  disabled={isGenerating || prompt.length < 10}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Générer la musique
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Example prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Une musique calme pour la méditation avec des nappes apaisantes et des instruments acoustiques",
              "Un morceau énergique pour le sport avec un rythme rapide et des percussions",
              "Une mélodie douce pour le sommeil avec des sons de nature en fond",
              "Une composition motivante pour le travail avec un rythme soutenu mais pas distrayant"
            ].map((example, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="h-auto py-3 px-4 justify-start text-left"
                onClick={() => setPrompt(example)}
              >
                <span className="truncate">{example}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="parameters" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de composition</CardTitle>
              <CardDescription>
                Ajustez les paramètres pour personnaliser votre musique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Émotion principale</Label>
                <Select value={parameters.emotion} onValueChange={handleEmotionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une émotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calme</SelectItem>
                    <SelectItem value="joy">Joie</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                    <SelectItem value="focus">Concentration</SelectItem>
                    <SelectItem value="melancholy">Mélancolie</SelectItem>
                    <SelectItem value="motivation">Motivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Intensité</Label>
                  <span className="text-sm text-muted-foreground">{parameters.intensity}%</span>
                </div>
                <Slider
                  value={[parameters.intensity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleIntensityChange}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Tempo</Label>
                <Select value={parameters.tempo} onValueChange={handleTempoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Lent</SelectItem>
                    <SelectItem value="medium">Modéré</SelectItem>
                    <SelectItem value="fast">Rapide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Durée</Label>
                  <span className="text-sm text-muted-foreground">{formatDuration(parameters.duration)}</span>
                </div>
                <Slider
                  value={[parameters.duration]}
                  min={60}
                  max={300}
                  step={30}
                  onValueChange={handleDurationChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice-toggle"
                  checked={parameters.withVoice}
                  onCheckedChange={handleVoiceToggle}
                />
                <Label htmlFor="voice-toggle">Inclure des voix</Label>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerateMusic}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Créer ma composition
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Generated music preview */}
      {generatedTrack && (
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle>Votre création musicale</CardTitle>
            <CardDescription>
              Écoutez votre composition générée par IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-40 h-40 bg-gradient-to-br from-primary/20 to-primary/50 rounded-lg flex items-center justify-center">
                <Music className="h-12 w-12 text-primary" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-medium">{generatedTrack.title}</h3>
                  <p className="text-sm text-muted-foreground">{generatedTrack.artist}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(generatedTrack.duration)}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Music className="h-4 w-4 mr-2" />
                    Écouter
                  </Button>
                  <Button variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Ajouter aux favoris
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default B2CMusicCreate;
