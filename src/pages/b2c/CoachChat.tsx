
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import CoachChat from '@/components/coach/CoachChat';
import { useCoach } from '@/contexts/CoachContext';

const B2CCoachChat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearMessages, loadMessages } = useCoach();
  
  // Check if we have an initial topic from navigation state
  const initialTopic = location.state?.initialTopic;
  
  // Map topics to initial questions
  const getInitialQuestion = (topic?: string): string | undefined => {
    if (!topic) return undefined;
    
    const topicMap: Record<string, string> = {
      'Parler': "Bonjour, j'aimerais discuter de quelque chose qui me préoccupe.",
      'Emotions': "J'aimerais explorer et mieux comprendre mes émotions actuelles.",
      'Concentration': "J'ai des difficultés à me concentrer. Pouvez-vous m'aider ?",
      'Inspiration': "J'ai besoin d'inspiration et de nouvelles perspectives.",
      'Relaxation': "J'aimerais me détendre. Pouvez-vous me suggérer des exercices ?"
    };
    
    return topicMap[topic];
  };
  
  // Get the initial question if we have a topic
  const initialQuestion = getInitialQuestion(initialTopic);
  
  const handleBack = () => {
    navigate('/coach');
  };
  
  React.useEffect(() => {
    // Load initial messages if needed
    loadMessages();
    
    return () => {
      // Optionally clear messages when leaving
      // clearMessages();
    };
  }, [loadMessages]);
  
  return (
    <div className="container mx-auto p-4 h-full flex flex-col">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Coach IA</h1>
      </div>
      
      <div className="flex-grow relative min-h-[70vh]">
        <CoachChat 
          initialQuestion={initialQuestion}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default B2CCoachChat;
