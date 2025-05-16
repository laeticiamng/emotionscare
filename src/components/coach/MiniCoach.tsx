
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import CoachCharacter from './CoachCharacter';
import { useCoach } from '@/contexts/CoachContext';

interface MiniCoachProps {
  className?: string;
  quickQuestions?: string[];
  allowInput?: boolean;
}

const MiniCoach: React.FC<MiniCoachProps> = ({ 
  className, 
  quickQuestions = [
    "Comment puis-je me sentir mieux?",
    "J'ai besoin d'aide pour me détendre"
  ],
  allowInput = true
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendMessage, messages } = useCoach();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [coachMood, setCoachMood] = useState<string>('neutral');
  
  useEffect(() => {
    // When messages change, update the last message
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'coach' || lastMsg.sender === 'assistant') {
        setLastMessage(lastMsg.text || lastMsg.content || null);
        setCoachMood(determineCoachMood(lastMsg.text || lastMsg.content || ''));
      }
    }
  }, [messages]);
  
  const determineCoachMood = (content: string) => {
    content = content.toLowerCase();
    if (content.includes('merci') || content.includes('super') || content.includes('excellent')) {
      return 'happy';
    } else if (content.includes('désolé') || content.includes('problème') || content.includes('erreur')) {
      return 'sad';
    } else if (content.includes('respire') || content.includes('calme') || content.includes('détend')) {
      return 'calm';
    } else if (content.includes('stress') || content.includes('anxiété') || content.includes('inquiétude')) {
      return 'anxious';
    } else {
      return 'neutral';
    }
  };

  // Handle showing the input and navigating to full chat
  const handleOpenFullChat = () => {
    navigate('/coach-chat');
  };
  
  // Handle quick question click
  const handleQuickQuestion = async (question: string) => {
    try {
      setIsTyping(true);
      await sendMessage(question);
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending quick question:', error);
      setIsTyping(false);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la question au coach IA",
        variant: "destructive",
      });
    }
  };
  
  // Handle sending a message from the input
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    try {
      setIsTyping(true);
      await sendMessage(inputValue);
      setInputValue('');
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message au coach IA",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Coach IA</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleOpenFullChat}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            <span>Ouvrir</span>
          </Button>
        </div>
        
        <div className="flex flex-col items-center text-center my-4">
          <CoachCharacter 
            mood={coachMood} 
            speaking={isTyping} 
            size="md" 
            className="mb-4"
          />
          
          {isTyping ? (
            <div className="loading-dots">
              <div className="bg-primary"></div>
              <div className="bg-primary"></div>
              <div className="bg-primary"></div>
            </div>
          ) : lastMessage ? (
            <p className="text-sm line-clamp-3">{lastMessage}</p>
          ) : (
            <p className="text-sm">Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd'hui ?</p>
          )}
        </div>
        
        {allowInput && (
          showInput ? (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Écrivez votre message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setShowInput(false)}
                >
                  Annuler
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                >
                  {isTyping ? 'Envoi...' : 'Envoyer'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-auto">
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button 
                    key={index} 
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto py-3 px-3 text-left"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isTyping}
                  >
                    {question}
                  </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setShowInput(true)}
                className="w-full mt-2 text-xs"
                size="sm"
              >
                Message personnalisé
              </Button>
            </div>
          )
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 text-xs w-full"
          onClick={handleOpenFullChat}
        >
          Continuer la discussion
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MiniCoach;
