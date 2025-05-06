
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { triggerCoachEvent } from '@/lib/coachService';
import { useToast } from '@/hooks/use-toast';

interface CoachAssistantProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant Assistant Coach IA
 * Affiche une interface de chat interactive avec l'API OpenAI (GPT-4)
 * Fournit des réponses contextualisées basées sur l'état émotionnel de l'utilisateur
 */
const CoachAssistant: React.FC<CoachAssistantProps> = ({ className, style }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Vérifier la connexion API lors du chargement
  useEffect(() => {
    if (user?.id) {
      // Vérification de la connexion à l'API
      const checkAPIConnection = async () => {
        try {
          const testResult = await triggerCoachEvent('api_check', user.id);
          console.log("API OpenAI connection check:", testResult ? "OK" : "Error");
        } catch (error) {
          console.error("Error connecting to OpenAI API:", error);
          toast({
            title: "Erreur de connexion",
            description: "La connexion à l'API OpenAI n'a pas pu être établie. Certaines fonctionnalités peuvent être limitées.",
            variant: "destructive"
          });
        }
      };
      
      checkAPIConnection();
      
      // Nous utilisons setTimeout pour éviter de bloquer le rendu
      setTimeout(() => {
        triggerCoachEvent('daily_reminder', user.id);
      }, 1000);
    }
  }, [user?.id, toast]);

  return (
    <Card className={cn("flex flex-col premium-card", className)} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl heading-premium">
          <Sparkles className="h-5 w-5 text-primary" />
          Coach IA
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ChatInterface standalone={false} />
      </CardContent>
    </Card>
  );
};

export default CoachAssistant;
