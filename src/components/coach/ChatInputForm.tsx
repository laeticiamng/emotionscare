
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RefreshCw } from 'lucide-react';

interface ChatInputFormProps {
  userMessage: string;
  isLoading: boolean;
  onUserMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onRegenerate: () => void;
  hasMessages: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  userMessage,
  isLoading,
  onUserMessageChange,
  onSendMessage,
  onRegenerate,
  hasMessages,
  onKeyDown
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="p-4 border-t">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input 
            ref={inputRef}
            value={userMessage}
            onChange={(e) => onUserMessageChange(e.target.value)}
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
