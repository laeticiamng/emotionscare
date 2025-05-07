
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, SendHorizontal, Music, Brain, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMusic } from '@/contexts/MusicContext';
import { useCoach } from '@/hooks/coach/useCoach';

interface CoachAssistantProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Coach Assistant AI Component
 * Displays an interactive chat interface with OpenAI API (GPT-4)
 * Provides contextualized responses based on user emotional state
 */
const CoachAssistant: React.FC<CoachAssistantProps> = ({ className, style }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiReady, setApiReady] = useState(true);
  const { recommendations, triggerDailyReminder, isProcessing } = useCoach();
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([
    "Comment gérer mon stress?",
    "Recommande-moi une musique apaisante",
    "J'ai besoin d'une pause mentale"
  ]);
  
  // Function to play music recommended by coach
  const playRecommendedMusic = (emotion: string = 'calm') => {
    loadPlaylistForEmotion(emotion);
    openDrawer();
    toast({
      title: "Musique activée", 
      description: `Une playlist adaptée à votre humeur a été lancée.`
    });
  };

  // Check API connection on load
  useEffect(() => {
    if (user?.id) {
      // API connection check
      const checkAPIConnection = async () => {
        try {
          // Fix boolean check by calling an actual function instead
          const success = await checkConnectionStatus(user.id);
          console.log("OpenAI API connection check:", success ? "OK" : "Error");
          setApiReady(success);
          
          if (!success) {
            toast({
              title: "Connection Error",
              description: "Could not establish connection to OpenAI API. Some features may be limited.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error connecting to OpenAI API:", error);
          setApiReady(false);
          toast({
            title: "Connection Error",
            description: "Could not establish connection to OpenAI API. Some features may be limited.",
            variant: "destructive"
          });
        }
      };
      
      checkAPIConnection();
      
      // We use setTimeout to avoid blocking the render
      setTimeout(() => {
        triggerDailyReminder();
      }, 1000);
    }
  }, [user?.id, toast, triggerDailyReminder]);
  
  // Function to check the API connection status
  const checkConnectionStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-connection', {
        body: { userId }
      });
      
      return data?.connected === true;
    } catch (error) {
      console.error("Error checking API connection status:", error);
      return false;
    }
  };

  // Function to refresh recommendations
  const handleRefreshRecommendations = () => {
    if (user?.id) {
      triggerDailyReminder();
      toast({
        title: "Recommandations actualisées",
        description: "Nouvelles recommandations personnalisées"
      });
    }
  };

  return (
    <Card className={cn("flex flex-col premium-card h-full", className)} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl heading-premium">
          <Sparkles className="h-5 w-5 text-primary" />
          Coach IA {apiReady ? '' : '(Limité)'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex-1">
          <ChatInterface standalone={false} />
        </div>
        
        {recommendations.length > 0 && (
          <div className="px-4 pb-4">
            <div className="bg-muted/30 rounded-lg p-3 mt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Recommandations IA
                </h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  disabled={isProcessing} 
                  onClick={handleRefreshRecommendations}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {recommendations.slice(0, 1).map((rec, i) => (
                  <div key={i} className="text-xs flex gap-2 items-start">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs h-7 mt-1"
                  onClick={() => playRecommendedMusic('calm')}
                >
                  <Music className="h-3 w-3 mr-1" />
                  Écouter musique recommandée
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-3 border-t">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  // Fixed: Using HTMLInputElement to ensure click() method is available
                  // and adding null checks with optional chaining
                  const input = document.querySelector('input[placeholder*="message"]') as HTMLInputElement;
                  const button = input?.closest('form')?.querySelector('button[type="submit"]') as HTMLButtonElement;
                  
                  if (input && button) {
                    input.value = suggestion;
                    button.click();
                  } else {
                    toast({
                      title: "Question posée",
                      description: suggestion
                    });
                  }
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachAssistant;
