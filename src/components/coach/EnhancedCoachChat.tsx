
import React, { useState, useEffect, useRef } from 'react';
import { CoachChatProps } from '@/types/coach';
import { useCoach } from '@/contexts/coach';
import EnhancedCoachMessage from './EnhancedCoachMessage';
import EnhancedCoachChatInput from './EnhancedCoachChatInput';
import BreathingLoader from '@/components/chat/BreathingLoader';
import ConversationTimeline from './ConversationTimeline';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import CoachPreferencesPanel, { CoachPreferences } from './CoachPreferencesPanel';
import ConfettiCelebration from '@/components/effects/ConfettiCelebration';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Menu, 
  X, 
  History, 
  PanelLeft, 
  ChevronLeft, 
  Clock,
  Calendar
} from 'lucide-react';

const EnhancedCoachChat: React.FC<CoachChatProps> = ({
  initialMessage,
  showCharacter = true,
  characterSize = "md",
  className,
  showControls = true,
  showHeader = true,
  showInput = true,
  embedded = false
}) => {
  const { messages, sendMessage, isProcessing, clearMessages, conversations = [], currentConversation } = useCoach();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CoachPreferences>({
    coachType: 'calm',
    themeColor: '#7C3AED',
    fontSize: 1,
    animationsEnabled: true,
    soundEnabled: false
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'journal'>('history');
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send initial message from coach if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      // Add initial message from coach to the chat
      sendMessage(initialMessage, 'coach');
    }
  }, [initialMessage, messages.length, sendMessage]);
  
  // Check for achievements to trigger confetti
  useEffect(() => {
    if (messages.length > 0 && messages.length % 10 === 0) {
      // Every 10 messages, trigger confetti
      setShowConfetti(true);
      
      // Show celebration toast
      toast({
        title: "Conversation active !",
        description: "Vous progressez dans votre parcours émotionnel",
        variant: "default",
      });
      
      // Reset confetti after delay
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, toast]);
  
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    try {
      // Send user message
      sendMessage(text, 'user');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  const handleSavePreferences = (newPreferences: CoachPreferences) => {
    setPreferences(newPreferences);
    
    // Apply preferences
    document.documentElement.style.setProperty('--coach-primary-color', newPreferences.themeColor);
    
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences ont été appliquées avec succès.",
    });
  };
  
  // Get emotional tone from messages to adapt UI
  const getEmotionalTone = (): string => {
    if (messages.length < 2) return 'neutral';
    
    // Look at last few messages to determine tone
    const recentMessages = messages.slice(-5);
    const userMessages = recentMessages.filter(m => m.sender === 'user').map(m => m.content || '');
    
    if (userMessages.some(text => /triste|déprimé|mal|seul|déprime/i.test(text))) {
      return 'sad';
    }
    
    if (userMessages.some(text => /joyeux|content|heureux|super|joie/i.test(text))) {
      return 'happy';
    }
    
    if (userMessages.some(text => /inquiet|stress|anxieux|peur/i.test(text))) {
      return 'anxious';
    }
    
    if (userMessages.some(text => /calme|zen|tranquille|serein/i.test(text))) {
      return 'calm';
    }
    
    return 'neutral';
  };
  
  const emotionalTone = getEmotionalTone();
  
  // Dynamic background gradient based on emotional tone
  const getBackgroundStyle = () => {
    const toneColors = {
      happy: 'from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/30',
      sad: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/30',
      anxious: 'from-purple-50 to-red-50 dark:from-purple-950/20 dark:to-red-950/30',
      calm: 'from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/30',
      neutral: 'from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/20'
    };
    
    return toneColors[emotionalTone as keyof typeof toneColors] || toneColors.neutral;
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full rounded-lg overflow-hidden",
      className
    )}>
      {/* Confetti celebration effect */}
      <ConfettiCelebration trigger={showConfetti} />
      
      {/* Chat header */}
      {showHeader && (
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!embedded && (
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSidebar(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div className="font-medium flex items-center gap-2">
              <span 
                className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" 
                aria-hidden="true"
              />
              Coach IA
              {isProcessing && (
                <span className="text-xs text-muted-foreground">
                  (en train d'écrire...)
                </span>
              )}
            </div>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowPreferences(true)}
                aria-label="Préférences"
              >
                <Settings className="h-4 w-4" />
              </Button>
              {!embedded && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hidden md:flex"
                  onClick={() => setShowSidebar(!showSidebar)}
                  aria-label={showSidebar ? "Cacher le panneau latéral" : "Afficher le panneau latéral"}
                >
                  {showSidebar ? <PanelLeft className="h-4 w-4" /> : <History className="h-4 w-4" />}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Main chat area with sidebar layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Messages container - main content */}
        <div className={cn(
          "flex-1 overflow-y-auto p-4 relative transition-all",
          `bg-gradient-to-br ${getBackgroundStyle()}`
        )}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-4xl" role="img" aria-label="Coach">🧠</span>
              </div>
              <h3 className="font-medium mt-4">Bonjour, je suis votre coach IA</h3>
              <p className="mt-1">Comment puis-je vous aider aujourd'hui ?</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <EnhancedCoachMessage
                  key={message.id || index}
                  message={message}
                  isLast={index === messages.length - 1}
                  animateText={preferences.animationsEnabled && message.sender !== 'user'}
                  fontSize={preferences.fontSize}
                />
              ))}
              {isProcessing && (
                <div className="flex my-4 ml-11">
                  <div className="bg-muted rounded-2xl px-4 py-3 rounded-tl-none">
                    <BreathingLoader />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Sidebar for history and journal */}
        {showSidebar && !embedded && (
          <div className="w-80 border-l overflow-hidden flex-shrink-0 hidden md:block">
            <div className="h-full flex flex-col">
              <div className="border-b flex">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex-1 rounded-none border-b-2", 
                    activeTab === 'history' 
                      ? "border-primary" 
                      : "border-transparent"
                  )}
                  onClick={() => setActiveTab('history')}
                >
                  <History className="h-4 w-4 mr-2" />
                  Historique
                </Button>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex-1 rounded-none border-b-2", 
                    activeTab === 'journal' 
                      ? "border-primary" 
                      : "border-transparent"
                  )}
                  onClick={() => setActiveTab('journal')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Journal
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3">
                {activeTab === 'history' ? (
                  <ConversationTimeline 
                    conversations={conversations}
                    activeConversationId={currentConversation?.id || null}
                    onSelectConversation={(id) => {
                      console.log("Conversation selected:", id);
                      // Implementation would connect to the context
                    }}
                  />
                ) : (
                  <div className="space-y-4 p-2">
                    <h3 className="font-medium">Votre journal émotionnel</h3>
                    <p className="text-sm text-muted-foreground">
                      Suivez votre progression émotionnelle au fil du temps.
                    </p>
                    {/* Journal entries would go here */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Aujourd'hui, 14:30
                        </span>
                      </div>
                      <p className="mt-2 text-sm">
                        J'ai ressenti du calme après ma séance de méditation.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Hier, 19:15
                        </span>
                      </div>
                      <p className="mt-2 text-sm">
                        Journée stressante au travail, besoin de décompresser.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      {showInput && (
        <EnhancedCoachChatInput 
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      )}
      
      {/* Mobile sidebar drawer */}
      <Drawer open={showSidebar && !embedded} onOpenChange={setShowSidebar}>
        <DrawerContent>
          <div className="h-[80vh] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">
                {activeTab === 'history' ? 'Historique' : 'Journal'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex mb-4 border-b">
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none border-b-2", 
                  activeTab === 'history' 
                    ? "border-primary" 
                    : "border-transparent"
                )}
                onClick={() => setActiveTab('history')}
              >
                <History className="h-4 w-4 mr-2" />
                Historique
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none border-b-2", 
                  activeTab === 'journal' 
                    ? "border-primary" 
                    : "border-transparent"
                )}
                onClick={() => setActiveTab('journal')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Journal
              </Button>
            </div>
            
            {activeTab === 'history' ? (
              <ConversationTimeline 
                conversations={conversations}
                activeConversationId={currentConversation?.id || null}
                onSelectConversation={(id) => {
                  console.log("Conversation selected:", id);
                  setShowSidebar(false);
                  // Implementation would connect to the context
                }}
              />
            ) : (
              <div className="space-y-4 p-2">
                <h3 className="font-medium">Votre journal émotionnel</h3>
                <p className="text-sm text-muted-foreground">
                  Suivez votre progression émotionnelle au fil du temps.
                </p>
                {/* Journal entries would go here */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Aujourd'hui, 14:30
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    J'ai ressenti du calme après ma séance de méditation.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Hier, 19:15
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    Journée stressante au travail, besoin de décompresser.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Preferences drawer */}
      <Drawer open={showPreferences} onOpenChange={setShowPreferences}>
        <DrawerContent>
          <div className="p-4 max-w-md mx-auto">
            <CoachPreferencesPanel
              onClose={() => setShowPreferences(false)}
              onSave={handleSavePreferences}
              initialPreferences={preferences}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EnhancedCoachChat;
