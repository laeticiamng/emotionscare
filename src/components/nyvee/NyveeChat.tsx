/**
 * NyveeChat - Coach IA Nyvée, bulle flottante bottom-right
 * Interface de chat avec réponses pré-écrites contextuelles
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'nyvee';
  text: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  value: string;
}

interface ConversationStep {
  nyveeMessage: string;
  quickReplies: QuickReply[];
  getResponse: (userChoice: string) => string;
  nextQuickReplies?: (userChoice: string) => QuickReply[];
}

const CONVERSATION_FLOW: ConversationStep[] = [
  {
    nyveeMessage: 'Bonjour, je suis Nyvée, votre coach en régulation émotionnelle. Comment vous sentez-vous en ce moment ?',
    quickReplies: [
      { label: 'Stressé(e)', value: 'stressed' },
      { label: 'Fatigué(e)', value: 'tired' },
      { label: 'Anxieux(se)', value: 'anxious' },
      { label: 'Bien', value: 'good' },
    ],
    getResponse: (choice) => {
      const responses: Record<string, string> = {
        stressed: 'Je comprends. Le stress fait partie du quotidien des soignants. Avez-vous pu prendre un moment pour vous aujourd\'hui ?',
        tired: 'La fatigue est un signal important. Depuis combien de temps ressentez-vous cette fatigue ?',
        anxious: 'L\'anxiété peut être difficile à gérer, surtout dans votre métier. Qu\'est-ce qui vous préoccupe le plus ?',
        good: 'C\'est encourageant ! Maintenir cet équilibre est précieux. Souhaitez-vous renforcer ce bien-être ?',
      };
      return responses[choice] || 'Merci de partager. Parlons-en ensemble.';
    },
    nextQuickReplies: (choice) => {
      if (choice === 'stressed') {
        return [
          { label: 'Non, pas du tout', value: 'no_time' },
          { label: 'Un peu', value: 'some_time' },
          { label: 'Oui, mais pas assez', value: 'not_enough' },
        ];
      }
      if (choice === 'tired') {
        return [
          { label: 'Quelques jours', value: 'few_days' },
          { label: 'Plusieurs semaines', value: 'weeks' },
          { label: 'Depuis longtemps', value: 'long_time' },
        ];
      }
      if (choice === 'anxious') {
        return [
          { label: 'Le travail', value: 'work' },
          { label: 'La charge mentale', value: 'mental_load' },
          { label: 'L\'avenir', value: 'future' },
        ];
      }
      return [
        { label: 'Oui, je veux continuer', value: 'continue' },
        { label: 'Explorer les protocoles', value: 'explore' },
      ];
    },
  },
  {
    nyveeMessage: '',
    quickReplies: [],
    getResponse: () => {
      return 'Merci pour votre confiance. Voici ce que je vous recommande :';
    },
  },
];

const PROTOCOL_RECOMMENDATIONS: Record<string, { name: string; description: string; icon: string }> = {
  stressed: {
    name: 'Protocole Stop',
    description: 'Technique de pause immédiate pour interrompre le cycle de stress en 3 minutes.',
    icon: '🛑',
  },
  tired: {
    name: 'Protocole Reset',
    description: 'Micro-sieste guidée et exercice de récupération énergétique.',
    icon: '🔄',
  },
  anxious: {
    name: 'Protocole Respirez',
    description: 'Cohérence cardiaque et respiration guidée pour apaiser l\'anxiété.',
    icon: '🌬️',
  },
  good: {
    name: 'Scanner Émotionnel',
    description: 'Faites le point complet sur votre état émotionnel avec notre scanner en 5 étapes.',
    icon: '📊',
  },
};

const NyveeChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [step, setStep] = useState(0);
  const [initialEmotion, setInitialEmotion] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addNyveeMessage = useCallback((text: string, replies?: QuickReply[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `nyvee-${Date.now()}`,
          role: 'nyvee',
          text,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      if (replies) {
        setQuickReplies(replies);
      }
    }, 800 + Math.random() * 600);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      const firstStep = CONVERSATION_FLOW[0];
      addNyveeMessage(firstStep.nyveeMessage, firstStep.quickReplies);
      setStep(0);
    }
  }, [messages.length, addNyveeMessage]);

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          text: reply.label,
          timestamp: new Date(),
        },
      ]);
      setQuickReplies([]);

      if (step === 0) {
        setInitialEmotion(reply.value);
        const currentStep = CONVERSATION_FLOW[0];
        const responseText = currentStep.getResponse(reply.value);
        const nextReplies = currentStep.nextQuickReplies?.(reply.value) || [];
        addNyveeMessage(responseText, nextReplies);
        setStep(1);
      } else if (step === 1) {
        // Second step - provide protocol recommendation
        const recommendation = PROTOCOL_RECOMMENDATIONS[initialEmotion] || PROTOCOL_RECOMMENDATIONS.good;
        const recMessage = `${recommendation.icon} **${recommendation.name}**\n\n${recommendation.description}\n\nVoulez-vous commencer ce protocole maintenant ?`;
        addNyveeMessage(recMessage, [
          { label: 'Oui, commencer', value: 'start' },
          { label: 'Voir d\'autres options', value: 'other' },
          { label: 'Merci, plus tard', value: 'later' },
        ]);
        setStep(2);
      } else if (step === 2) {
        if (reply.value === 'start') {
          addNyveeMessage(
            'Parfait ! Rendez-vous dans la section protocoles pour démarrer votre séance. Prenez soin de vous. 💙',
            [{ label: 'Nouvelle conversation', value: 'restart' }]
          );
        } else if (reply.value === 'other') {
          addNyveeMessage(
            'Voici d\'autres ressources disponibles :\n\n🛑 Protocole Stop — Pause d\'urgence\n🔄 Protocole Reset — Récupération\n🌙 Protocole Night — Sommeil\n🌬️ Protocole Respirez — Apaisement\n📊 Scanner Émotionnel — Bilan complet',
            [{ label: 'Nouvelle conversation', value: 'restart' }]
          );
        } else {
          addNyveeMessage(
            'Pas de problème. Je suis là quand vous en aurez besoin. N\'hésitez pas à revenir. 💙',
            [{ label: 'Nouvelle conversation', value: 'restart' }]
          );
        }
        setStep(3);
      } else if (reply.value === 'restart') {
        setMessages([]);
        setStep(0);
        setInitialEmotion('');
        setQuickReplies([]);
        const firstStep = CONVERSATION_FLOW[0];
        addNyveeMessage(firstStep.nyveeMessage, firstStep.quickReplies);
      }
    },
    [step, initialEmotion, addNyveeMessage]
  );

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: inputValue.trim(),
        timestamp: new Date(),
      },
    ]);
    setInputValue('');

    addNyveeMessage(
      'Merci pour votre message. Pour vous accompagner au mieux, utilisez les suggestions ci-dessous ou explorez nos protocoles de régulation émotionnelle.',
      step < 1
        ? CONVERSATION_FLOW[0].quickReplies
        : [{ label: 'Nouvelle conversation', value: 'restart' }]
    );
  }, [inputValue, step, addNyveeMessage]);

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold">
                {part}
              </strong>
            ) : (
              part
            )
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:shadow-xl hover:shadow-primary/40 transition-shadow"
            aria-label="Ouvrir le chat avec Nyvée, coach IA"
          >
            <Sparkles className="h-6 w-6" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat avec Nyvée"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-accent text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Nyvée</p>
                  <p className="text-xs text-white/80">Coach IA EmotionsCare</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Fermer le chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              role="log"
              aria-live="polite"
              aria-label="Messages du chat"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    )}
                  >
                    {formatMessage(msg.text)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {quickReplies.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.value}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                  aria-label="Votre message"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full h-9 w-9 shrink-0"
                  disabled={!inputValue.trim()}
                  aria-label="Envoyer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NyveeChat;
