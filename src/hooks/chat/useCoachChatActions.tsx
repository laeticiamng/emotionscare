
import { useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useCoach } from '@/hooks/coach/useCoach';
import { useActivity } from '@/hooks/useActivity';
import { useChatHistory } from '@/hooks/chat/useChatHistory';

/**
 * Hook to manage chat actions (send, regenerate)
 */
export function useCoachChatActions() {
  const { toast } = useToast();
  const { askQuestion } = useCoach();
  const { logActivity } = useActivity();
  const { activeConversationId, createConversation } = useChatHistory();
  
  // Handle message sending
  const sendMessage = useCallback(async (
    messageText: string,
    addUserMessage: (message: ChatMessage) => void,
    addBotMessage: (message: ChatMessage) => void,
    setLoading: (isLoading: boolean) => void,
    clearTypingIndicator: () => void
  ) => {
    if (!messageText.trim()) return;
    
    // Clear typing indicator
    clearTypingIndicator();
    
    // Add the user message
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    addUserMessage(userMessageObj);
    setLoading(true);
    
    try {
      // Log activity
      logActivity('coach_chat', { message: messageText });
      
      // Ensure we have an active conversation
      if (!activeConversationId) {
        await createConversation(messageText.substring(0, 50));
      }
      
      // Get a response from the coach AI
      const response = await askQuestion(messageText);
      
      // Add the coach's response
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      addBotMessage(botResponse);
    } catch (error) {
      console.error('Error sending message to coach:', error);
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec le coach IA. Veuillez réessayer.",
        variant: "destructive"
      });
      
      // Add an error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Je suis désolé, mais je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      addBotMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeConversationId, askQuestion, createConversation, logActivity, toast]);
  
  // Handle regenerate response
  const regenerateResponse = useCallback(async (
    messages: ChatMessage[],
    addBotMessage: (message: ChatMessage) => void,
    setLoading: (isLoading: boolean) => void
  ) => {
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (!lastUserMessage) return;
    
    setLoading(true);
    
    try {
      // Log activity
      logActivity('coach_regenerate', { originalMessageId: lastUserMessage.id });
      
      // Get a new response
      const response = await askQuestion(lastUserMessage.text);
      
      // Add the new response
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      addBotMessage(botResponse);
      
      toast({
        title: "Nouvelle réponse générée",
        description: "Une nouvelle réponse a été générée pour votre question."
      });
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer une nouvelle réponse.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [askQuestion, logActivity, toast]);
  
  return {
    sendMessage,
    regenerateResponse
  };
}
