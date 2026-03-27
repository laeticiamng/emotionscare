// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { useSupport } from '@/providers/SupportProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, HelpCircle, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export const SupportModule: React.FC = () => {
  const { messages, sendMessage, clearHistory } = useSupport();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(messageText);
      if (response) {
        toast.success('Réponse reçue du support');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
      logger.error('Erreur envoi message', error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  // Suggestions de questions rapides
  const quickQuestions = [
    "Comment puis-je analyser mes émotions ?",
    "Problème technique avec l'application",
    "Comment utiliser la génération de musique ?",
    "Question sur mon abonnement",
    "Besoin d'aide avec les paramètres"
  ];

  const handleQuickQuestion = async (question: string) => {
    setIsLoading(true);
    try {
      await sendMessage(question);
      toast.success('Question envoyée');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Support & Assistance</h1>
            <p className="text-muted-foreground">
              Posez vos questions, notre assistant IA est là pour vous aider
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          disabled={messages.length === 0}
        >
          Effacer l'historique
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Conversation
                {messages.length > 0 && (
                  <Badge variant="secondary">{messages.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-4 flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[80%] flex gap-3 ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          {message.emotion && (
                            <Badge 
                              variant="outline" 
                              className="mt-2 text-xs"
                            >
                              {message.emotion}
                            </Badge>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4 animate-pulse" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Formulaire d'envoi */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tapez votre message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec suggestions */}
        <div className="space-y-4">
          {/* Questions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <HelpCircle className="h-4 w-4" />
                Questions fréquentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start h-auto py-2 px-3 text-wrap"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session actuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages:</span>
                <span className="font-medium">{messages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Statut:</span>
                <Badge variant={isLoading ? "secondary" : "default"} className="text-xs">
                  {isLoading ? "En cours..." : "Prêt"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Créer un ticket
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Voir la FAQ
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Contacter un humain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};