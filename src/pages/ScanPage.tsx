
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mic, FileText, Brain, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const analyzeText = async () => {
    if (!textInput.trim()) {
      toast.error('Veuillez saisir un texte à analyser');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion-text', {
        body: { text: textInput }
      });

      if (error) throw error;
      setResult(data);
      toast.success('Analyse terminée !');
    } catch (error) {
      console.error('Erreur analyse:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    setIsRecording(true);
    toast.info('Enregistrement vocal en cours...');
    
    // Simulation d'enregistrement
    setTimeout(() => {
      setIsRecording(false);
      toast.success('Enregistrement terminé !');
    }, 3000);
  };

  const analyzeImage = async () => {
    toast.info('Analyse d\'image en développement...');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Scanner d'émotions</h1>
          <p className="text-muted-foreground">
            Analysez vos émotions à travers différents médias
          </p>
        </div>

        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voix
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Analyse de texte</CardTitle>
                <CardDescription>
                  Décrivez vos sentiments ou votre état d'esprit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Comment vous sentez-vous aujourd'hui ?"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={analyzeText} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Analyser
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Analyse vocale</CardTitle>
                <CardDescription>
                  Enregistrez votre voix pour analyser vos émotions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Button 
                    onClick={startVoiceRecording}
                    disabled={isRecording}
                    size="lg"
                    className="rounded-full h-20 w-20"
                  >
                    {isRecording ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {isRecording ? 'Enregistrement en cours...' : 'Cliquez pour commencer l\'enregistrement'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>Analyse d'image</CardTitle>
                <CardDescription>
                  Analysez vos expressions faciales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Button onClick={analyzeImage} size="lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Prendre une photo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Résultats de l'analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
