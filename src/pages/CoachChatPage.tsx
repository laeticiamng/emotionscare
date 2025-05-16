
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, ArrowLeft, MenuSquare, Loader2, 
  Book, Music, Sparkles, ThumbsUp, ThumbsDown, Smile, Frown, Meh
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useMusic } from '@/contexts/MusicContext';

// Message interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  emotion?: 'neutral' | 'positive' | 'negative';
}

const CoachChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { setOpenDrawer } = useMusic();
  
  // Get initial question from location state if provided
  const initialPrompt = location.state?.initialPrompt || location.state?.initialQuestion || null;
  
  // Coach details
  const coach = {
    name: 'Emma',
    role: 'Coach IA Personnel',
    avatar: '/coach-avatar.png',
  };
  
  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userTypingSpeed, setUserTypingSpeed] = useState('normal');
  const [emotionalTone, setEmotionalTone] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathingRate, setBreathingRate] = useState(6); // breaths per minute
  const [selectedLanguage, setSelectedLanguage] = useState('tendre');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const lastTypingTime = useRef<number>(0);
  
  // Welcome message from coach
  React.useEffect(() => {
    // Initial greeting message customized for user
    const firstName = user?.email ? user.email.split('@')[0] : 'là';
    
    const initialMessages: Message[] = [
      {
        id: '1',
        content: `Bonjour${firstName ? `, ${firstName}` : ''}. Je suis ${coach.name}, votre coach de bien-être émotionnel. C'est ok de ne pas toujours savoir par où commencer. Je suis là pour vous accompagner, à votre rythme.`,
        sender: 'coach',
        timestamp: new Date(),
        emotion: 'positive',
      },
    ];
    
    setMessages(initialMessages);
    
    // If there's an initial prompt/question, process it after a short delay
    if (initialPrompt) {
      setTimeout(() => {
        handleSubmit(null, initialPrompt);
      }, 500);
    }
  }, [user, initialPrompt]);

  // Scroll to bottom of messages
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Monitor user typing behavior
  const detectTypingPattern = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    const text = e.target.value;
    
    // Update the message
    setNewMessage(text);
    
    // Detect emotional tone from text
    if (text.length > 10) {
      // Very simple detection - to be replaced with actual sentiment analysis
      const lowerText = text.toLowerCase();
      const negativeWords = ['triste', 'déprimé', 'anxieux', 'stressé', 'mal', 'inquiet', 'peur'];
      const positiveWords = ['heureux', 'content', 'bien', 'joie', 'super', 'merci', 'reconnaissant'];
      
      const hasNegative = negativeWords.some(word => lowerText.includes(word));
      const hasPositive = positiveWords.some(word => lowerText.includes(word));
      
      if (hasNegative && !hasPositive) {
        setEmotionalTone('negative');
      } else if (hasPositive && !hasNegative) {
        setEmotionalTone('positive');
      } else {
        setEmotionalTone('neutral');
      }
    }
    
    // Detect typing speed
    if (lastTypingTime.current && text.length > 5) {
      const timeDiff = now - lastTypingTime.current;
      const charCount = text.length;
      
      if (timeDiff > 0 && charCount > 0) {
        // Classify typing speed
        if (timeDiff < 100) {
          setUserTypingSpeed('fast');
        } else if (timeDiff > 300) {
          setUserTypingSpeed('slow');
        } else {
          setUserTypingSpeed('normal');
        }
      }
    }
    
    lastTypingTime.current = now;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent | null, overrideMessage?: string) => {
    if (e) e.preventDefault();
    const messageToSend = overrideMessage || newMessage;
    
    if (!messageToSend.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
      emotion: emotionalTone,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');

    // Simulate coach typing
    setIsTyping(true);
    
    // Adapt response time based on message length and user typing speed
    const baseDelay = 1000; // base delay in milliseconds
    const messageLength = messageToSend.length;
    let responseDelay = baseDelay;
    
    // Adjust delay based on message length and user typing
    if (messageLength > 100) {
      responseDelay += 1000; // longer delay for longer messages
    }
    
    if (userTypingSpeed === 'slow') {
      responseDelay += 500; // respond slightly slower to slow typers
    } else if (userTypingSpeed === 'fast') {
      responseDelay -= 300; // respond more quickly to fast typers
    }
    
    // Ensure minimum delay
    responseDelay = Math.max(responseDelay, 800);
    
    setTimeout(() => {
      // Generate coach response based on user message and emotional tone
      let response: string;
      
      // Adapt language style based on selected preference
      const languageStyle = selectedLanguage === 'tendre' ? 'empathique et chaleureux' :
                          selectedLanguage === 'inspirant' ? 'motivant et énergique' : 'direct et concret';
      
      // Check for specific commands
      if (messageToSend.toLowerCase().includes('respire') || 
          messageToSend.toLowerCase().includes('respirer') ||
          messageToSend.toLowerCase().includes('calme')) {
        response = `Je comprends que vous ayez besoin d'un moment de calme. Prenons un temps ensemble pour respirer. Je peux vous guider à travers une courte séance de respiration si vous le souhaitez. Dites simplement "oui" et nous commencerons.`;
      }
      else if (messageToSend.toLowerCase().includes('musique')) {
        response = `La musique peut être un excellent moyen de soutenir votre bien-être émotionnel. Je peux vous recommander des mélodies adaptées à votre humeur actuelle. Souhaitez-vous que j'active le lecteur musical ?`;
        
        // Show the music drawer after a small delay
        setTimeout(() => {
          // Activate music based on detected emotion
          setOpenDrawer(true);
        }, 1000);
      }
      else if (messageToSend.toLowerCase().includes('journal')) {
        response = `Le journaling est une excellente pratique pour explorer vos émotions et développer votre conscience de soi. Je peux vous accompagner vers la page de journal si vous souhaitez commencer une entrée maintenant.`;
        
        setTimeout(() => {
          toast({
            title: "Journal Émotionnel",
            description: "Voulez-vous commencer une entrée de journal?",
            action: (
              <Button size="sm" onClick={() => navigate('/journal/new')}>
                Ouvrir
              </Button>
            ),
          });
        }, 1000);
      }
      else if (emotionalTone === 'negative') {
        if (languageStyle === 'empathique et chaleureux') {
          response = `Je comprends que ce ne soit pas facile pour vous en ce moment. C'est normal de traverser des moments difficiles, et je suis là pour vous soutenir. Qu'est-ce qui vous aiderait à vous sentir un peu mieux maintenant ? Parfois, partager ce qui nous préoccupe peut déjà alléger le fardeau.`;
        } else if (languageStyle === 'motivant et énergique') {
          response = `Je vois que vous traversez un moment délicat. Rappelez-vous que chaque émotion, même difficile, nous apprend quelque chose d'important sur nous-mêmes. Ensemble, nous pouvons transformer ce défi en opportunité de croissance. Quelle petite étape positive pourriez-vous faire maintenant ?`;
        } else {
          response = `J'ai noté votre inconfort. Identifions précisément ce qui vous affecte et explorons des solutions concrètes. Pouvez-vous décrire plus spécifiquement ce que vous ressentez physiquement et mentalement en ce moment ?`;
        }
      }
      else if (emotionalTone === 'positive') {
        if (languageStyle === 'empathique et chaleureux') {
          response = `Je suis vraiment content de voir cette énergie positive ! C'est précieux de reconnaître et de célébrer ces moments de bien-être. Comment pourriez-vous prolonger ou approfondir cette sensation agréable dans votre journée ?`;
        } else if (languageStyle === 'motivant et énergique') {
          response = `Excellent ! Gardez cette dynamique positive ! C'est exactement ce type d'énergie qui nous permet d'avancer et de réaliser nos objectifs. Comment comptez-vous capitaliser sur cet élan pour progresser davantage ?`;
        } else {
          response = `Votre état positif est noté. C'est une bonne occasion pour avancer sur vos projets ou résoudre des problèmes en suspens. Y a-t-il un objectif spécifique sur lequel vous souhaitez travailler maintenant que vous êtes dans de bonnes dispositions ?`;
        }
      }
      else {
        // Default responses based on language style
        if (languageStyle === 'empathique et chaleureux') {
          response = `Merci de partager cela avec moi. Je suis là pour vous accompagner dans votre exploration émotionnelle. Comment vous sentez-vous par rapport à cette situation en ce moment ? N'hésitez pas à exprimer ce qui vous vient, même si cela peut sembler confus.`;
        } else if (languageStyle === 'motivant et énergique') {
          response = `Je vous encourage à continuer cette réflexion ! Chaque pas dans la compréhension de soi est une victoire. Quels insights avez-vous déjà sur cette situation, et où souhaitez-vous aller à partir de maintenant ?`;
        } else {
          response = `J'ai compris votre message. Pour avancer efficacement, explorons ensemble les éléments factuels de la situation et les options concrètes à votre disposition. Pouvez-vous préciser ce que vous attendez comme résultat ?`;
        }
      }

      // Add coach response
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        content: response,
        sender: 'coach',
        timestamp: new Date(),
        emotion: 'neutral',
      };
      setMessages((prevMessages) => [...prevMessages, coachMessage]);
      setIsTyping(false);
    }, responseDelay);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Start breathing mode
  const startBreathingMode = () => {
    setIsBreathingMode(true);
    toast({
      title: "Mode Respiration Activé",
      description: "Suivez le rythme visuel pour respirer en pleine conscience"
    });
  };

  // Exit breathing mode
  const exitBreathingMode = () => {
    setIsBreathingMode(false);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      {isBreathingMode ? (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-primary/10 to-background relative">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 60 / breathingRate,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-40 h-40 rounded-full bg-primary/30 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [0.8, 1.1, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 60 / breathingRate,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-32 h-32 rounded-full bg-primary/40 flex items-center justify-center"
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
          </motion.div>
          
          <p className="mt-8 text-lg font-medium">Respirez au rythme du cercle</p>
          <p className="text-muted-foreground mt-2">Inspirez quand il s'agrandit, expirez quand il réduit</p>
          
          <div className="mt-6 flex gap-4">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setBreathingRate(Math.max(4, breathingRate - 1))}
            >
              Plus lent
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setBreathingRate(Math.min(10, breathingRate + 1))}
            >
              Plus rapide
            </Button>
          </div>
          
          <Button className="mt-12" onClick={exitBreathingMode}>
            Retour à la conversation
          </Button>
        </div>
      ) : (
        <>
          {/* Header with subtle glow */}
          <div className="border-b p-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-primary/20 blur-2xl pointer-events-none opacity-70" />
            
            <div className="flex items-center gap-3 z-10">
              <Button variant="ghost" size="icon" onClick={() => navigate('/coach')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={coach.avatar} alt={coach.name} />
                <AvatarFallback>
                  <Sparkles className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-lg leading-none">{coach.name}</h2>
                <p className="text-xs text-muted-foreground">{coach.role}</p>
              </div>
            </div>
            <div className="flex gap-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MenuSquare className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/coach-chat')}>
                    Nouvelle conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={startBreathingMode}>
                    Mode respiration
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenDrawer(true)}>
                    Ouvrir lecteur musical
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Style selector */}
          <div className="border-b py-2 px-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">Style de communication:</div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={selectedLanguage === 'tendre' ? 'default' : 'outline'}
                  className="text-xs h-7"
                  onClick={() => setSelectedLanguage('tendre')}
                >
                  Tendre
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedLanguage === 'inspirant' ? 'default' : 'outline'}
                  className="text-xs h-7"
                  onClick={() => setSelectedLanguage('inspirant')}
                >
                  Inspirant
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedLanguage === 'pragmatique' ? 'default' : 'outline'}
                  className="text-xs h-7"
                  onClick={() => setSelectedLanguage('pragmatique')}
                >
                  Pragmatique
                </Button>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } ${message.emotion === 'negative' ? 'negative-message' : ''}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.sender === 'user'
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                    
                    {/* Only show reaction options for coach messages */}
                    {message.sender === 'coach' && (
                      <div className="flex gap-1 mt-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-primary/10"
                          onClick={() => {
                            toast({
                              title: "Merci pour votre retour",
                              description: "Votre avis nous aide à améliorer votre expérience"
                            });
                          }}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-destructive/10"
                          onClick={() => {
                            toast({
                              title: "Merci pour votre retour",
                              description: "Nous travaillons à améliorer nos réponses"
                            });
                          }}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary">
                    <div className="flex space-x-1 items-center">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-current"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-current"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-current"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>

          {/* Quick actions bar */}
          <div className="border-t p-2 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8"
              onClick={startBreathingMode}
            >
              Je veux respirer
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8"
              onClick={() => setOpenDrawer(true)}
            >
              <Music className="mr-1 h-3 w-3" /> Musique
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8"
              onClick={() => navigate('/journal/new')}
            >
              <Book className="mr-1 h-3 w-3" /> Journal
            </Button>
          </div>

          {/* Mood indicator */}
          <div className="border-t px-4 py-2 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Comment vous sentez-vous ?
            </div>
            <div className="flex gap-2">
              <Button 
                variant={emotionalTone === 'negative' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setEmotionalTone('negative')}
              >
                <Frown className="h-4 w-4" />
              </Button>
              <Button 
                variant={emotionalTone === 'neutral' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setEmotionalTone('neutral')}
              >
                <Meh className="h-4 w-4" />
              </Button>
              <Button 
                variant={emotionalTone === 'positive' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setEmotionalTone('positive')}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Message input */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={detectTypingPattern}
                placeholder="Partagez ce que vous ressentez..."
                className="flex-1 min-h-[60px] max-h-[200px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isTyping || !newMessage.trim()}>
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CoachChatPage;
