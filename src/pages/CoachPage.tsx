
import React, { useState, useEffect, useRef } from 'react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { supabase } from '@/integrations/supabase/client';
import useOpenAI from '@/hooks/api/useOpenAI';
import {
  Brain, Send, BarChart, ChevronDown, ChevronUp, Clock, Star, Paperclip,
  Smile, Frown, Sparkles, RefreshCw, Settings, HelpCircle, Clipboard, Video
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  messages?: Message[];
  timestamp: Date;
}

interface CoachPageProps {
  specialMode?: 'cocon'; // For B2B user "Cocon" feature
}

const CoachPage: React.FC<CoachPageProps> = ({ specialMode }) => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { generateText, chatCompletion, isLoading: isAiLoading } = useOpenAI();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [progresses, setProgresses] = useState<{ [key: string]: number }>({
    'stress': 65,
    'sleep': 78,
    'mindfulness': 45,
    'mood': 70,
  });
  
  // Initialize with system message for coach context
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '0',
        role: 'system',
        content: specialMode === 'cocon' ? 
          `Vous êtes le coach bien-être dédié à l'espace Cocon pour les collaborateurs en entreprise. Votre objectif est d'aider à gérer le stress professionnel, améliorer l'équilibre travail-vie personnelle, et renforcer la résilience. Apportez des conseils spécifiques au contexte professionnel.` : 
          `Vous êtes un coach bien-être émotionnel. Votre objectif est d'aider l'utilisateur à comprendre ses émotions, à développer des stratégies pour gérer le stress et l'anxiété, et à améliorer son bien-être général.`,
        timestamp: new Date()
      },
      {
        id: '1',
        role: 'assistant',
        content: specialMode === 'cocon' ? 
          `Bonjour et bienvenue dans l'espace Cocon, votre ressource bien-être en entreprise. Je suis ici pour vous aider à gérer votre stress professionnel et à trouver un meilleur équilibre. Comment puis-je vous accompagner aujourd'hui?` : 
          `Bonjour! Je suis votre coach bien-être émotionnel. Je suis là pour vous aider à naviguer vos émotions et à développer des stratégies pour améliorer votre bien-être. Comment vous sentez-vous aujourd'hui?`,
        timestamp: new Date()
      }
    ];
    
    setMessages(initialMessages);
  }, [specialMode]);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to fetch conversations
        // For now, we'll create mock data
        const mockConversations: Conversation[] = [
          {
            id: '1',
            title: 'Gestion du stress',
            lastMessage: 'Voici quelques techniques de respiration qui pourraient vous aider...',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
          },
          {
            id: '2',
            title: 'Améliorer mon sommeil',
            lastMessage: 'Essayez de maintenir une routine régulière avant de vous coucher.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
          },
          {
            id: '3',
            title: 'Méditation guidée',
            lastMessage: 'Comment s\'est passée votre séance de méditation hier?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) // 14 days ago
          }
        ];
        
        setConversations(mockConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Erreur lors du chargement des conversations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: newMessage,
        timestamp: new Date()
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage('');
      setIsProcessing(true);
      
      // Prepare conversation history for OpenAI
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add system message
      const systemMessage = messages.find(msg => msg.role === 'system');
      const fullConversation = [
        { role: 'system', content: systemMessage?.content || 'You are a helpful assistant.' },
        ...conversationHistory,
        { role: 'user', content: newMessage }
      ];
      
      // Get AI response
      const response = await chatCompletion(fullConversation);
      
      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // If this is a new conversation, create it
        if (!activeConversation) {
          // Extract title from first user message
          const title = newMessage.length > 30 ? 
            `${newMessage.substring(0, 30)}...` : 
            newMessage;
          
          const newConversation: Conversation = {
            id: Date.now().toString(),
            title,
            lastMessage: response,
            timestamp: new Date()
          };
          
          setConversations([newConversation, ...conversations]);
          setActiveConversation(newConversation);
        } else {
          // Update conversation
          const updatedConversations = conversations.map(conv => 
            conv.id === activeConversation.id ? 
              { ...conv, lastMessage: response, timestamp: new Date() } : 
              conv
          );
          
          setConversations(updatedConversations);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    
    // In a real app, this would fetch messages for the selected conversation
    // For now, we'll reset to initial messages
    const initialMessages: Message[] = [
      {
        id: '0',
        role: 'system',
        content: specialMode === 'cocon' ? 
          `Vous êtes le coach bien-être dédié à l'espace Cocon pour les collaborateurs en entreprise. Votre objectif est d'aider à gérer le stress professionnel, améliorer l'équilibre travail-vie personnelle, et renforcer la résilience. Apportez des conseils spécifiques au contexte professionnel. Le sujet de la conversation est: ${conversation.title}` : 
          `Vous êtes un coach bien-être émotionnel. Votre objectif est d'aider l'utilisateur à comprendre ses émotions, à développer des stratégies pour gérer le stress et l'anxiété, et à améliorer son bien-être général. Le sujet de la conversation est: ${conversation.title}`,
        timestamp: new Date()
      },
      {
        id: '1',
        role: 'user',
        content: `J'aimerais discuter de ${conversation.title.toLowerCase()}.`,
        timestamp: conversation.timestamp
      },
      {
        id: '2',
        role: 'assistant',
        content: conversation.lastMessage || `Bien sûr, je serais ravi de vous aider avec ${conversation.title.toLowerCase()}. Comment puis-je vous accompagner?`,
        timestamp: new Date(conversation.timestamp.getTime() + 1000 * 60) // 1 minute later
      }
    ];
    
    setMessages(initialMessages);
  };
  
  const handleCreateNewConversation = () => {
    setActiveConversation(null);
    
    // Reset to initial messages
    const initialMessages: Message[] = [
      {
        id: '0',
        role: 'system',
        content: specialMode === 'cocon' ? 
          `Vous êtes le coach bien-être dédié à l'espace Cocon pour les collaborateurs en entreprise. Votre objectif est d'aider à gérer le stress professionnel, améliorer l'équilibre travail-vie personnelle, et renforcer la résilience. Apportez des conseils spécifiques au contexte professionnel.` : 
          `Vous êtes un coach bien-être émotionnel. Votre objectif est d'aider l'utilisateur à comprendre ses émotions, à développer des stratégies pour gérer le stress et l'anxiété, et à améliorer son bien-être général.`,
        timestamp: new Date()
      },
      {
        id: '1',
        role: 'assistant',
        content: specialMode === 'cocon' ? 
          `Bonjour et bienvenue dans l'espace Cocon, votre ressource bien-être en entreprise. Je suis ici pour vous aider à gérer votre stress professionnel et à trouver un meilleur équilibre. Comment puis-je vous accompagner aujourd'hui?` : 
          `Bonjour! Je suis votre coach bien-être émotionnel. Je suis là pour vous aider à naviguer vos émotions et à développer des stratégies pour améliorer votre bien-être. Comment vous sentez-vous aujourd'hui?`,
        timestamp: new Date()
      }
    ];
    
    setMessages(initialMessages);
  };
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatConversationDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Aujourd\'hui';
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <UnifiedLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col md:flex-row">
        {/* Sidebar for conversation history */}
        <div className="w-full md:w-80 overflow-y-auto border-r hidden md:block">
          <div className="p-4 space-y-4">
            <Button 
              className="w-full"
              onClick={handleCreateNewConversation}
            >
              Nouvelle conversation
            </Button>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Conversations récentes</h3>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div className="space-y-1">
                  {conversations.map(conversation => (
                    <div 
                      key={conversation.id} 
                      className={`rounded-md p-3 cursor-pointer hover:bg-accent transition-colors ${activeConversation?.id === conversation.id ? 'bg-accent' : ''}`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">{conversation.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatConversationDate(conversation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage || 'Nouvelle conversation'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Aucune conversation récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile conversation selector */}
        <div className="md:hidden p-4 border-b">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => document.getElementById('mobile-conversations')?.showModal()}
          >
            {activeConversation ? activeConversation.title : 'Nouvelle conversation'}
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <dialog id="mobile-conversations" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Conversations</h3>
              <div className="space-y-2 mt-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    handleCreateNewConversation();
                    document.getElementById('mobile-conversations')?.close();
                  }}
                >
                  Nouvelle conversation
                </Button>
                
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id} 
                    className="rounded-md p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => {
                      handleSelectConversation(conversation);
                      document.getElementById('mobile-conversations')?.close();
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium truncate">{conversation.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatConversationDate(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage || 'Nouvelle conversation'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs for different functionalities */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-16">
                <TabsTrigger value="chat">
                  <Brain className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Coach IA</span>
                </TabsTrigger>
                <TabsTrigger value="progress">
                  <BarChart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Progrès</span>
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <Clipboard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Ressources</span>
                </TabsTrigger>
                {specialMode === 'cocon' && (
                  <TabsTrigger value="workshops">
                    <Video className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Ateliers</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages
                  .filter(message => message.role !== 'system') // Don't show system messages
                  .map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
                          message.role === 'user' ? 
                          'bg-primary text-primary-foreground' : 
                          'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div 
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 
                            'text-primary-foreground/70' : 
                            'text-muted-foreground'
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                }
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] md:max-w-[70%] rounded-lg p-3 bg-muted">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Textarea 
                    placeholder="Posez une question à votre coach bien-être..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-[60px] resize-none"
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isProcessing || !newMessage.trim()}
                    className="h-full"
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Envoyer</span>
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <div>
                    {specialMode === 'cocon' ? 
                      'Coach bien-être professionnel' : 
                      'Assistant personnel bien-être émotionnel'}
                  </div>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="flex-1 overflow-auto p-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Suivi de votre bien-être</h2>
                
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Aperçu de vos progrès</CardTitle>
                    <CardDescription>Évolution sur les 30 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(progresses).map(([key, value]) => (
                      <div key={key} className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="capitalize">{key}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              value > 70 ? 'bg-green-500' : 
                              value > 50 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-2xl font-bold text-green-500">+12%</h3>
                        <p className="text-sm text-muted-foreground">Amélioration du sommeil</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-2xl font-bold text-amber-500">-8%</h3>
                        <p className="text-sm text-muted-foreground">Niveau de stress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <h3 className="text-xl font-semibold mb-4">Objectifs de bien-être</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { 
                      title: 'Méditation quotidienne', 
                      description: '10 minutes par jour', 
                      progress: 80,
                      streak: 5
                    },
                    { 
                      title: 'Journal émotionnel', 
                      description: 'Écrire 3 fois par semaine', 
                      progress: 66,
                      streak: 2
                    },
                    { 
                      title: 'Exercices de respiration', 
                      description: 'Matin et soir', 
                      progress: 50,
                      streak: 1
                    },
                    { 
                      title: 'Améliorer le sommeil', 
                      description: '7h par nuit', 
                      progress: 60,
                      streak: 3
                    }
                  ].map((goal, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <Badge variant="outline" className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
                            {goal.streak} jours
                          </Badge>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">Progrès</span>
                            <span className="text-sm font-medium">{goal.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div 
                              className={`h-full rounded-full ${
                                goal.progress > 70 ? 'bg-green-500' : 
                                goal.progress > 50 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`} 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Mettre à jour les objectifs
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="flex-1 overflow-auto p-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Ressources bien-être</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Exercices de respiration</CardTitle>
                        <Badge>Recommandé</Badge>
                      </div>
                      <CardDescription>Techniques de respiration pour réduire le stress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        Découvrez des exercices de respiration simples mais efficaces pour apaiser 
                        votre esprit et réduire le stress rapidement.
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>5-10 minutes</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Voir les exercices
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Journal de gratitude</CardTitle>
                      <CardDescription>Cultivez une attitude positive au quotidien</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        Apprenez à tenir un journal de gratitude pour recentrer votre attention sur 
                        les aspects positifs de votre vie.
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>5 minutes par jour</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Explorer la méthode
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Bibliothèque de méditations guidées</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    {
                      title: 'Méditation du matin',
                      duration: '10 min',
                      level: 'Débutant'
                    },
                    {
                      title: 'Réduction du stress',
                      duration: '15 min',
                      level: 'Intermédiaire'
                    },
                    {
                      title: 'Sommeil réparateur',
                      duration: '20 min',
                      level: 'Tous niveaux'
                    }
                  ].map((meditation, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div 
                        className="h-40 bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(https://source.unsplash.com/random/300x200?meditation&sig=${index})` 
                        }}
                      ></div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{meditation.title}</h4>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className="text-muted-foreground">{meditation.duration}</span>
                          <Badge variant="outline">{meditation.level}</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" className="w-full">
                          Écouter
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {specialMode === 'cocon' && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Ressources spécifiques à l'entreprise</h3>
                    
                    <div className="space-y-4 mb-6">
                      <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Guide de gestion du stress au travail</h4>
                            <p className="text-sm text-muted-foreground">PDF, 24 pages</p>
                          </div>
                          <Button variant="outline" size="sm">Télécharger</Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Programme d'équilibre travail-vie personnelle</h4>
                            <p className="text-sm text-muted-foreground">Présentation, 18 slides</p>
                          </div>
                          <Button variant="outline" size="sm">Télécharger</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
                
                <Button variant="outline" className="w-full">
                  Voir toutes les ressources
                </Button>
              </div>
            </TabsContent>
            
            {specialMode === 'cocon' && (
              <TabsContent value="workshops" className="flex-1 overflow-auto p-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Ateliers et Webinaires</h2>
                  
                  <div className="space-y-6 mb-8">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Gérer le stress en période d'intense activité</CardTitle>
                            <CardDescription>Webinaire en direct</CardDescription>
                          </div>
                          <Badge className="bg-green-500">À venir</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p>
                          Apprenez des techniques concrètes pour gérer votre stress lors des périodes 
                          d'intense activité professionnelle. Notre expert en gestion du stress partagera 
                          des méthodes pratiques et efficaces.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>15 juin 2025, 14h00-15h30</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>Dr. Sophie Martin, Psychologue du travail</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          S'inscrire au webinaire
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Atelier de méditation en équipe</CardTitle>
                            <CardDescription>Session en présentiel</CardDescription>
                          </div>
                          <Badge variant="outline">Places limitées</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p>
                          Participez à un atelier de méditation spécialement conçu pour les équipes professionnelles. 
                          Apprenez des techniques simples à pratiquer ensemble pour renforcer la cohésion et réduire le stress collectif.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>22 juin 2025, 12h30-13h30</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>Salle Zen, Bâtiment B</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          Réserver ma place
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Ateliers passés</h3>
                  
                  <div className="space-y-4 mb-8">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Équilibre vie pro-vie perso : les clés du succès</h4>
                            <p className="text-sm text-muted-foreground">Webinaire, 5 mai 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Revoir</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Techniques de respiration anti-stress</h4>
                            <p className="text-sm text-muted-foreground">Atelier, 12 avril 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Revoir</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline">
                      Proposer un thème d'atelier
                    </Button>
                    <Button>
                      Voir tous les ateliers
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default CoachPage;

// Helper component for workshop
const MapPin = (props: React.ComponentProps<typeof Brain>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
};
