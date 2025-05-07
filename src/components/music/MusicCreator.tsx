
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Music, MusicIcon, RefreshCw } from 'lucide-react';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';
import { Progress } from '@/components/ui/progress';

const MusicCreator = () => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [generatingLyrics, setGeneratingLyrics] = useState(false);
  const [lyricsPrompt, setLyricsPrompt] = useState('');
  
  const {
    isLoading,
    isProcessing,
    progress,
    generatedLyrics,
    handleGenerateLyrics,
    createMusicTrack
  } = useMusicalCreation();
  
  const handleGenerateLyricsClick = async () => {
    setGeneratingLyrics(true);
    const generated = await handleGenerateLyrics(lyricsPrompt);
    setLyrics(generated);
    setGeneratingLyrics(false);
  };
  
  const handleCreateMusicClick = async () => {
    if (!title || !prompt) return;
    
    await createMusicTrack({
      title,
      prompt,
      lyrics: instrumental ? undefined : lyrics,
      instrumental
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une composition</CardTitle>
        <CardDescription>
          Générez votre propre composition musicale personnalisée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title input */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la composition</Label>
          <Input
            id="title"
            placeholder="Ex: Ma méditation relaxante"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        {/* Prompt input */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Description musicale</Label>
          <Textarea
            id="prompt"
            placeholder="Ex: Une mélodie douce et apaisante avec des sons de nature"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Décrivez le style, l'ambiance et les instruments que vous souhaitez entendre.
          </p>
        </div>
        
        {/* Instrumental toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="instrumental">Mode instrumental</Label>
            <p className="text-xs text-muted-foreground">
              Activer pour créer une composition sans paroles
            </p>
          </div>
          <Switch
            id="instrumental"
            checked={instrumental}
            onCheckedChange={setInstrumental}
          />
        </div>
        
        {/* Lyrics section */}
        {!instrumental && (
          <div className="space-y-3 border rounded-lg p-4">
            <h3 className="font-medium">Paroles</h3>
            
            {/* Lyrics generator */}
            <div className="space-y-2">
              <Label htmlFor="lyrics-prompt">Générer des paroles</Label>
              <div className="flex space-x-2">
                <Input
                  id="lyrics-prompt"
                  placeholder="Ex: chanson positive sur la résilience"
                  value={lyricsPrompt}
                  onChange={(e) => setLyricsPrompt(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  onClick={handleGenerateLyricsClick}
                  disabled={!lyricsPrompt || generatingLyrics}
                >
                  {generatingLyrics ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Générer
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Lyrics input */}
            <div className="space-y-2">
              <Label htmlFor="lyrics">Paroles de la chanson</Label>
              <Textarea
                id="lyrics"
                placeholder="Entrez ou générez les paroles de votre composition"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={6}
              />
            </div>
          </div>
        )}
        
        {/* Creation progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Progression de la génération</Label>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateMusicClick} 
          disabled={isLoading || isProcessing || !title || !prompt}
          className="w-full"
        >
          {isLoading || isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isProcessing ? "Génération en cours..." : "Chargement..."}
            </>
          ) : (
            <>
              <MusicIcon className="mr-2 h-4 w-4" />
              Créer ma composition
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicCreator;
