/**
 * LiveChatWidget - Widget de chat support en temps réel
 * Fonctionnalités: Chat live, bot IA, transfert agent, fichiers, historique
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Paperclip, Bot, User as UserIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  agentName?: string;
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface LiveChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  enableBot?: boolean;
  onMessageSent?: (message: string) => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  position = 'bottom-right',
  primaryColor = '#0066ff',
  enableBot = true,
  onMessageSent,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'away'>('online');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message de bienvenue
      const welcomeMessage: Message = {
        id: '0',
        content: enableBot
          ? 'Bonjour ! Je suis votre assistant IA EmotionsCare. Comment puis-je vous aider aujourd\'hui ?'
          : 'Bonjour ! Un agent va vous répondre dans quelques instants.',
        sender: enableBot ? 'bot' : 'agent',
        timestamp: new Date(),
        agentName: enableBot ? 'IA EmotionsCare' : 'Support',
      };
      setMessages([welcomeMessage]);
      setIsConnected(true);

      logger.info('Chat live ouvert', undefined, 'SUPPORT');
    }
  }, [isOpen, enableBot]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setMessage('');
    onMessageSent?.(message);

    logger.info('Message chat envoyé', { message }, 'SUPPORT');

    // Simuler réponse (bot ou agent)
    setIsTyping(true);
    setTimeout(() => {
      const response = getAutomatedResponse(message);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: response.isBot ? 'bot' : 'agent',
        timestamp: new Date(),
        agentName: response.isBot ? 'IA EmotionsCare' : 'Sophie Martin',
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAutomatedResponse = (userMessage: string): { content: string; isBot: boolean } => {
    const lowerMsg = userMessage.toLowerCase();

    // Réponses automatiques du bot
    if (enableBot) {
      if (lowerMsg.includes('aide') || lowerMsg.includes('help')) {
        return {
          content: 'Je peux vous aider avec les sujets suivants:\n\n• Questions sur les fonctionnalités\n• Problèmes techniques\n• Gestion de compte\n• Abonnement et facturation\n\nQu\'aimeriez-vous savoir ?',
          isBot: true,
        };
      }

      if (lowerMsg.includes('scan') || lowerMsg.includes('analyse')) {
        return {
          content: 'Notre outil de scan émotionnel vous permet d\'analyser vos émotions via caméra, voix ou texte. Pour démarrer un scan, rendez-vous dans le menu principal > Scan.\n\nAvez-vous besoin d\'aide spécifique sur cette fonctionnalité ?',
          isBot: true,
        };
      }

      if (lowerMsg.includes('compte') || lowerMsg.includes('profil')) {
        return {
          content: 'Pour gérer votre compte, allez dans Paramètres > Profil. Vous pouvez y modifier vos informations, préférences de notifications et paramètres de confidentialité.\n\nSouhaitez-vous de l\'aide sur un paramètre spécifique ?',
          isBot: true,
        };
      }

      if (lowerMsg.includes('agent') || lowerMsg.includes('humain')) {
        setAgentStatus('away');
        return {
          content: 'Je transfère votre demande à un agent humain. Quelqu\'un va vous répondre dans quelques instants...',
          isBot: true,
        };
      }
    }

    // Réponse par défaut
    return {
      content: enableBot
        ? 'Je comprends votre question. Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ?'
        : 'Merci pour votre message. Un agent va vous répondre rapidement.',
      isBot: enableBot,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale est de 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Créer message avec pièce jointe
    const attachment: Attachment = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };

    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `Fichier envoyé: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      attachments: [attachment],
    };

    setMessages([...messages, fileMessage]);
    logger.info('Fichier envoyé dans chat', { fileName: file.name }, 'SUPPORT');
  };

  const positionClass = position === 'bottom-right'
    ? 'bottom-4 right-4'
    : 'bottom-4 left-4';

  return (
    <div className={cn('fixed z-50', positionClass)}>
      {/* Bouton flottant */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          style={{ backgroundColor: primaryColor }}
          aria-label="Ouvrir le chat d'assistance"
        >
          <MessageSquare className="h-6 w-6" aria-hidden="true" />
        </Button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <Card
          className={cn(
            'shadow-2xl transition-all',
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          )}
        >
          {/* Header */}
          <div
            className="p-4 rounded-t-lg flex items-center justify-between text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20">
                  {enableBot ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">
                  {enableBot ? 'IA EmotionsCare' : 'Support EmotionsCare'}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      agentStatus === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    )}
                  />
                  <span>
                    {agentStatus === 'online' ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
                aria-label={isMinimized ? "Agrandir le chat" : "Réduire le chat"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" aria-hidden="true" /> : <Minimize2 className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
                aria-label="Fermer le chat"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto h-[460px] bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-2',
                        msg.sender === 'user' ? 'flex-row-reverse' : ''
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={
                            msg.sender === 'user'
                              ? 'bg-blue-100 text-blue-700'
                              : msg.sender === 'bot'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }
                        >
                          {msg.sender === 'user' ? (
                            <UserIcon className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={cn(
                          'max-w-[70%]',
                          msg.sender === 'user' ? 'text-right' : ''
                        )}
                      >
                        {msg.sender !== 'user' && msg.agentName && (
                          <div className="text-xs text-muted-foreground mb-1">
                            {msg.agentName}
                          </div>
                        )}
                        <div
                          className={cn(
                            'p-3 rounded-lg whitespace-pre-wrap',
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white ml-auto'
                              : 'bg-white border'
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.attachments.map((att, i) => (
                                <a
                                  key={i}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline block"
                                >
                                  📎 {att.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 px-1">
                          {msg.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Joindre un fichier"
                  >
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Input
                    placeholder="Tapez votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()} aria-label="Envoyer le message">
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default LiveChatWidget;
