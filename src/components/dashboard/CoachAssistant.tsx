
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useNavigate } from 'react-router-dom';
import { useApiConnection } from '@/hooks/dashboard/useApiConnection';
import { useCoachDashboard } from '@/hooks/dashboard/useCoachDashboard';
import QuickSuggestions from './coach/QuickSuggestions';
import CoachRecommendations from './coach/CoachRecommendations';

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
  const navigate = useNavigate();
  const { apiReady, apiCheckInProgress } = useApiConnection();
  const { 
    recommendations, 
    isProcessing, 
    quickSuggestions, 
    playRecommendedMusic, 
    handleRefreshRecommendations 
  } = useCoachDashboard();
  
  // Navigate to full coach chat
  const handleOpenFullChat = () => {
    navigate('/coach-chat');
  };

  return (
    <Card className={cn("flex flex-col premium-card h-full", className)} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xl heading-premium">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Coach IA {apiReady ? '' : '(Limité)'}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={handleOpenFullChat}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Ouvrir
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex-1">
          <ChatInterface standalone={false} />
        </div>
        
        <CoachRecommendations
          recommendations={recommendations}
          isProcessing={isProcessing}
          apiCheckInProgress={apiCheckInProgress}
          onRefresh={handleRefreshRecommendations}
          onPlayMusic={() => playRecommendedMusic('calm')}
        />
        
        <QuickSuggestions suggestions={quickSuggestions} />
      </CardContent>
    </Card>
  );
};

export default CoachAssistant;
