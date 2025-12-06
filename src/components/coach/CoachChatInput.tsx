
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Mic, Paperclip, Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CoachChatInputProps {
  onSendMessage: (text: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
}

const CoachChatInput: React.FC<CoachChatInputProps> = ({
  onSendMessage,
  isProcessing = false,
  placeholder = "Écrivez votre message...",
  className
}) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Quick responses
  const quickResponses = [
    "Oui", 
    "Non", 
    "Je ne suis pas sûr(e)", 
    "Pouvez-vous m'en dire plus ?", 
    "Merci !",
    "Comment puis-je me sentir mieux ?",
    "J'ai besoin de respirer"
  ];
  
  return (
    <div className="w-full border-t bg-background p-4">
      <div className="relative flex flex-col rounded-lg border bg-background">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isProcessing}
          className="min-h-[80px] w-full resize-none bg-transparent px-4 py-3 focus:outline-none"
          rows={2}
        />
        
        <div className="flex items-center justify-between p-2 px-3">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" type="button">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start" alignOffset={11} sideOffset={5}>
                <div className="grid grid-cols-2 gap-2">
                  {quickResponses.map((response, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        onSendMessage(response);
                        setMessage('');
                      }}
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon" 
              type="button"
              disabled={isProcessing}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              type="button"
              disabled={isProcessing}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            size="sm" 
            className="gap-1"
            onClick={handleSend}
            disabled={!message.trim() || isProcessing}
          >
            <span>Envoyer</span>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachChatInput;
