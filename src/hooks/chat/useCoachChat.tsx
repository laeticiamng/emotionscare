
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useCoach } from '@/hooks/coach/useCoach';
import { useActivity } from '@/hooks/useActivity';
import { useChatHistory } from '@/hooks/chat/useChatHistory';

export function useCoachChat(initialQuestion?: string) {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const { toast } = useToast();
  const { askQuestion } = useCoach();
  const { logActivity } = useActivity();
  const {
    activeConversationId,
    createConversation,
    saveMessages,
  } = useChatHistory();
  
  // Save messages when they change
  useEffect(() => {
    if (messages.length > 1) { // Only save if there are user messages
      saveMessages(messages);
    }
  }, [messages, saveMessages]);
  
  // Process initial question if provided
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle user typing
  const handleUserTyping = useCallback(() => {
    // Show typing indicator
    if (!typingIndicator) {
      setTypingIndicator('Vous êtes en train d\'écrire...');
    }
    
    // Clear previous timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    // Set new timer to clear typing indicator after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      setTypingIndicator(null);
    }, 1500);
    
    setTypingTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [typingIndicator, typingTimer]);
  
  // Handle message sending
  const handleSendMessage = async (messageText: string = userMessage) => {
    if (!messageText.trim()) return;
    
    // Clear typing indicator
    if (typingTimer) clearTimeout(typingTimer);
    setTypingIndicator(null);
    
    // Add the user message
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessageObj]);
    setUserMessage('');
    setIsLoading(true);
    
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
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
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
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle regenerate response
  const handleRegenerate = async () => {
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (!lastUserMessage) return;
    
    setIsLoading(true);
    
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
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
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
      setIsLoading(false);
    }
  };
  
  // Handle cleanup of typing timer when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [typingTimer]);

  // Reset messages when starting a new conversation
  const resetMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    setMessages,
    userMessage,
    setUserMessage,
    isLoading,
    typingIndicator,
    handleSendMessage,
    handleKeyDown,
    handleRegenerate,
    handleUserTyping,
    resetMessages
  };
}
