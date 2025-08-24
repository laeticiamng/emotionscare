
import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Heart, 
  Lightbulb,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Sparkles,
  User,
  Bot,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Target,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis';
  emotion?: string;
  confidence?: number;
}

const AICoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis votre coach IA personnel d'EmotionsCare. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel. Comment vous sentez-vous aujourd'hui ?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: "Je me sens stressé aujourd'hui", emotion: "stress", icon: "😰" },
    { text: "J'ai besoin de motivation", emotion: "motivation", icon: "💪" },
    { text: "Comment gérer mes émotions ?", emotion: "conseil", icon: "🤔" },
    { text: "Je me sens formidable !", emotion: "joie", icon: "😊" }
  ];

  const coachPersonalities = [
    { id: 'empathique', name: 'Emma - Coach Empathique', description: 'Écoute bienveillante et compréhension' },
    { id: 'motivateur', name: 'Max - Coach Motivateur', description: 'Énergie positive et encouragements' },
    { id: 'sage', name: 'Sage - Coach Philosophe', description: 'Réflexion profonde et sagesse' },
    { id: 'pragmatique', name: 'Alex - Coach Pragmatique', description: 'Solutions concrètes et efficaces' }
  ];

  const [selectedCoach, setSelectedCoach] = useState(coachPersonalities[0]);

  const headerData = {
    title: "Coach IA Personnel",
    subtitle: "Votre accompagnateur intelligent pour le bien-être",
    description: "Discutez avec votre coach IA personnel qui comprend vos émotions et vous guide vers un meilleur équilibre mental.",
    icon: Brain,
    gradient: "from-purple-500 via-blue-500 to-teal-500",
    badge: "Intelligence Artificielle",
    stats: [
      { label: "Conversations", value: "2.3k", icon: MessageSquare, color: "text-blue-600" },
      { label: "Conseils Donnés", value: "856", icon: Lightbulb, color: "text-yellow-500" },
      { label: "Satisfaction", value: "96%", icon: Star, color: "text-green-500" },
      { label: "Disponibilité", value: "24/7", icon: Clock, color: "text-purple-500" }
    ],
    actions: [
      {
        label: "Nouvelle Session",
        onClick: () => {
          setMessages([{
            id: Date.now().toString(),
            content: "Nouvelle session démarrée ! Comment puis-je vous aider aujourd'hui ?",
            sender: 'ai',
            timestamp: new Date(),
            type: 'text'
          }]);
        },
        variant: 'outline' as const,
        icon: RotateCcw
      },
      {
        label: "Guide d'utilisation",
        onClick: () => console.log('Guide'),
        variant: 'secondary' as const,
        icon: BookOpen
      }
    ]
  };

  const tipsSections = [
    {
      title: 'Optimisez vos conversations',
      content: 'Soyez précis et honnête sur vos émotions pour recevoir des conseils personnalisés.',
      icon: MessageSquare
    },
    {
      title: 'Utilisez la reconnaissance vocale',
      content: 'Parlez naturellement à votre coach pour une interaction plus fluide.',
      icon: Mic
    },
    {
      title: 'Suivez vos progrès',
      content: 'Consultez régulièrement vos analytics pour voir votre évolution.',
      icon: TrendingUp
    }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const aiResponses = [
        "Je comprends ce que vous ressentez. C'est tout à fait normal d'avoir ces émotions. Voulez-vous explorer ensemble ce qui vous préoccupe ?",
        "Votre ressenti est important. Prenons un moment pour analyser cette situation. Qu'est-ce qui vous a amené à vous sentir ainsi ?",
        "Merci de partager cela avec moi. Je perçois une certaine préoccupation dans vos mots. Comment puis-je vous accompagner au mieux ?",
        "C'est formidable que vous preniez le temps de vous exprimer. Vos émotions sont valides. Explorons ensemble des stratégies pour vous aider."
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        emotion: 'supportive'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Mettre à jour l'humeur détectée
      const moods = ['calme', 'préoccupé', 'optimiste', 'réfléchi'];
      setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 2000);
  };

  const handleQuickSuggestion = (suggestion: typeof quickSuggestions[0]) => {
    setInputValue(suggestion.text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Ici on intégrerait la reconnaissance vocale
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <PageLayout
      header={headerData}
      tips={{
        title: "Conseils pour Interagir avec votre Coach IA",
        items: tipsSections,
        cta: {
          label: "Voir tous les conseils",
          onClick: () => console.log('Tous les conseils')
        }
      }}
      className="bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50"
    >
      <div className="space-y-6">
        {/* Sélection du Coach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Choisissez Votre Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {coachPersonalities.map((coach) => (
                <motion.button
                  key={coach.id}
                  onClick={() => setSelectedCoach(coach)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedCoach.id === coach.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">{coach.name}</div>
                    <div className="text-xs text-muted-foreground">{coach.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interface de Chat Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Zone de Chat */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/coach-avatar.png" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <Brain className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedCoach.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedCoach.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Avatar className="w-8 h-8">
                            {message.sender === 'user' ? (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className={`rounded-lg p-3 ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {message.sender === 'ai' && (
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Indicateur de frappe */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Suggestions Rapides */}
              {messages.length <= 2 && (
                <div className="p-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Suggestions rapides :</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="text-xs"
                      >
                        <span className="mr-1">{suggestion.icon}</span>
                        {suggestion.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Zone de Saisie */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Partagez vos pensées et émotions..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleListening}
                      className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                        isListening ? 'text-red-500' : 'text-muted-foreground'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panneau Latéral */}
          <div className="space-y-4">
            {/* État Émotionnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  État Actuel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentMood && (
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      Humeur détectée: {currentMood}
                    </Badge>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bien-être général</span>
                    <span>76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Niveau de stress</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Objectifs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objectifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { goal: "Méditation quotidienne", progress: 80 },
                  { goal: "Gestion du stress", progress: 65 },
                  { goal: "Communication positive", progress: 90 }
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.goal}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions Rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Exercice de respiration
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Écrire dans mon journal
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir mes progrès
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AICoachPage;
