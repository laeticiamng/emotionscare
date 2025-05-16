
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import CoachChat from '@/components/coach/CoachChat';
import { useCoach } from '@/contexts/CoachContext';

const B2BUserCoachChat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadMessages } = useCoach();
  
  // Check if we have an initial topic from navigation state
  const initialTopic = location.state?.initialTopic;
  
  // Map topics to initial questions
  const getInitialQuestion = (topic?: string): string | undefined => {
    if (!topic) return undefined;
    
    const topicMap: Record<string, string> = {
      'Productivité': "J'aimerais améliorer ma productivité au travail. Avez-vous des conseils ?",
      'Équilibre': "Comment puis-je mieux équilibrer ma vie professionnelle et personnelle ?",
      'Objectifs': "J'aimerais définir des objectifs professionnels clairs. Pouvez-vous m'aider ?",
      'Créativité': "Comment puis-je stimuler ma créativité au travail ?"
    };
    
    return topicMap[topic];
  };
  
  // Get the initial question if we have a topic
  const initialQuestion = getInitialQuestion(initialTopic);
  
  const handleBack = () => {
    navigate('/b2b/user/coach');
  };
  
  React.useEffect(() => {
    // Load initial messages if needed
    loadMessages();
  }, [loadMessages]);
  
  return (
    <div className="container mx-auto p-4 h-full flex flex-col">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Coach Professionnel</h1>
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

export default B2BUserCoachChat;
