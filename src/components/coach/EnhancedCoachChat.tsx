
import React, { useEffect, useState } from 'react';
import { useCoach } from '@/contexts/coach/CoachContextProvider';
import { ChatMessage } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import CoachMessage from './CoachMessage';
import QuickSuggestions from '@/components/dashboard/coach/QuickSuggestions';

interface EnhancedCoachChatProps {
  initialMessage?: string;
  showHeader?: boolean;
  showCharacter?: boolean;
  characterSize?: 'sm' | 'md' | 'lg';
  className?: string;
  maxHeight?: string;
}

const EnhancedCoachChat: React.FC<EnhancedCoachChatProps> = ({
  initialMessage,
  showHeader = true,
  showCharacter = false,
  characterSize = 'md',
  className = '',
  maxHeight = '600px'
}) => {
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const coach = useCoach();
  
  // Check if these properties exist in the coach context before using them
  const conversations = coach.conversations || [];
  const currentConversation = coach.currentConversation || null;
  
  // Quick suggestions based on emotional state
  const suggestions = [
    "Comment puis-je gérer mon stress ?",
    "Conseils pour mieux dormir",
    "Je me sens démotivé",
    "Exercices de respiration"
  ];
  
  // Add initial message if it exists
  useEffect(() => {
    if (initialMessage && coach.messages.length === 0) {
      coach.sendMessage(initialMessage, 'coach');
    }
  }, [initialMessage]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !coach.isProcessing) {
      coach.sendMessage(input, 'user');
      setInput('');
    }
  };
  
  const toggleRecording = () => {
    setRecording(!recording);
    // Implement actual voice recording logic here
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {showHeader && (
        <div className="px-4 py-3 border-b bg-muted/30">
          <h3 className="font-medium">
            Coach IA
          </h3>
          <p className="text-xs text-muted-foreground">Votre coach personnel</p>
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4" style={{ maxHeight }}>
        <div className="space-y-6">
          {coach.messages.map((message, index) => (
            <CoachMessage
              key={message.id || index}
              message={message}
              isLast={index === coach.messages.length - 1}
            />
          ))}
          
          {coach.isProcessing && (
            <CoachMessage
              message={{
                id: 'loading',
                sender: 'coach',
                content: 'En train de réfléchir...',
                timestamp: new Date().toISOString(),
                isLoading: true
              }}
            />
          )}
        </div>
      </ScrollArea>
      
      <QuickSuggestions 
        suggestions={suggestions} 
      />
      
      <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleRecording}
          className="flex-shrink-0"
        >
          {recording ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1"
          disabled={coach.isProcessing}
        />
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim() || coach.isProcessing}
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default EnhancedCoachChat;
