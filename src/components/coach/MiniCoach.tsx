import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Extract first name from user
  const firstName = React.useMemo(() => {
    if (!user) return '';
    // Safely check for user_metadata
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  }, [user]);

  const handleGoToCoach = () => {
    navigate('/coach');
  };
  
  const handleGoToChat = (question?: string) => {
    if (question) {
      navigate('/coach-chat', { state: { initialPrompt: question } });
    } else {
      navigate('/coach-chat');
    }
  };
  
  const handleQuickQuestion = (question: string) => {
    toast({
      title: "Redirection vers le coach",
      description: "Votre question sera traitée par le coach"
    });
    handleGoToChat(question);
  };
  
  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setIsTyping(true);
    
    // Show typing indicator, then redirect
    setTimeout(() => {
      handleGoToChat(inputValue);
      setIsTyping(false);
      setInputValue('');
    }, 800);
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {/* Breathing circle in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="rounded-full bg-primary/5"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ width: '100%', height: '100%', zIndex: 0 }}
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-1">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium text-sm">Coach IA</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={handleGoToCoach}
            >
              Ouvrir <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              {firstName ? `Bonjour ${firstName}. ` : ''}
              Comment puis-je vous aider aujourd'hui?
            </p>
          </div>
          
          {quickQuestions.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}
          
          {allowInput && (
            <div className="space-y-3">
              {showInput ? (
                <form onSubmit={handleSubmitInput}>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Posez votre question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="text-xs min-h-[60px]"
                      disabled={isTyping}
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="h-auto"
                      disabled={isTyping || !inputValue.trim()}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={() => setShowInput(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Poser une question
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniCoach;
