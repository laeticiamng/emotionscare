import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Send, Mic, MicOff, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn, formatTime } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  isVoice?: boolean;
}

const coachPersonalities = [
  {
    id: 'empathique',
    name: 'Coach Empathique',
    emoji: '💝',
    description: 'Bienveillant et à l\'écoute',
    style: 'Un coach chaleureux qui privilégie l\'écoute active et le soutien émotionnel'
  },
  {
    id: 'motivant',
    name: 'Coach Motivant',
    emoji: '🚀',
    description: 'Énergique et encourageant',
    style: 'Un coach dynamique qui vous pousse à dépasser vos limites avec optimisme'
  },
  {
    id: 'analytique',
    name: 'Coach Analytique',
    emoji: '🧠',
    description: 'Logique et structuré',
    style: 'Un coach méthodique qui analyse les situations avec précision et propose des solutions concrètes'
  },
  {
    id: 'zen',
    name: 'Coach Zen',
    emoji: '🧘‍♀️',
    description: 'Calme et philosophe',
    style: 'Un coach apaisant qui vous guide vers la sérénité et l\'équilibre intérieur'
  }
];

const quickPrompts = [
  "Comment gérer mon stress au travail ?",
  "J'ai du mal à rester motivé",
  "Comment améliorer ma confiance en moi ?",
  "Je me sens submergé par mes émotions",
  "Aide-moi à mieux dormir",
  "Comment développer de bonnes habitudes ?",
];

export const AICoach: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(coachPersonalities[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'fr-FR';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript, true);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Erreur de reconnaissance vocale');
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Message de bienvenue
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Bonjour ! Je suis votre ${selectedCoach.name} 🤖 ${selectedCoach.emoji}\n\n${selectedCoach.style}\n\nComment puis-je vous aider aujourd'hui ?`,
        sender: 'coach',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isAuthenticated, selectedCoach]);

  const generateCoachResponse = async (userMessage: string): Promise<string> => {
    // Simulation d'une réponse IA
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = {
      empathique: [
        "Je comprends que vous traversiez une période difficile. Vos sentiments sont parfaitement valides. 💝",
        "Prendre conscience de ses émotions est déjà un grand pas. Vous n'êtes pas seul(e) dans ce parcours. 🤗",
        "Il est normal de ressentir cela. Prenons le temps d'explorer ces émotions ensemble. 💚"
      ],
      motivant: [
        "Vous avez tout ce qu'il faut pour surmonter cela ! Chaque défi est une opportunité de grandir ! 🚀",
        "Je crois en votre potentiel ! Transformons cette difficulté en victoire ! 💪",
        "Vous êtes plus fort(e) que vous ne le pensez ! Allons-y étape par étape ! ✨"
      ],
      analytique: [
        "Analysons la situation de manière structurée. Quels sont les facteurs déclencheurs ? 🧠",
        "Identifions les éléments clés et créons un plan d'action concret et réalisable. 📊",
        "Décomposons ce problème en étapes manageable pour une résolution efficace. 🎯"
      ],
      zen: [
        "Respirons ensemble. Dans cet instant présent, vous êtes en sécurité. 🧘‍♀️",
        "L'acceptation est le premier pas vers la paix intérieure. Observons sans jugement. 🕯️",
        "Comme les vagues de l'océan, nos émotions vont et viennent. Trouvons la sérénité. 🌊"
      ]
    };

    const coachResponses = responses[selectedCoach.id as keyof typeof responses];
    const randomResponse = coachResponses[Math.floor(Math.random() * coachResponses.length)];
    
    return randomResponse;
  };

  const handleSendMessage = async (text?: string, isVoiceMessage = false) => {
    const messageText = text || inputMessage.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
      isVoice: isVoiceMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const coachResponse = await generateCoachResponse(messageText);
      
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: coachResponse,
        sender: 'coach',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, coachMessage]);
    } catch (error) {
      toast.error('Erreur lors de la génération de la réponse');
      console.error('Coach response error:', error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const startVoiceRecording = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
      toast.info('Parlez maintenant...');
    }
  };

  const stopVoiceRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    handleSendMessage(prompt);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
            <p className="text-muted-foreground">
              Vous devez être connecté pour discuter avec votre coach IA.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Bot className="h-10 w-10 text-primary" />
            Coach IA Personnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un accompagnement personnalisé pour votre bien-être émotionnel
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Sélection du coach et prompts */}
            <div className="space-y-6">
              {/* Sélection du coach */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Choisissez votre coach</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {coachPersonalities.map((coach) => (
                    <button
                      key={coach.id}
                      onClick={() => setSelectedCoach(coach)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all duration-300",
                        selectedCoach.id === coach.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg">{coach.emoji}</span>
                        <span className="font-medium text-sm">{coach.name}</span>
                      </div>
                      <p className="text-xs opacity-80">{coach.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Prompts rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sujets populaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full p-2 text-left text-xs bg-muted hover:bg-accent rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      {prompt}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Zone de chat */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{selectedCoach.emoji}</span>
                    <div>
                      <div className="text-lg">{selectedCoach.name}</div>
                      <CardDescription className="text-xs">
                        {selectedCoach.description}
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === 'coach' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[70%] p-3 rounded-lg",
                          message.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          <span>{formatTime(message.timestamp.getTime() / 1000)}</span>
                          {message.isVoice && (
                            <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">
                              Vocal
                            </span>
                          )}
                        </div>
                      </div>

                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Le coach réfléchit...
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Zone de saisie */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Tapez votre message..."
                      className="flex-1 p-3 border rounded-lg bg-background resize-none"
                      disabled={isLoading || isRecording}
                    />
                    
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="icon"
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      disabled={isLoading}
                    >
                      {isRecording ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {isRecording && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                      🔴 Enregistrement en cours... Parlez maintenant
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};