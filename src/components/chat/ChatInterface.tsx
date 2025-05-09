
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from '@/types';
import { useApiConnection } from '@/hooks/dashboard/useApiConnection';
import { Separator } from '@/components/ui/separator';
import { useActivity } from '@/hooks/useActivity';
import { safeOpen } from '@/lib/utils';

// Default welcome message
const DEFAULT_CHAT_MESSAGE = {
  id: 'welcome',
  text: 'Bonjour! Je suis votre coach IA. Comment puis-je vous aider aujourd\'hui?',
  sender: 'bot' as 'bot',
  timestamp: new Date(),
};

interface ChatInterfaceProps {
  standalone?: boolean;
  className?: string;
}

/**
 * Chat Interface Component
 * Affiche une interface de chat interactive avec OpenAI API (GPT-4)
 * Fournit des réponses contextualisées basées sur l'état émotionnel de l'utilisateur
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ standalone = true, className = '' }) => {
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([DEFAULT_CHAT_MESSAGE]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleSend } = useChat();
  const { apiReady, apiCheckInProgress } = useApiConnection();
  const { logActivity } = useActivity();
  
  // State for managing the chat session
  const [startChat, setStartChat] = useState<boolean | (() => void)>(false);
  
  // Function to handle the start of the chat
  const handleStartChat = () => {
    if (startChat) {
      safeOpen(startChat);
    }
  };

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!user?.id) {
      toast({
        title: "Non connecté",
        description: "Veuillez vous connecter pour envoyer un message.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    // Optimistically update the chat messages
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Log activity
      logActivity('coach_interaction', { type: 'question', content: message });
      
      // Send the message and get response
      const response = await handleSend(message);

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response?.text || "Je ne comprends pas votre demande. Pouvez-vous reformuler?",
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      // Revert the optimistic update on error
      setChatMessages(prevMessages => prevMessages.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="h-[300px] flex flex-col">
        <ScrollArea id="chat-container" className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={cn(
                  "rounded-lg px-3 py-2 text-sm max-w-[75%] shadow-sm",
                  msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  {msg.text}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {msg.sender === 'user' ? 'Vous' : 'Coach IA'} - {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start">
                <div className="rounded-lg px-3 py-2 text-sm max-w-[75%] shadow-sm bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {standalone && <Separator />}

      <CardFooter className="p-4">
        <div className="flex items-center space-x-4 w-full">
          <Input
            type="text"
            placeholder="Écrivez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            disabled={!apiReady || apiCheckInProgress}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!apiReady || apiCheckInProgress}
          >
            {apiCheckInProgress ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Envoyer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
