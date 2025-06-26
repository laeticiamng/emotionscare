
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Send, Bot, User, Lightbulb, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis votre coach IA personnel. Comment vous sentez-vous aujourd'hui ?",
      sender: 'coach',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Comment gérer mon stress ?",
    "J'ai du mal à dormir",
    "Je me sens anxieux",
    "Comment améliorer ma motivation ?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulation de réponse du coach
    setTimeout(() => {
      const responses = [
        "Je comprends votre préoccupation. Voici quelques conseils personnalisés pour vous aider...",
        "C'est tout à fait normal de ressentir cela. Essayons ensemble quelques techniques de relaxation.",
        "Votre bien-être est important. Je vais vous proposer des exercices adaptés à votre situation.",
        "Prenons le temps d'analyser cette situation et de trouver des solutions ensemble."
      ];

      const coachResponse: Message = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'coach',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Coach IA Personnel
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Votre accompagnement bien-être personnalisé disponible 24h/24
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-rose-500" />
                    Conversation avec Emma
                    <div className="ml-auto flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      En ligne
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'coach' 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {message.sender === 'coach' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === 'coach'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'bg-rose-500 text-white'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'coach' 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-rose-100'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-6 border-t bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Questions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-3 text-xs"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coach Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Emma, votre coach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Emma</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Coach IA spécialisée</p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Psychologie positive</p>
                      <p>• Gestion du stress</p>
                      <p>• Développement personnel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Votre progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sessions cette semaine</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temps total</span>
                      <span className="font-semibold">2h 15min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mood moyen</span>
                      <span className="font-semibold">7.2/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
