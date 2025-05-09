import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Brain, Smile, Mic, Activity, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { enhancedEmotionalAnalysis } from '@/lib/scan/enhancedAnalyzeService';
import EmojiSelector from './EmojiSelector';
import AudioRecorder from './AudioRecorder';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedMusicVisualizer from '../music/EnhancedMusicVisualizer';
import { EnhancedEmotionResult } from '@/types/emotion';

interface EnhancedEmotionAnalysisProps {
  onAnalysisComplete?: (result: EnhancedEmotionResult) => void;
}

const EnhancedEmotionAnalysis: React.FC<EnhancedEmotionAnalysisProps> = ({ 
  onAnalysisComplete 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('text');
  const [text, setText] = useState<string>('');
  const [emojis, setEmojis] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<EnhancedEmotionResult | null>(null);
  
  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => prev + emoji);
  };
  
  const handleClearEmojis = () => {
    setEmojis('');
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour utiliser cette fonctionnalité.",
        variant: "destructive"
      });
      return;
    }
    
    if (!emojis && !text && !audioUrl) {
      toast({
        title: "Entrée requise",
        description: "Veuillez fournir au moins des emojis, du texte ou un enregistrement audio.",
        variant: "destructive"
      });
      return;
    }
    
    setAnalyzing(true);
    
    try {
      // Récupérer le contexte utilisateur pour une analyse plus précise
      const userContext = {
        recent_emotions: "neutral, calm", // Exemple - à remplacer par de vraies données
        emotional_trend: "stable",
        job_role: "médecin"
      };
      
      const analysisResult = await enhancedEmotionalAnalysis(
        user.id,
        text,
        emojis,
        audioUrl || undefined,
        userContext
      );
      
      setResult(analysisResult);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
      
      toast({
        title: "Analyse complétée",
        description: `État émotionnel détecté : ${analysisResult.emotion}`,
      });
    } catch (error) {
      console.error('Error during enhanced emotional analysis:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setText('');
    setEmojis('');
    setAudioUrl(null);
    setActiveTab('text');
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Analyse émotionnelle avancée
              </CardTitle>
              <CardDescription>
                Utilisez l'IA pour analyser votre état émotionnel et obtenir des recommandations personnalisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="text" className="flex items-center gap-1">
                    <Smile className="h-4 w-4" />
                    Texte & Emojis
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center gap-1">
                    <Mic className="h-4 w-4" />
                    Audio
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Avancé
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Comment vous sentez-vous ?</h3>
                    <Textarea 
                      placeholder="Décrivez votre état émotionnel actuel..."
                      value={text}
                      onChange={handleTextChange}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sélectionnez des emojis représentatifs</h3>
                    <EmojiSelector 
                      emojis={emojis}
                      onEmojiClick={handleEmojiClick}
                      onClear={handleClearEmojis}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="audio" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Enregistrez votre voix</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Exprimez vocalement votre état émotionnel pour une analyse plus précise
                    </p>
                    <AudioRecorder 
                      audioUrl={audioUrl} 
                      setAudioUrl={setAudioUrl}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Options d'analyse avancées</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Paramètres supplémentaires pour une analyse plus précise (bientôt disponible)
                    </p>
                    
                    <div className="bg-muted/30 rounded-md p-4 text-center">
                      <Sparkles className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Fonctionnalités avancées à venir</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Analyse contextuelle, tendances émotionnelles, et plus encore
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full"
                  disabled={analyzing || (!text && !emojis && !audioUrl)}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyser mon état émotionnel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Résultat de l'analyse
            </CardTitle>
            <CardDescription>
              Analyse IA de votre état émotionnel avec un niveau de confiance de {(result.confidence * 100).toFixed(0)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">État émotionnel: <span className="text-primary">{result.emotion}</span></h3>
                <p className="text-muted-foreground">{result.feedback}</p>
              </div>
              
              <div className="w-full md:w-1/3 h-[120px]">
                <EnhancedMusicVisualizer 
                  emotion={result.emotion}
                  height={100}
                  showControls={false}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Recommandations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="bg-muted/30 p-3 rounded-md flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={handleReset}>
                Nouvelle analyse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedEmotionAnalysis;
