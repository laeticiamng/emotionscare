
import React, { Suspense, lazy } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApiConnection } from '@/hooks/dashboard/useApiConnection';
import { useCoachDashboard } from '@/hooks/dashboard/useCoachDashboard';
import QuickSuggestions from './coach/QuickSuggestions';
import CoachRecommendations from './coach/CoachRecommendations';

// Import paresseux de l'interface de chat pour améliorer les performances initiales
const ChatInterface = lazy(() => import('@/components/chat/ChatInterface').then(module => ({ 
  default: module.default 
})));

interface CoachAssistantProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Coach Assistant AI Component
 * Affiche une interface de chat interactive avec OpenAI API (GPT-4)
 * Fournit des réponses contextualisées basées sur l'état émotionnel de l'utilisateur
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
            Coach IA {!apiReady && <span className="text-xs text-muted-foreground">(Limité)</span>}
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
        <div className="flex-1 min-h-[200px]">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }>
            <ChatInterface standalone={false} />
          </Suspense>
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
