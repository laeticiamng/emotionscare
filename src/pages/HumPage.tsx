
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Play, Pause, Music, Loader, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const HumPage = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  
  const handleRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Enregistrement démarré",
        description: "Fredonnez votre mélodie..."
      });
    } else {
      toast({
        title: "Enregistrement terminé",
        description: "Traitement de votre mélodie en cours..."
      });
      
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setGeneratedAudio("https://example.com/demo-audio.mp3");
        toast({
          title: "Génération terminée",
          description: "Votre mélodie a été transformée avec succès!"
        });
      }, 3000);
    }
  };
  
  const handleGenerate = () => {
    if (text.trim() === '') {
      toast({
        title: "Texte requis",
        description: "Veuillez entrer une description pour générer une mélodie",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Génération en cours",
      description: "Création de votre mélodie à partir du texte..."
    });
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setGeneratedAudio("https://example.com/demo-audio.mp3");
      toast({
        title: "Génération terminée",
        description: "Votre mélodie a été créée avec succès!"
      });
    }, 3000);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">HUM</h1>
        <p className="text-muted-foreground mb-6">Transformez votre voix en mélodies uniques</p>
        
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="voice">Fredonnement vocal</TabsTrigger>
            <TabsTrigger value="text">Génération par texte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Enregistrez votre mélodie</CardTitle>
                <CardDescription>Fredonnez ou chantez un air pour le transformer en musique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center py-12">
                  <Button
                    onClick={handleRecord}
                    disabled={isProcessing}
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="h-24 w-24 rounded-full"
                  >
                    {isProcessing ? (
                      <Loader className="h-12 w-12 animate-spin" />
                    ) : (
                      <Mic className="h-12 w-12" />
                    )}
                    <span className="sr-only">
                      {isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
                    </span>
                  </Button>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  {isRecording ? (
                    <p>Enregistrement en cours... Cliquez à nouveau pour arrêter</p>
                  ) : isProcessing ? (
                    <p>Traitement de votre mélodie...</p>
                  ) : (
                    <p>Cliquez sur le microphone pour commencer à enregistrer</p>
                  )}
                </div>
                
                {generatedAudio && (
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-medium">Votre mélodie générée</h3>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-full flex items-center justify-between space-x-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={togglePlay}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <div className="w-full">
                          <Slider
                            defaultValue={[0]}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="text-sm tabular-nums text-muted-foreground">
                          0:00
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button size="sm">
                          <Music className="h-4 w-4 mr-2" />
                          Ouvrir dans l'éditeur
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Générer par description</CardTitle>
                <CardDescription>Décrivez la mélodie que vous souhaitez créer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Une mélodie douce et relaxante avec des sons de piano et de violon..."
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      Générer la mélodie
                    </>
                  )}
                </Button>
                
                {generatedAudio && (
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-medium">Votre mélodie générée</h3>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-full flex items-center justify-between space-x-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={togglePlay}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <div className="w-full">
                          <Slider
                            defaultValue={[0]}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="text-sm tabular-nums text-muted-foreground">
                          0:00
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button size="sm">
                          <Music className="h-4 w-4 mr-2" />
                          Ouvrir dans l'éditeur
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default HumPage;
