
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Sparkles, Heart, Lightbulb, Target, MessageCircle, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  mood?: string;
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis Emma, votre coach en bien-être émotionnel. Je suis ravie de vous accompagner aujourd'hui. Comment vous sentez-vous en ce moment ?",
      sender: 'coach',
      timestamp: new Date(),
      mood: 'welcoming'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [coachMood, setCoachMood] = useState('welcoming');

  const coachResponses = [
    "C'est merveilleux d'entendre cela ! Maintenir un état d'esprit positif est essentiel pour votre bien-être.",
    "Je comprends que vous puissiez vous sentir ainsi. Parlons de ce qui vous préoccupe et trouvons ensemble des solutions.",
    "Il est tout à fait normal de ressentir cela. Votre ressenti est valide et important.",
    "Excellente question ! Laissez-moi vous donner quelques conseils personnalisés basés sur votre situation.",
    "Je suis là pour vous accompagner. Ensemble, nous pouvons surmonter ces défis.",
    "Votre bien-être est ma priorité. Que puis-je faire pour vous aider davantage aujourd'hui ?",
    "Bravo pour avoir pris cette initiative ! Prendre soin de soi est un acte de courage.",
    "Je remarque que vous progressez. C'est formidable de voir votre engagement envers votre bien-être."
  ];

  const suggestions = [
    "Comment gérer le stress au travail ?",
    "Techniques de relaxation rapide",
    "Améliorer mon sommeil",
    "Retrouver ma motivation",
    "Gérer mes émotions",
    "Exercices de respiration"
  ];

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: coachResponses[Math.floor(Math.random() * coachResponses.length)],
        sender: 'coach',
        timestamp: new Date(),
        mood: 'supportive'
      };
      
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const sendSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Coach IA Emma
            </h1>
            <Sparkles className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre accompagnatrice personnelle pour le bien-être émotionnel et mental
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coach Profile */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-4">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-purple-200">
                    <AvatarImage src="/api/placeholder/96/96" alt="Coach Emma" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                      E
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">Emma</h3>
                <p className="text-sm text-gray-600 mb-4">Coach en Bien-être Émotionnel</p>
                
                <div className="space-y-2 mb-6">
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="h-3 w-3 mr-1" /> Empathique
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Brain className="h-3 w-3 mr-1" /> IA Avancée
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Target className="h-3 w-3 mr-1" /> Personnalisé
                  </Badge>
                </div>

                <div className="text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Conseils personnalisés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Écoute active 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smile className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Approche bienveillante</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="glass-card h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Conversation avec Emma
                </CardTitle>
                <CardDescription>
                  Partagez vos pensées et recevez des conseils personnalisés
                </CardDescription>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
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
                        <div className={`max-w-xs lg:max-w-md ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white border shadow-sm'
                        } p-4 rounded-2xl`}>
                          {message.sender === 'coach' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                                  E
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-700">Emma</span>
                            </div>
                          )}
                          <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-700'}`}>
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border shadow-sm p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                              E
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-700">Emma</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Suggestions */}
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Suggestions rapides :</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendSuggestion(suggestion)}
                      className="text-xs hover:bg-purple-50 hover:border-purple-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Écrivez votre message à Emma..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
