import React, { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, MessageSquareText, UserIcon, Sparkles, Mic, MicOff, 
  Maximize2, Minimize2, RefreshCw, ThumbsUp, ThumbsDown, Copy, 
  Volume2, Download, Share2, Trash2, History, TrendingUp, Star
} from 'lucide-react';
import { useCoach } from '@/contexts/coach';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

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

const STORAGE_KEY = 'mini-coach-data';

interface CoachStats {
  totalMessages: number;
  positiveFeedback: number;
  negativeFeedback: number;
  sessionCount: number;
  favoriteQuestions: Record<string, number>;
  lastSessionDate: string | null;
  streakDays: number;
}

const MiniCoach: React.FC<MiniCoachProps> = memo(({ 
  className, 
  quickQuestions = DEFAULT_QUESTIONS,
  defaultExpanded = false,
  showVoice = true
}) => {
  const { toast } = useToast();
  const { messages, sendMessage, isProcessing, currentEmotion } = useCoach();
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isListening, setIsListening] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<CoachStats>({
    totalMessages: 0,
    positiveFeedback: 0,
    negativeFeedback: 0,
    sessionCount: 1,
    favoriteQuestions: {},
    lastSessionDate: null,
    streakDays: 0,
  });

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: CoachStats = JSON.parse(saved);
      setStats(parsed);
      setFeedbackGiven(JSON.parse(localStorage.getItem(`${STORAGE_KEY}-feedback`) || '{}'));
      
      // Check streak
      const today = new Date().toDateString();
      const lastDate = parsed.lastSessionDate;
      if (lastDate && lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastDate === yesterday) {
          saveStats({ ...parsed, streakDays: parsed.streakDays + 1, lastSessionDate: today });
        } else {
          saveStats({ ...parsed, streakDays: 1, lastSessionDate: today });
        }
      } else if (!lastDate) {
        saveStats({ ...parsed, lastSessionDate: today, streakDays: 1 });
      }
    } else {
      saveStats({ ...stats, lastSessionDate: new Date().toDateString() });
    }
  }, []);

  // Save stats
  const saveStats = (newStats: CoachStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  // Simuler l'indicateur de frappe
  useEffect(() => {
    if (isProcessing) {
      setTypingIndicator(true);
    } else {
      const timeout = setTimeout(() => setTypingIndicator(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing]);

  const handleSend = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText);
      setInputText('');
      
      // Update stats
      saveStats({
        ...stats,
        totalMessages: stats.totalMessages + 1,
        lastSessionDate: new Date().toDateString(),
      });
    }
  };

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question);
    
    // Update stats
    const newFavorites = { ...stats.favoriteQuestions };
    newFavorites[question] = (newFavorites[question] || 0) + 1;
    
    saveStats({
      ...stats,
      totalMessages: stats.totalMessages + 1,
      favoriteQuestions: newFavorites,
      lastSessionDate: new Date().toDateString(),
    });
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
    const newFeedback = { ...feedbackGiven, [messageId]: type };
    setFeedbackGiven(newFeedback);
    localStorage.setItem(`${STORAGE_KEY}-feedback`, JSON.stringify(newFeedback));
    
    // Update stats
    saveStats({
      ...stats,
      positiveFeedback: type === 'up' ? stats.positiveFeedback + 1 : stats.positiveFeedback,
      negativeFeedback: type === 'down' ? stats.negativeFeedback + 1 : stats.negativeFeedback,
    });
    
    toast({
      title: type === 'up' ? 'Merci ! 👍' : 'Merci pour votre retour',
      description: 'Votre feedback aide à améliorer le coach.',
    });
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({ title: 'Copié !', description: 'Message copié dans le presse-papier' });
    } catch (err) {
      // Ignorer l'erreur
    }
  };

  const handleExportConversation = () => {
    const text = messages.map(m => 
      `[${m.sender === 'user' ? 'Vous' : 'Coach'}] ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-coach-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exporté !', description: 'Conversation téléchargée' });
  };

  const handleShare = async () => {
    const text = `🤖 Ma session avec le Coach IA EmotionsCare:\n\n${
      messages.slice(-2).map(m => `${m.sender === 'user' ? 'Moi' : '🤖'}: ${m.content}`).join('\n')
    }`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Texte copié dans le presse-papier' });
    }
  };

  const speakMessage = (content: string) => {
    if (!('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  // Afficher les derniers messages selon l'état expanded
  const displayMessages = isExpanded ? messages.slice(-8) : messages.slice(-3);

  const getMoodEmoji = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'anxious': return '😰';
      case 'calm': return '😌';
      default: return '🤖';
    }
  };

  // Sort quick questions by usage
  const sortedQuestions = [...quickQuestions].sort((a, b) => {
    const aCount = stats.favoriteQuestions[a] || 0;
    const bCount = stats.favoriteQuestions[b] || 0;
    return bCount - aCount;
  });

  const satisfactionRate = stats.positiveFeedback + stats.negativeFeedback > 0
    ? Math.round((stats.positiveFeedback / (stats.positiveFeedback + stats.negativeFeedback)) * 100)
    : null;

  return (
    <TooltipProvider>
      <motion.div
        layout
        className={cn("transition-all duration-300", className)}
      >
        <Card className={cn(
          "flex flex-col overflow-hidden",
          isExpanded ? "h-[550px]" : "h-auto"
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
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    Coach IA
                    {stats.streakDays >= 3 && (
                      <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600">
                        🔥 {stats.streakDays}j
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isProcessing ? 'En train de réfléchir...' : 'En ligne'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowStats(!showStats)}
                    >
                      <TrendingUp className={cn('h-4 w-4', showStats && 'text-primary')} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Statistiques</TooltipContent>
                </Tooltip>
                
                {messages.length > 0 && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Partager</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleExportConversation}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Exporter</TooltipContent>
                    </Tooltip>
                  </>
                )}
                
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
              </div>
            </div>
          </CardHeader>

          {/* Stats panel */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-2"
              >
                <div className="p-3 bg-muted/50 rounded-lg grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold">{stats.totalMessages}</div>
                    <div className="text-xs text-muted-foreground">Messages</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stats.sessionCount}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stats.streakDays}</div>
                    <div className="text-xs text-muted-foreground">Série</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {satisfactionRate !== null ? `${satisfactionRate}%` : '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CardContent className={cn(
            "flex-1 overflow-y-auto",
            isExpanded ? "max-h-[350px]" : "max-h-[150px]"
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
                            <Tooltip>
                              <TooltipTrigger asChild>
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
                              </TooltipTrigger>
                              <TooltipContent>Copier</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => speakMessage(msg.content)}
                                >
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Écouter</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "h-6 w-6",
                                    feedbackGiven[msg.id] === 'up' && "text-green-500"
                                  )}
                                  onClick={() => handleFeedback(msg.id, 'up')}
                                  disabled={!!feedbackGiven[msg.id]}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Utile</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "h-6 w-6",
                                    feedbackGiven[msg.id] === 'down' && "text-red-500"
                                  )}
                                  onClick={() => handleFeedback(msg.id, 'down')}
                                  disabled={!!feedbackGiven[msg.id]}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Pas utile</TooltipContent>
                            </Tooltip>
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
            {sortedQuestions && sortedQuestions.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {sortedQuestions.map((question, index) => {
                  const usageCount = stats.favoriteQuestions[question] || 0;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "cursor-pointer hover:bg-primary/10 transition-colors py-1.5 relative",
                              usageCount > 3 && "border-primary/50"
                            )}
                            onClick={() => handleQuickQuestion(question)}
                          >
                            {question}
                            {usageCount > 0 && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                                {usageCount > 9 ? '9+' : usageCount}
                              </span>
                            )}
                          </Badge>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {usageCount > 0 ? `Utilisé ${usageCount} fois` : 'Jamais utilisé'}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="pt-2">
            <div className="flex w-full items-center gap-2">
              {showVoice && (
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
    </TooltipProvider>
  );
});

MiniCoach.displayName = 'MiniCoach';

export default MiniCoach;
