
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { triggerCoachEvent } from '@/lib/coachService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  // Check API connection on load
  useEffect(() => {
    if (user?.id) {
      // API connection check
      const checkAPIConnection = async () => {
        try {
          const result = await triggerCoachEvent('api_check', user.id);
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
        triggerCoachEvent('daily_reminder', user.id);
      }, 1000);
    }
  }, [user?.id, toast]);
  
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

  return (
    <Card className={cn("flex flex-col premium-card", className)} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl heading-premium">
          <Sparkles className="h-5 w-5 text-primary" />
          Coach IA {apiReady ? '' : '(Limité)'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ChatInterface standalone={false} />
      </CardContent>
    </Card>
  );
};

export default CoachAssistant;
