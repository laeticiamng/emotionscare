import { useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useCoach } from '@/hooks/coach/useCoach';
import { useActivity } from '@/hooks/useActivity';
import { useChatHistory } from '@/hooks/chat/useChatHistory';

interface CoachChatActionsProps {
  userMessage: string;
  messages: ChatMessage[];
  sendMessage: any;
  regenerateResponse: any;
  addMessage: (message: ChatMessage) => void;
  clearTypingIndicator: () => void;
  setUserMessage: (message: string) => void;
}

/**
 * Hook to manage coach chat specific actions (send, regenerate)
 */
export function useCoachChatActions({
  userMessage,
  messages,
  sendMessage,
  regenerateResponse,
  addMessage,
  clearTypingIndicator,
  setUserMessage
}: CoachChatActionsProps) {
  const { toast } = useToast();
  const { askQuestion } = useCoach();
  const { logActivity } = useActivity();
  const { activeConversationId, createConversation, saveMessages } = useChatHistory();
  
  // Handle sending a message
  const handleSendMessage = useCallback((messageText: string = userMessage) => {
    if (!messageText.trim()) return;
    
    const addUserMessage = (message: ChatMessage) => addMessage(message);
    const addBotMessage = (message: ChatMessage) => addMessage(message);
    
    // Handle conversation creation
    const ensureConversation = async () => {
      if (!activeConversationId) {
        try {
          await createConversation(messageText.substring(0, 50));
        } catch (error) {
          console.error('Error creating conversation:', error);
          toast({
            title: "Erreur",
            description: "Impossible de créer une nouvelle conversation.",
            variant: "destructive"
          });
        }
      }
    };
    
    // Log activity
    const logMessageActivity = () => {
      logActivity('coach_chat', { message: messageText });
    };
    
    // Process message
    sendMessage(
      messageText,
      addUserMessage,
      addBotMessage,
      async (text: string) => {
        try {
          // Ensure we have an active conversation and log activity
          await ensureConversation();
          logMessageActivity();
          
          // Get response from coach AI
          const response = await askQuestion(text);
          
          // Save messages after successful response
          if (activeConversationId) {
            const chatMessages = [...messages, 
              {
                id: Date.now().toString(),
                text: text,
                sender: 'user',
                timestamp: new Date(),
              },
              {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'bot',
                timestamp: new Date(),
              }
            ];
            
            saveMessages(chatMessages);
          }
          
          return response;
        } catch (error) {
          console.error('Error asking coach question:', error);
          toast({
            title: "Erreur",
            description: "Impossible de communiquer avec le coach IA. Veuillez réessayer.",
            variant: "destructive"
          });
          return "Je suis désolé, mais je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
        }
      },
      clearTypingIndicator
    );
    
    // Clear input
    setUserMessage('');
  }, [userMessage, sendMessage, addMessage, activeConversationId, createConversation, saveMessages, messages, logActivity, askQuestion, toast, clearTypingIndicator, setUserMessage]);
  
  // Handle regenerating a response
  const handleRegenerate = useCallback(() => {
    const addBotMessage = (message: ChatMessage) => addMessage(message);
    
    regenerateResponse(
      messages,
      addBotMessage,
      async (text: string) => {
        try {
          // Log activity
          logActivity('coach_regenerate', { originalMessage: text });
          
          // Get new response
          const response = await askQuestion(text);
          
          // Save regenerated message
          if (activeConversationId) {
            const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.sender === 'user');
            if (lastUserMessageIndex !== -1) {
              // Keep all messages up to the last user message, then add the new bot response
              const updatedMessages = messages.slice(0, messages.length - lastUserMessageIndex);
              updatedMessages.push({
                id: Date.now().toString(),
                text: response,
                sender: 'bot',
                timestamp: new Date(),
              });
              
              saveMessages(updatedMessages);
            }
          }
          
          toast({
            title: "Nouvelle réponse générée",
            description: "Une nouvelle réponse a été générée pour votre question."
          });
          
          return response;
        } catch (error) {
          console.error('Error regenerating response:', error);
          toast({
            title: "Erreur",
            description: "Impossible de générer une nouvelle réponse.",
            variant: "destructive"
          });
          throw error;
        }
      }
    );
  }, [regenerateResponse, messages, addMessage, activeConversationId, saveMessages, logActivity, askQuestion, toast]);
  
  return {
    handleSendMessage,
    handleRegenerate
  };
}
