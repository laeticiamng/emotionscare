// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquareText, UserIcon, Sparkles, Mic, MicOff, Maximize2, Minimize2, RefreshCw, ThumbsUp, ThumbsDown, Copy, Volume2 } from 'lucide-react';
import { useCoach } from '@/contexts/coach';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface MiniCoachProps {
  className?: string;
  quickQuestions?: string[];
  defaultExpanded?: boolean;
  showVoice?: boolean;
}

const DEFAULT_QUESTIONS = [
  "Comment te sens-tu ?",
  "Besoin de parler ?",
  "Un conseil ?",
  "Exercice rapide"
];

const MiniCoach: React.FC<MiniCoachProps> = ({ 
  className, 
  quickQuestions = DEFAULT_QUESTIONS,
  defaultExpanded = false,
  showVoice = true
}) => {
  const { messages, sendMessage, isProcessing, currentEmotion } = useCoach();
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isListening, setIsListening] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(false);

  // Simuler l'indicateur de frappe
  useEffect(() => {
    if (isProcessing) {
      setTypingIndicator(true);
    } else {
      const timeout = setTimeout(() => setTypingIndicator(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText, 'user');
      setInputText('');
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question, 'user');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Ici on intégrerait la reconnaissance vocale
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [messageId]: type }));
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      // Ignorer l'erreur
    }
  };

  // Afficher les derniers messages selon l'état expanded
  const displayMessages = isExpanded ? messages.slice(-6) : messages.slice(-3);

  const getMoodEmoji = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'anxious': return '😰';
      case 'calm': return '😌';
      default: return '🤖';
    }
  };

  return (
    <motion.div
      layout
      className={cn("transition-all duration-300", className)}
    >
      <Card className={cn(
        "flex flex-col overflow-hidden",
        isExpanded ? "h-[500px]" : "h-auto"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl"
              >
                {getMoodEmoji(currentEmotion)}
              </motion.div>
              <div>
                <CardTitle className="text-lg font-medium">Coach IA</CardTitle>
                <CardDescription className="text-xs">
                  {isProcessing ? 'En train de réfléchir...' : 'En ligne'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isExpanded ? 'Réduire' : 'Agrandir'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn(
          "flex-1 overflow-y-auto",
          isExpanded ? "max-h-[300px]" : "max-h-[150px]"
        )}>
          <div className="space-y-4">
            {displayMessages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <Sparkles className="mx-auto h-10 w-10 text-primary/30 mb-2" />
                <p className="text-muted-foreground text-sm">
                  Comment puis-je vous aider aujourd'hui ?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Choisissez une question rapide ou écrivez votre message
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {displayMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-start gap-2 rounded-lg p-3 group",
                      msg.sender === 'user' 
                        ? "bg-primary/10 ml-4" 
                        : "bg-muted mr-4"
                    )}
                  >
                    <div className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0",
                      msg.sender === 'user' ? "bg-primary/20" : "bg-primary/10"
                    )}>
                      {msg.sender === 'user' ? (
                        <UserIcon className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <MessageSquareText className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{msg.content}</div>
                      
                      {/* Actions pour les messages du coach */}
                      {msg.sender !== 'user' && (
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                          >
                            {copiedMessageId === msg.id ? (
                              <span className="text-xs text-green-500">✓</span>
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6",
                              feedbackGiven[msg.id] === 'up' && "text-green-500"
                            )}
                            onClick={() => handleFeedback(msg.id, 'up')}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6",
                              feedbackGiven[msg.id] === 'down' && "text-red-500"
                            )}
                            onClick={() => handleFeedback(msg.id, 'down')}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Indicateur de frappe */}
            <AnimatePresence>
              {typingIndicator && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start py-2"
                >
                  <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <motion.div
                        className="h-2 w-2 bg-primary/60 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="h-2 w-2 bg-primary/60 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div
                        className="h-2 w-2 bg-primary/60 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Coach écrit...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Questions rapides */}
          {quickQuestions && quickQuestions.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {quickQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="pt-2">
          <div className="flex w-full items-center gap-2">
            {showVoice && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isListening ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "h-10 w-10 flex-shrink-0",
                        isListening && "bg-red-500 hover:bg-red-600"
                      )}
                      onClick={handleVoiceToggle}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isListening ? 'Arrêter' : 'Parler'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Textarea
              placeholder="Écrivez votre message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[40px] h-10 py-2 resize-none"
            />
            
            <Button 
              size="icon" 
              onClick={handleSend} 
              disabled={inputText.trim() === '' || isProcessing}
              aria-label="Envoyer le message"
              className="h-10 w-10 flex-shrink-0"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MiniCoach;
