
import { useState } from 'react';
import { ChatMessage, ChatConversation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface UseChatProcessingProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => Promise<string>;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

export function useChatProcessing({
  initialMessages = [],
  onSendMessage,
  onStartTyping,
  onStopTyping
}: UseChatProcessingProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Send a message and get a response
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (onStartTyping) onStartTyping();
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: content,
        text: content, // For compatibility with different message formats
        sender: "user",
        role: "user", // For compatibility
        timestamp: new Date().toISOString(),
        conversation_id: "current"
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get response from AI
      let responseContent = "I couldn't process your request.";
      
      if (onSendMessage) {
        responseContent = await onSendMessage(content);
      }
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: responseContent,
        text: responseContent,
        sender: "assistant",
        role: "assistant",
        timestamp: new Date().toISOString(),
        conversation_id: "current"
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err) {
      console.error('Error processing message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your message');
      
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive',
      });
      
    } finally {
      setLoading(false);
      if (onStopTyping) onStopTyping();
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages
  };
}

export default useChatProcessing;
