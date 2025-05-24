
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Send, Loader2, User, Bot, Lightbulb, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Coach: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Simuler le chargement initial
    setTimeout(() => {
      setIsLoading(false);
      // Message de bienvenue du coach
      const welcomeMessage: Message = {
        id: '1',
        content: `Bonjour ${user?.user_metadata?.firstName || user?.user_metadata?.name || 'vous'} ! 👋\n\nJe suis votre coach IA personnel d'EmotionsCare. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel.\n\nComment puis-je vous aider aujourd'hui ? Vous pouvez me parler de :\n• Votre état émotionnel actuel\n• Vos objectifs de bien-être\n• Vos défis quotidiens\n• Toute question sur la gestion des émotions`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 1000);
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler une réponse du coach IA
    setTimeout(() => {
      const responses = [
        "Je comprends ce que vous ressentez. C'est tout à fait normal de vivre ces ém otions. Voici quelques stratégies qui pourraient vous aider...",
        "Merci de partager cela avec moi. Basé sur ce que vous me dites, je recommande de commencer par des exercices de respiration profonde.",
        "C'est formidable que vous preniez le temps de réfléchir à votre bien-être ! Voici quelques conseils personnalisés pour votre situation...",
        "Je sens que vous traversez une période délicate. Rappelez-vous que chaque émotion a sa place et son utilité. Voici comment nous pouvons travailler ensemble...",
        "Excellent ! Cette prise de conscience est déjà un grand pas vers votre bien-être. Continuons à explorer ensemble..."
      ];

      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const suggestedQuestions = [
    "Comment gérer mon stress au travail ?",
    "J'ai du mal à m'endormir, que faire ?",
    "Comment améliorer ma confiance en moi ?",
    "Que faire quand je me sens débordé ?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Préparation de votre coach personnel..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            Coach IA Personnel
          </h1>
          <p className="text-muted-foreground">
            Votre compagnon de bien-être émotionnel, disponible 24h/24
          </p>
        </div>
      </motion.div>

      {/* Zone de chat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-blue-600" />
              Conversation avec votre coach
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground ml-4' 
                      : 'bg-muted mr-4'
                  }`}>
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <Bot className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                      )}
                      {message.isUser && (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted mr-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Zone de saisie */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions suggérées */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Questions fréquentes
              </CardTitle>
              <CardDescription>
                Cliquez sur une question pour commencer la conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="h-auto p-4 text-left justify-start"
                    disabled={isTyping}
                  >
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Conseils et fonctionnalités */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Votre coach peut vous aider avec
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <h3 className="font-medium mb-1">Gestion des émotions</h3>
                <p className="text-sm text-muted-foreground">
                  Techniques pour comprendre et gérer vos émotions au quotidien
                </p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-medium mb-1">Objectifs bien-être</h3>
                <p className="text-sm text-muted-foreground">
                  Définition et suivi de vos objectifs de développement personnel
                </p>
              </div>
              <div className="text-center">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="font-medium mb-1">Conseils personnalisés</h3>
                <p className="text-sm text-muted-foreground">
                  Recommandations adaptées à votre profil et vos besoins
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Coach;
