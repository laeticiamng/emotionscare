
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmotion, saveEmotion } from '@/lib/scanService';
import LiveVoiceScanner from './live/LiveVoiceScanner';
import TextEmotionScanner from './TextEmotionScanner';

const EmotionScanForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [textInput, setTextInput] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTextScan = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez entrer du texte pour analyser vos émotions",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const result = await analyzeEmotion(textInput);
      
      if (result) {
        setScanResult(result);
        
        // Save the emotion if user is logged in
        if (user) {
          await saveEmotion({
            ...result,
            user_id: user.id,
          });
        }
        
        toast({
          title: "Analyse terminée",
          description: `Émotion principale détectée : ${result.emotion}`,
        });
      }
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser vos émotions. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleVoiceScanComplete = async (result: EmotionResult) => {
    setScanResult(result);
    
    if (user) {
      try {
        await saveEmotion({
          ...result,
          user_id: user.id,
        });
        
        toast({
          title: "Analyse vocale terminée",
          description: `Émotion principale détectée : ${result.emotion}`,
        });
      } catch (error) {
        console.error("Error saving voice scan result:", error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Le résultat de l'analyse a été généré mais n'a pas pu être sauvegardé",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scanner d'Émotions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Analyse de texte</TabsTrigger>
            <TabsTrigger value="voice">Analyse vocale</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="text">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Décrivez comment vous vous sentez actuellement..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={5}
                  />
                </div>
                <Button 
                  onClick={handleTextScan} 
                  disabled={isScanning || !textInput.trim()}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    "Analyser mes émotions"
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="voice">
              <LiveVoiceScanner onScanComplete={handleVoiceScanComplete} />
            </TabsContent>
          </div>
        </Tabs>

        {scanResult && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Résultat de l'analyse</h3>
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium">Émotion principale:</p>
                <p className="text-xl">{scanResult.emotion}</p>
              </div>
              
              {scanResult.confidence && (
                <div>
                  <p className="text-sm font-medium">Niveau de confiance:</p>
                  <div className="w-full bg-muted h-2.5 rounded-full">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.round(scanResult.confidence * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1">{Math.round(scanResult.confidence * 100)}%</p>
                </div>
              )}
              
              {scanResult.feedback && (
                <div>
                  <p className="text-sm font-medium">Feedback:</p>
                  <p className="text-sm">{scanResult.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>
          Le scanner d'émotions utilise l'intelligence artificielle pour vous aider à identifier et comprendre vos états émotionnels.
        </p>
      </CardFooter>
    </Card>
  );
};

export default EmotionScanForm;
