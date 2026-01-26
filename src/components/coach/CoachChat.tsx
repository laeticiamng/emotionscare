import React, { useEffect, useRef } from 'react';
import { CoachChatProps } from '@/types/coach';
import { useCoach } from '@/contexts/coach';
import CoachMessage from './CoachMessage';
import CoachChatInput from './CoachChatInput';
import CoachCharacter from './CoachCharacter';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

const CoachChat: React.FC<CoachChatProps> = ({
  initialMessage,
  showCharacter = true,
  showHeader = true,
  showInput = true,
}) => {
 const { messages, sendMessage, isProcessing } = useCoach();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    // Send initial message from coach if provided
    if (initialMessage && messages.length === 0) {
      // Add initial message from coach to the chat
      sendMessage(initialMessage, 'assistant');
    }
  }, [initialMessage, messages.length, sendMessage]);
  
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      // Send user message - sendMessage handles both user message and AI response
      await sendMessage(text);
    } catch (error) {
      logger.error('Failed to send message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      {showHeader && (
        <div className="border-b p-4 flex items-center gap-3">
          {showCharacter && <CoachCharacter size="sm" />}
          <div>
            <h3 className="font-medium">Coach IA</h3>
            <p className="text-xs text-muted-foreground">
              {isProcessing ? 'En train d\'écrire...' : 'En ligne'}
            </p>
          </div>
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
            <CoachCharacter size="lg" animated={true} />
            <h3 className="font-medium mt-4">Bonjour, je suis votre coach IA</h3>
            <p className="mt-1">Comment puis-je vous aider aujourd'hui ?</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <CoachMessage
                key={message.id || index}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            {isProcessing && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input area */}
      {showInput && (
        <CoachChatInput
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default CoachChat;
