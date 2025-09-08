import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Mic, MicOff, Bot, User, Heart, Brain, Lightbulb, BookOpen, Music, Dumbbell, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMood } from '@/contexts/MoodContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
  techniques?: string[];
  resources?: Array<{type: string, title: string, description: string}>;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const B2CAICoachPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [coachPersonality, setCoachPersonality] = useState('empathetic');

  const personalities = [
    { id: 'empathetic', name: 'Empathique', icon: '❤️', description: 'Écoute bienveillante' },
    { id: 'analytical', name: 'Analytique', icon: '🧠', description: 'Approche structurée' },
    { id: 'motivational', name: 'Motivant', icon: '⚡', description: 'Énergie positive' },
    { id: 'mindful', name: 'Mindful', icon: '🧘', description: 'Pleine conscience' }
  ];

  useEffect(() => {
    loadConversations();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        const formattedConversations = data.map(conv => ({
          id: conv.id,
          title: conv.title,
          lastMessage: '',
          timestamp: new Date(conv.last_message_at),
          messageCount: conv.message_count
        }));
        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          role: msg.sender as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          emotion: msg.message_type
        }));
        setMessages(formattedMessages);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une conversation",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('coach_conversations')
        .insert({
          title: 'Nouvelle conversation',
          coach_mode: coachPersonality,
          user_id: userData.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setCurrentConversationId(data.id);
        setMessages([]);
        await loadConversations();
        
        // Message de bienvenue
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Bonjour ! Je suis votre coach IA ${personalities.find(p => p.id === coachPersonality)?.name}. Je suis là pour vous accompagner dans votre bien-être. Comment vous sentez-vous aujourd'hui ?`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Erreur création conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Sauvegarder le message utilisateur
      if (currentConversationId) {
        await supabase.from('coach_messages').insert({
          conversation_id: currentConversationId,
          sender: 'user',
          content: userMessage.content
        });
      }

      // Appeler l'IA pour la réponse
      const { data, error } = await supabase.functions.invoke('ai-coach-response', {
        body: {
          message: input,
          conversationHistory: messages.slice(-6).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          coachPersonality,
          userEmotion: currentMood?.valence > 0.6 ? 'positive' : 
                       currentMood?.valence < 0.4 ? 'negative' : 'neutral'
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        emotion: data.emotion,
        techniques: data.techniques,
        resources: data.resources
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Sauvegarder la réponse du coach
      if (currentConversationId) {
        await supabase.from('coach_messages').insert({
          conversation_id: currentConversationId,
          sender: 'assistant',
          content: assistantMessage.content,
          message_type: data.emotion
        });

        // Mettre à jour la conversation
        await supabase
          .from('coach_conversations')
          .update({
            last_message_at: new Date().toISOString(),
            message_count: messages.length + 2
          })
          .eq('id', currentConversationId);
      }

    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast({
        title: "Erreur de communication",
        description: "Je n'ai pas pu traiter votre message. Réessayez dans un moment.",
        variant: "destructive"
      });

      // Message d'erreur empathique
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Je rencontre un petit problème technique. Prenez un moment pour respirer, je serai bientôt de retour pour vous accompagner.",
        timestamp: new Date(),
        techniques: [
          "Inspirez profondément pendant 4 secondes",
          "Retenez votre souffle 4 secondes", 
          "Expirez lentement pendant 6 secondes"
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await supabase
        .from('coach_conversations')
        .delete()
        .eq('id', conversationId);
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
      
      await loadConversations();
      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur suppression conversation:', error);
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = () => {
        toast({
          title: "Erreur vocale",
          description: "Impossible d'utiliser la reconnaissance vocale",
          variant: "destructive"
        });
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée sur ce navigateur",
        variant: "destructive"
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'méditation': return <Brain className="w-4 h-4" />;
      case 'exercice': return <Dumbbell className="w-4 h-4" />;
      case 'lecture': return <BookOpen className="w-4 h-4" />;
      case 'musique': return <Music className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Coach IA Personnel
              </h1>
              <p className="text-gray-300">Accompagnement intelligent pour votre bien-être</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 border-purple-500">
              IA Coaching
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Conversations et personnalités */}
          <div className="space-y-4">
            {/* Personnalités du coach */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Personnalité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalities.map(personality => (
                  <button
                    key={personality.id}
                    onClick={() => setCoachPersonality(personality.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      coachPersonality === personality.id
                        ? 'bg-purple-500/30 border border-purple-400 text-white'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{personality.icon}</span>
                      <div>
                        <div className="font-medium">{personality.name}</div>
                        <div className="text-xs opacity-70">{personality.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Conversations */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Conversations</CardTitle>
                <Button onClick={createNewConversation} size="sm" variant="outline" className="bg-transparent border-cyan-500 text-cyan-300">
                  Nouvelle
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {conversations.map(conv => (
                  <div key={conv.id} className="group relative">
                    <button
                      onClick={() => loadConversationMessages(conv.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        currentConversationId === conv.id
                          ? 'bg-cyan-500/30 border border-cyan-400 text-white'
                          : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm truncate">{conv.title}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {conv.messageCount} messages
                      </div>
                    </button>
                    <Button
                      onClick={() => deleteConversation(conv.id)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucune conversation</p>
                    <p className="text-xs">Commencez votre premier échange!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Zone de chat principale */}
          <div className="lg:col-span-3">
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  {personalities.find(p => p.id === coachPersonality)?.name} Coach
                  {messages.length > 0 && (
                    <Badge variant="outline" className="ml-auto bg-transparent border-cyan-500 text-cyan-300">
                      {messages.length} messages
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium mb-2">Commencez une conversation</h3>
                        <p className="text-sm">Votre coach IA est là pour vous accompagner dans votre parcours de bien-être</p>
                        <Button onClick={createNewConversation} className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500">
                          Démarrer une conversation
                        </Button>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                            <div className={`flex items-center gap-2 mb-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                              {message.role === 'assistant' && <Bot className="w-4 h-4 text-cyan-400" />}
                              {message.role === 'user' && <User className="w-4 h-4 text-purple-400" />}
                              <span className="text-xs text-gray-400">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <div className={`rounded-lg p-4 ${
                              message.role === 'user' 
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                                : 'bg-gray-800/80 text-gray-100 border border-gray-700'
                            }`}>
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              
                              {/* Techniques et ressources pour les messages du coach */}
                              {message.role === 'assistant' && message.techniques && message.techniques.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <Separator className="bg-gray-600" />
                                  <div>
                                    <h4 className="text-sm font-medium text-cyan-300 mb-2">💡 Techniques suggérées:</h4>
                                    <ul className="text-sm space-y-1">
                                      {message.techniques.map((technique, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <span className="text-cyan-400">•</span>
                                          <span>{technique}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {message.role === 'assistant' && message.resources && message.resources.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <Separator className="bg-gray-600" />
                                  <div>
                                    <h4 className="text-sm font-medium text-green-300 mb-2">📚 Ressources recommandées:</h4>
                                    <div className="space-y-2">
                                      {message.resources.map((resource, index) => (
                                        <div key={index} className="flex items-start gap-2 p-2 bg-gray-700/50 rounded">
                                          {getResourceIcon(resource.type)}
                                          <div>
                                            <div className="text-sm font-medium">{resource.title}</div>
                                            <div className="text-xs text-gray-400">{resource.description}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-cyan-400" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Zone de saisie */}
              {currentConversationId && (
                <div className="border-t border-gray-700 p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Partagez vos pensées, vos émotions, vos défis..."
                        className="min-h-[60px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={startVoiceRecognition}
                        disabled={isListening}
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-300"
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CAICoachPage;