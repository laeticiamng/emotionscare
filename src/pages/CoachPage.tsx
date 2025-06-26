
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain, 
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  emotion?: string;
  suggestions?: string[];
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'coach',
      content: 'Bonjour ! Je suis votre coach en bien-être émotionnel. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date(),
      suggestions: ['Je me sens stressé(e)', 'J\'ai besoin de motivation', 'Je veux méditer', 'Aide-moi à relaxer']
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulation de réponse du coach IA
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: getCoachResponse(newMessage),
        timestamp: new Date(),
        emotion: detectEmotion(newMessage),
        suggestions: getContextualSuggestions(newMessage)
      };
      setMessages(prev => [...prev, coachResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getCoachResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('anxieux')) {
      return 'Je comprends que vous ressentez du stress. Prenons un moment pour respirer ensemble. Essayez la technique 4-7-8 : inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes. Cette technique active votre système nerveux parasympathique.';
    } else if (input.includes('triste') || input.includes('déprim')) {
      return 'Vos sentiments sont valides et il est normal de traverser des moments difficiles. Avez-vous essayé de noter trois choses positives de votre journée ? Même les plus petites comptent.';
    } else if (input.includes('motivation') || input.includes('énergie')) {
      return 'La motivation vient souvent après l\'action, pas avant. Commençons par de petits objectifs réalisables. Quel serait un petit pas que vous pourriez faire maintenant ?';
    } else if (input.includes('sommeil') || input.includes('dormir')) {
      return 'Un bon sommeil est essentiel pour votre bien-être émotionnel. Essayez une routine de relaxation 30 minutes avant le coucher : éteignez les écrans, pratiquez la respiration profonde ou la méditation guidée.';
    } else {
      return 'Merci de partager cela avec moi. Chaque émotion que vous ressentez est importante. Pouvez-vous me dire ce qui vous préoccupe le plus en ce moment ?';
    }
  };

  const detectEmotion = (text: string): string => {
    const input = text.toLowerCase();
    if (input.includes('stress') || input.includes('anxieux')) return 'stress';
    if (input.includes('triste') || input.includes('déprim')) return 'tristesse';
    if (input.includes('colère') || input.includes('énervé')) return 'colère';
    if (input.includes('joie') || input.includes('heureux')) return 'joie';
    return 'neutre';
  };

  const getContextualSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress')) {
      return ['Exercice de respiration', 'Méditation guidée', 'Marche en pleine conscience', 'Musique relaxante'];
    } else if (input.includes('triste')) {
      return ['Journal de gratitude', 'Appeler un proche', 'Écouter de la musique', 'Sortir prendre l\'air'];
    } else if (input.includes('motivation')) {
      return ['Fixer un petit objectif', 'Écouter un podcast inspirant', 'Faire de l\'exercice', 'Visualiser ses réussites'];
    } else {
      return ['Méditation', 'Exercice de respiration', 'Journal émotionnel', 'Musique thérapeutique'];
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    toast.success("Reconnaissance vocale activée - Commencez à parler !");
    
    // Simulation de reconnaissance vocale
    setTimeout(() => {
      setIsListening(false);
      toast.info("Message vocal reçu !");
    }, 3000);
  };

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'fr-FR';
      speechSynthesis.speak(utterance);
    } else {
      toast.error("La synthèse vocale n'est pas supportée sur ce navigateur");
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Brain className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Coach IA Bien-être
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Votre accompagnateur personnel pour une meilleure santé émotionnelle. 
            Partagez vos émotions, recevez des conseils personnalisés.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Conversation avec votre coach
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-indigo-100' : 'bg-green-100'}`}>
                              {message.type === 'user' ? (
                                <User className="h-4 w-4 text-indigo-600" />
                              ) : (
                                <Bot className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <div className={`rounded-2xl p-4 ${
                              message.type === 'user' 
                                ? 'bg-indigo-500 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p className="mb-2">{message.content}</p>
                              {message.emotion && (
                                <Badge variant="secondary" className="mb-2">
                                  Émotion détectée: {message.emotion}
                                </Badge>
                              )}
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm font-medium">Suggestions :</p>
                                  <div className="flex flex-wrap gap-2">
                                    {message.suggestions.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="h-7 text-xs"
                                      >
                                        {suggestion}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {message.type === 'coach' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => speakMessage(message.content)}
                                  className="mt-2 h-7 text-xs"
                                >
                                  <Volume2 className="h-3 w-3 mr-1" />
                                  Écouter
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="flex gap-3">
                          <div className="p-2 rounded-full bg-green-100">
                            <Bot className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl p-4">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-6 border-t bg-gray-50/50">
                    <div className="flex gap-3">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Partagez vos émotions, posez une question..."
                        className="flex-1 resize-none"
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={startVoiceRecognition}
                          variant={isListening ? "destructive" : "outline"}
                          size="icon"
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    Check-in émotionnel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                    Exercice de respiration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2 text-purple-500" />
                    Méditation guidée
                  </Button>
                </CardContent>
              </Card>

              {/* Mood Tracker */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Humeur du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {['😊', '😐', '😢', '😠', '😰', '🥳'].map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-12 text-2xl hover:scale-110 transition-transform"
                        onClick={() => toast.success(`Humeur enregistrée: ${emoji}`)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Vos Progrès</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sessions cette semaine</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Streak actuel</span>
                    <Badge variant="secondary">5 jours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Humeur moyenne</span>
                    <Badge variant="secondary">😊 Positive</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
