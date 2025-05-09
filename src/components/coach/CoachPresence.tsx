
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Music, Book, User, Sparkles, Smile, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CoachPresenceProps {
  className?: string;
  onActivateChat?: () => void;
  onActivateMusic?: () => void;
  onActivateJournal?: () => void;
  useSmallVariant?: boolean;
}

const CoachPresence: React.FC<CoachPresenceProps> = ({
  className,
  onActivateChat,
  onActivateMusic,
  onActivateJournal,
  useSmallVariant = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [breathing, setBreathing] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Extract first name from user display name or email
  const firstName = React.useMemo(() => {
    if (!user) return '';
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return '';
  }, [user]);
  
  useEffect(() => {
    // Control breathing animation
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle navigation to chat
  const handleChatNavigate = () => {
    if (onActivateChat) {
      onActivateChat();
    } else {
      navigate('/coach-chat');
    }
  };
  
  // Mindful breathing element
  const BreathingHalo = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="rounded-full bg-primary/5"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ width: '100%', height: '100%', zIndex: -1 }}
      />
    </div>
  );
  
  if (useSmallVariant) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-4">
          <BreathingHalo />
          <div className="flex flex-col items-center justify-center p-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium text-center mb-2">
              {firstName ? `Bonjour, ${firstName}` : 'Bonjour'}
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-4">
              Comment puis-je vous accompagner aujourd'hui?
            </p>
            <Button 
              onClick={handleChatNavigate} 
              className="w-full"
            >
              Ouvrir le Coach IA
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {breathing && <BreathingHalo />}
      
      <div className="p-6 relative z-10">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {firstName ? `Bonjour, ${firstName}` : 'Bonjour'}
              </h2>
              <p className="text-muted-foreground">
                Je suis là pour vous accompagner dans votre parcours émotionnel
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {firstName ? `Je suis là pour vous, ${firstName}` : 'Comment puis-je vous aider?'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  De quoi avez-vous besoin aujourd'hui?
                </p>
              </div>
              
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    "flex justify-start h-auto py-4 px-4 text-left",
                    selectedOption === "share" && "border-primary bg-primary/5"
                  )}
                  onClick={() => {
                    setSelectedOption("share");
                    setTimeout(handleChatNavigate, 300);
                  }}
                >
                  <div className="mr-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Juste déposer ce que je ressens</p>
                    <p className="text-sm text-muted-foreground">
                      Partagez librement vos émotions et ressentis
                    </p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex justify-start h-auto py-4 px-4 text-left",
                    selectedOption === "reflect" && "border-primary bg-primary/5"
                  )}
                  onClick={() => {
                    setSelectedOption("reflect");
                    setTimeout(() => {
                      navigate('/coach-chat', { 
                        state: { initialPrompt: "J'ai besoin de prendre du recul sur ma situation actuelle" } 
                      });
                    }, 300);
                  }}
                >
                  <div className="mr-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Prendre du recul</p>
                    <p className="text-sm text-muted-foreground">
                      Explorer une situation avec perspective
                    </p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex justify-start h-auto py-4 px-4 text-left",
                    selectedOption === "pattern" && "border-primary bg-primary/5"
                  )}
                  onClick={() => {
                    setSelectedOption("pattern");
                    setTimeout(() => {
                      navigate('/coach-chat', { 
                        state: { initialPrompt: "Je veux comprendre un schéma émotionnel récurrent" } 
                      });
                    }, 300);
                  }}
                >
                  <div className="mr-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smile className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Comprendre un schéma émotionnel</p>
                    <p className="text-sm text-muted-foreground">
                      Identifier les tendances dans vos réactions
                    </p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex justify-start h-auto py-4 px-4 text-left",
                    selectedOption === "goal" && "border-primary bg-primary/5"
                  )}
                  onClick={() => {
                    setSelectedOption("goal");
                    setTimeout(() => {
                      navigate('/coach-chat', { 
                        state: { initialPrompt: "Je veux avancer sur un objectif personnel" } 
                      });
                    }, 300);
                  }}
                >
                  <div className="mr-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Avancer sur un objectif personnel</p>
                    <p className="text-sm text-muted-foreground">
                      Progresser vers un changement désiré
                    </p>
                  </div>
                </Button>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (onActivateJournal) {
                      onActivateJournal();
                    } else {
                      navigate('/journal/new');
                    }
                  }}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Journal émotionnel
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (onActivateMusic) {
                      onActivateMusic();
                    } else {
                      navigate('/music');
                    }
                  }}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Musique thérapeutique
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoachPresence;
