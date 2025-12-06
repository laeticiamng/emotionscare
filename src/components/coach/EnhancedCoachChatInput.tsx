
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, Mic, Paperclip, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedCoachChatInputProps {
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

const EnhancedCoachChatInput: React.FC<EnhancedCoachChatInputProps> = ({
  onSendMessage,
  isProcessing,
  placeholder = "Écrivez votre message...",
  className,
  maxLength = 1000,
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set new height based on scrollHeight (with max height)
    const newHeight = Math.min(textarea.scrollHeight, 150);
    textarea.style.height = `${newHeight}px`;
  }, [input]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isProcessing) return;
    
    if (trimmedInput.length > maxLength) {
      toast({
        title: "Message trop long",
        description: `Votre message dépasse la limite de ${maxLength} caractères.`,
        variant: "destructive",
      });
      return;
    }
    
    onSendMessage(trimmedInput);
    setInput('');
    
    // Give feedback
    toast({
      title: "Message envoyé",
      description: "Votre message a été transmis au coach",
      duration: 1500,
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Voice input function (would be implemented with Web Speech API)
  const handleVoiceInput = () => {
    toast({
      title: "Dictée vocale",
      description: "Fonctionnalité bientôt disponible !",
      variant: "default",
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("border-t p-3", className)}>
      <div className={cn(
        "flex items-end gap-1.5 rounded-lg border transition-colors",
        isFocused ? "border-primary/50 ring-1 ring-primary/20" : "",
        isProcessing ? "opacity-70" : ""
      )}>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 flex-shrink-0 mt-1 mb-1 ml-1"
          disabled={isProcessing}
          onClick={handleVoiceInput}
          aria-label="Dictée vocale"
        >
          <Mic className="h-5 w-5" />
        </Button>
        
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isProcessing}
          className="flex-1 min-h-[40px] h-10 py-2 border-0 focus-visible:ring-0 resize-none"
          maxLength={maxLength}
          aria-label="Message au coach"
        />
        
        <div className="flex items-center gap-1 mr-1 mb-1">
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            disabled={!input.trim() || isProcessing}
            aria-label="Envoyer le message"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </div>
      </div>
      
      {/* Character counter */}
      <div className="flex justify-end mt-1 text-xs text-muted-foreground">
        <span className={input.length > maxLength ? "text-destructive" : ""}>
          {input.length}/{maxLength}
        </span>
      </div>
    </form>
  );
};

export default EnhancedCoachChatInput;
