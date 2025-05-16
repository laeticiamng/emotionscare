
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CoachMessage } from './CoachContextProvider';

export interface UseCoachHandlersProps {
  setIsProcessing: (processing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<CoachMessage[]>>;
  currentEmotion: string | null;
}

export function useCoachHandlers({
  setIsProcessing,
  setMessages,
  currentEmotion
}: UseCoachHandlersProps) {
  // Function to simulate AI response
  const processUserMessage = useCallback((
    content: string, 
    setMessages: React.Dispatch<React.SetStateAction<CoachMessage[]>>
  ) => {
    // Simulate AI processing time
    setTimeout(() => {
      // Generate coach response based on user input
      let response = '';
      
      // Simple rule-based responses
      const lowerContent = content.toLowerCase();
      
      if (lowerContent.includes('bonjour') || lowerContent.includes('salut') || lowerContent.includes('hello')) {
        response = "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
      }
      else if (lowerContent.includes('merci')) {
        response = "C'est avec plaisir ! N'hésitez pas si vous avez d'autres questions.";
      }
      else if (lowerContent.includes('stress') || lowerContent.includes('stressé') || lowerContent.includes('anxiété')) {
        response = "Je comprends que vous ressentiez du stress. Avez-vous essayé des exercices de respiration profonde ? Je peux vous guider à travers un exercice simple qui pourrait vous aider à vous détendre.";
      }
      else if (lowerContent.includes('triste') || lowerContent.includes('déprimé') || lowerContent.includes('mal')) {
        response = "Je suis désolé d'entendre que vous vous sentez triste. Parfois, parler de ce qui vous préoccupe peut aider. Voudriez-vous me dire ce qui vous fait vous sentir ainsi ?";
      }
      else if (lowerContent.includes('heureux') || lowerContent.includes('content') || lowerContent.includes('bien')) {
        response = "Je suis ravi d'entendre que vous vous sentez bien ! C'est important de reconnaître ces moments positifs. Y a-t-il quelque chose en particulier qui contribue à votre bonne humeur ?";
      }
      else if (lowerContent.includes('dormir') || lowerContent.includes('sommeil') || lowerContent.includes('insomnie')) {
        response = "Les problèmes de sommeil peuvent affecter considérablement notre bien-être émotionnel. Avez-vous essayé d'établir une routine régulière de sommeil ? Je peux vous suggérer quelques techniques de relaxation qui pourraient vous aider à mieux dormir.";
      }
      else if (lowerContent.includes('méditer') || lowerContent.includes('méditation')) {
        response = "La méditation est une excellente pratique pour la santé mentale. Aimeriez-vous que je vous guide à travers un exercice de méditation simple ?";
      }
      else if (currentEmotion) {
        response = `J'ai remarqué que vous semblez vous sentir ${currentEmotion}. Comment puis-je vous aider à gérer cette émotion ?`;
      }
      else {
        response = "Merci de partager cela avec moi. Comment puis-je vous aider davantage aujourd'hui ?";
      }
      
      // Add coach message
      const coachMessage: CoachMessage = {
        id: uuidv4(),
        content: response,
        sender: 'coach',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages(prevMessages => [...prevMessages, coachMessage]);
      setIsProcessing(false);
    }, 1500); // Simulate AI processing time
  }, [currentEmotion, setIsProcessing]);
  
  return { processUserMessage };
}
