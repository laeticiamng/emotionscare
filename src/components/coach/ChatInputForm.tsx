
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInputFormProps {
  userMessage: string;
  isLoading: boolean;
  onUserMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onRegenerate: () => void;
  hasMessages: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onTyping?: () => void;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  userMessage,
  isLoading,
  onUserMessageChange,
  onSendMessage,
  onRegenerate,
  hasMessages,
  onKeyDown,
  onTyping
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Auto-focus the input when the component mounts
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUserMessageChange(e.target.value);
    onTyping?.();
  };

  return (
    <div className="p-3 md:p-4 border-t">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input 
            ref={inputRef}
            value={userMessage}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder="Écrivez votre message..."
            className="flex-grow"
            disabled={isLoading}
            aria-label="Votre message"
          />
          <Button 
            onClick={onSendMessage} 
            disabled={isLoading || !userMessage.trim()} 
            aria-label="Envoyer le message"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </div>
        
        {hasMessages && (
          <Button 
            variant="outline" 
            size="sm" 
            className="self-end" 
            onClick={onRegenerate}
            disabled={isLoading}
            aria-label="Régénérer une réponse"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Régénérer une réponse
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInputForm;
