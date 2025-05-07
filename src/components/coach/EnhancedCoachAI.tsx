
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Music, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { useCoach } from '@/hooks/coach/useCoach';
import { toast } from '@/hooks/use-toast';

const EnhancedCoachAI: React.FC = () => {
  const { user } = useAuth();
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { 
    recommendations, 
    lastEmotion, 
    triggerDailyReminder, 
    isProcessing,
    askQuestion
  } = useCoach();
  
  const [customQuestion, setCustomQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      triggerDailyReminder();
    }
  }, [user?.id, triggerDailyReminder]);
  
  const handleRefresh = () => {
    triggerDailyReminder();
    toast({
      title: "Coach IA",
      description: "Actualisation des recommandations en cours..."
    });
  };
  
  const handlePlayMusic = (emotion: string = lastEmotion || 'calm') => {
    loadPlaylistForEmotion(emotion);
    openDrawer();
    toast({
      title: "Musique adaptée",
      description: `Une playlist adaptée à votre humeur a été lancée.`
    });
  };
  
  const handleAskQuestion = async () => {
    if (!customQuestion.trim()) return;
    
    setIsThinking(true);
    try {
      const result = await askQuestion(customQuestion);
      setResponse(result);
    } catch (error) {
      console.error('Error asking AI question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir une réponse du coach IA",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
      setCustomQuestion('');
    }
  };
  
  return (
    <Card className="shadow-lg border-t-4 border-t-primary h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Coach IA Personnalisé</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isProcessing || isThinking}
          >
            <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Emotional state */}
        {lastEmotion && (
          <div className="mb-4 p-3 bg-muted/40 rounded-lg">
            <p className="text-sm font-medium">État émotionnel détecté: <span className="text-primary">{lastEmotion}</span></p>
          </div>
        )}
        
        {/* AI recommendations */}
        <div className="mb-4 flex-1">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Recommandations personnalisées
          </h3>
          
          {recommendations.length > 0 ? (
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-muted/30 rounded-md text-sm hover:bg-muted/50 transition-colors"
                >
                  {rec}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                  <p>Génération de recommandations en cours...</p>
                </div>
              ) : (
                <p>Aucune recommandation disponible</p>
              )}
            </div>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handlePlayMusic()}
          >
            <Music className="h-4 w-4 mr-2" />
            Musique adaptée
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/scan'}
          >
            <Brain className="h-4 w-4 mr-2" />
            Scan émotionnel
          </Button>
        </div>
        
        {/* Ask question */}
        <div className="mt-auto">
          <div className="relative">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Posez une question à votre coach..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              disabled={isThinking}
            />
            <Button 
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleAskQuestion}
              disabled={!customQuestion.trim() || isThinking}
            >
              {isThinking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {response && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-md text-sm">
              <p>{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoachAI;
