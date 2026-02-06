import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Phone,
  Mail,
  FileText,
  Zap,
  Heart,
  HelpCircle,
  ChevronDown,
  X,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  suggestions?: string[];
  helpful?: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Comment analyser mes émotions ?',
    answer: 'Rendez-vous dans la section "Scan Émotionnel" et choisissez votre méthode préférée : analyse textuelle, vocale ou par webcam. Notre IA analysera vos émotions en temps réel.',
    category: 'Fonctionnalités',
    helpful: 89
  },
  {
    id: '2',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Absolument ! Nous utilisons un chiffrement de niveau bancaire (AES-256) et sommes conformes RGPD. Vous gardez le contrôle total sur vos données.',
    category: 'Sécurité',
    helpful: 92
  },
  {
    id: '3',
    question: 'Comment fonctionne le Coach IA ?',
    answer: 'Notre Coach IA analyse votre état émotionnel et vous propose des exercices personnalisés : respiration, mindfulness, musique thérapeutique adaptée à votre humeur.',
    category: 'Coach IA',
    helpful: 87
  },
  {
    id: '4',
    question: 'Puis-je annuler mon abonnement ?',
    answer: 'Oui, vous pouvez annuler à tout moment depuis vos paramètres de compte. Aucune pénalité, et vos données restent disponibles 30 jours après annulation.',
    category: 'Abonnement',
    helpful: 95
  }
];

const quickActions = [
  { label: 'Problème de connexion', icon: <User className="h-4 w-4" /> },
  { label: 'Question sur la facturation', icon: <FileText className="h-4 w-4" /> },
  { label: 'Comment utiliser une fonctionnalité', icon: <HelpCircle className="h-4 w-4" /> },
  { label: 'Demande de suppression de données', icon: <FileText className="h-4 w-4" /> },
  { label: 'Signaler un bug', icon: <Zap className="h-4 w-4" /> },
  { label: 'Demande de fonctionnalité', icon: <Heart className="h-4 w-4" /> }
];

export default function SupportChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis Emma, votre assistante virtuelle EmotionsCare. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toISOString(),
      suggestions: ['Question sur mes données', 'Problème technique', 'Informations facturation']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulation de réponse du chatbot
    setTimeout(() => {
      const botResponse = generateBotResponse(messageContent);
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = "Je comprends votre question. ";
    let suggestions: string[] = [];

    if (lowerMessage.includes('données') || lowerMessage.includes('rgpd') || lowerMessage.includes('privée')) {
      response += "Concernant vos données personnelles, nous appliquons les plus hauts standards de sécurité. Vous pouvez exporter ou supprimer vos données à tout moment depuis la section RGPD de vos paramètres.";
      suggestions = ['Exporter mes données', 'Supprimer mes données', 'Voir mes consentements'];
    } else if (lowerMessage.includes('problème') || lowerMessage.includes('bug') || lowerMessage.includes('erreur')) {
      response += "Je suis désolée d'apprendre que vous rencontrez un problème technique. Pouvez-vous me donner plus de détails ? En attendant, essayez de vider votre cache ou de redémarrer l'application.";
      suggestions = ['Vider le cache', 'Redémarrer l\'app', 'Contacter le support technique'];
    } else if (lowerMessage.includes('facturation') || lowerMessage.includes('abonnement') || lowerMessage.includes('paiement')) {
      response += "Pour toute question concernant votre abonnement ou facturation, vous pouvez consulter votre espace client ou me poser une question spécifique.";
      suggestions = ['Voir mes factures', 'Modifier mon abonnement', 'Annuler mon abonnement'];
    } else if (lowerMessage.includes('comment') || lowerMessage.includes('utiliser')) {
      response += "Je serais ravie de vous expliquer comment utiliser nos fonctionnalités ! Quelle fonctionnalité vous intéresse particulièrement ?";
      suggestions = ['Scan émotionnel', 'Coach IA', 'Journal personnel', 'Réalité virtuelle'];
    } else {
      response += "Je vais faire de mon mieux pour vous aider. Si ma réponse ne vous satisfait pas, je peux vous mettre en contact avec un agent humain.";
      suggestions = ['Parler à un humain', 'Voir la FAQ', 'Autres questions'];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date().toISOString(),
      suggestions
    };
  };

  const markAsHelpful = (messageId: string, helpful: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
    toast.success(helpful ? 'Merci pour votre retour !' : 'Nous allons améliorer cette réponse');
  };

  const filteredFAQ = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Support & Assistance
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Obtenez de l'aide instantanée avec Emma, notre assistante IA, ou consultez notre base de connaissances.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat principal */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Chat avec Emma
                </CardTitle>
                <CardDescription>
                  Assistance instantanée disponible 24/7
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          {message.type === 'bot' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                          {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="mt-3 space-y-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="mr-2 mb-2 text-xs h-7"
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            {/* Feedback pour les messages du bot */}
                            {message.type === 'bot' && message.helpful === undefined && (
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs text-muted-foreground">Cette réponse vous a-t-elle aidé ?</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsHelpful(message.id, true)}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsHelpful(message.id, false)}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de chat */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Tapez votre message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSendMessage(action.label)}
                    className="w-full justify-start"
                  >
                    {action.icon}
                    <span className="ml-2 text-xs">{action.label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Contact direct */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Direct</CardTitle>
                <CardDescription>
                  Besoin d'aide personnalisée ?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  support@emotionscare.com
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  +33 1 23 45 67 89
                </Button>
                <div className="text-xs text-muted-foreground">
                  Disponible Lun-Ven 9h-18h
                </div>
              </CardContent>
            </Card>

            {/* Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Satisfaction Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Assistance disponible</div>
                  <div className="flex justify-center mt-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Questions Fréquentes
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFAQ(!showFAQ)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showFAQ ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          
          {showFAQ && (
            <CardContent>
              <div className="flex gap-2 mb-6 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'Toutes' : category}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredFAQ.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{item.question}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{item.answer}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {item.helpful}% utile
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}