
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';

interface CoachAssistantProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant Assistant Coach IA
 * Affiche une interface de chat interactive avec l'API OpenAI
 * Fournit des réponses contextualisées basées sur l'état émotionnel de l'utilisateur
 */
const CoachAssistant: React.FC<CoachAssistantProps> = ({ className, style }) => {
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
