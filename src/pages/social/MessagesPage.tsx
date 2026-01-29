import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Heart,
  Brain,
  Zap,
  Sparkles,
  Mic,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  content: string;
  timestamp: string;
  emotion?: string;
}

const STORAGE_KEY = 'nyvee-chat-messages';

const aiResponses = [
  "Je comprends ce que vous ressentez. Avez-vous essayé de prendre quelques respirations profondes ?",
  "C'est tout à fait normal de ressentir cela. Voulez-vous qu'on explore ensemble des techniques de relaxation ?",
  "Merci de partager cela avec moi. Je suis là pour vous écouter et vous accompagner.",
  "Votre bien-être est important. Que diriez-vous d'une courte session de méditation guidée ?",
  "Je perçois une certaine tension dans vos mots. Souhaitez-vous qu'on travaille sur des exercices de gestion du stress ?",
  "C'est courageux de votre part d'exprimer vos émotions. Comment puis-je vous aider davantage ?",
];

const detectEmotion = (text: string): string => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('stress') || lowerText.includes('anxieux') || lowerText.includes('inquiet')) return 'Anxieux';
  if (lowerText.includes('triste') || lowerText.includes('déprimé') || lowerText.includes('mal')) return 'Triste';
  if (lowerText.includes('content') || lowerText.includes('heureux') || lowerText.includes('bien')) return 'Heureux';
  if (lowerText.includes('colère') || lowerText.includes('énervé') || lowerText.includes('frustré')) return 'Frustré';
  if (lowerText.includes('fatigué') || lowerText.includes('épuisé')) return 'Fatigué';
  return 'Neutre';
};

const MessagesPage: React.FC = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedMood, setDetectedMood] = useState('Neutre');
  const [conversationTopics, setConversationTopics] = useState<string[]>(['Bienvenue']);

  const defaultMessages: Message[] = [
    {
      id: 1,
      sender: 'ai',
      content: 'Bonjour ! Je suis Nyvée, votre assistant IA émotionnel. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const emotion = detectEmotion(message);
    setDetectedMood(emotion);
    
    // Extract topics
    const words = message.toLowerCase().split(' ');
    const topicKeywords = ['travail', 'stress', 'famille', 'santé', 'sommeil', 'sport', 'méditation', 'anxiété', 'joie'];
    const newTopics = words.filter(w => topicKeywords.includes(w));
    if (newTopics.length > 0) {
      setConversationTopics(prev => [...new Set([...prev, ...newTopics])].slice(-5));
    }

    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      emotion,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const clearConversation = () => {
    setMessages(defaultMessages);
    setConversationTopics(['Bienvenue']);
    setDetectedMood('Neutre');
    toast({ title: 'Conversation effacée', description: 'L\'historique a été réinitialisé.' });
  };

  const exportConversation = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'Vous' : 'Nyvée'}: ${m.content}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-nyvee-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exporté', description: 'Conversation téléchargée.' });
  };

  const quickActions = [
    { label: 'Comment je me sens', icon: Heart, color: 'text-red-500' },
    { label: 'Besoin de motivation', icon: Zap, color: 'text-yellow-500' },
    { label: 'Gestion du stress', icon: Brain, color: 'text-blue-500' },
    { label: 'Techniques relaxation', icon: Sparkles, color: 'text-purple-500' }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Heureux': return 'text-green-500';
      case 'Triste': return 'text-blue-500';
      case 'Anxieux': return 'text-yellow-500';
      case 'Frustré': return 'text-red-500';
      case 'Fatigué': return 'text-gray-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Messages avec Nyvée</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
            <Bot className="h-3 w-3 mr-1" />
            IA Active
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Conversez avec votre assistant IA émotionnel personnel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Zone de chat principale */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Nyvée</div>
                  <div className="text-sm text-muted-foreground">Assistant IA Émotionnel</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="icon" onClick={exportConversation} title="Exporter">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={clearConversation} title="Effacer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Zone des messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={msg.sender === 'user' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-primary text-primary-foreground'}>
                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[70%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 px-1 flex items-center gap-2 justify-end">
                        {msg.timestamp}
                        {msg.emotion && msg.sender === 'user' && (
                          <Badge variant="outline" className="text-xs py-0">
                            {msg.emotion}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex gap-1">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Nyvée réfléchit...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Zone de saisie */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Tapez votre message à Nyvée..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Sujets de conversation suggérés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setMessage(action.label)}
                >
                  <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analyse de Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-sm font-medium mb-1">Humeur Détectée</div>
                <div className="flex items-center gap-2">
                  <Heart className={`h-4 w-4 ${getMoodColor(detectedMood)}`} />
                  <span className={`text-sm font-medium ${getMoodColor(detectedMood)}`}>{detectedMood}</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-sm font-medium mb-1">Sujets abordés</div>
                <div className="flex gap-1 flex-wrap">
                  {conversationTopics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs capitalize">{topic}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-sm font-medium mb-1">Statistiques</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Messages: {messages.length}</p>
                  <p>Session: {messages.filter(m => m.sender === 'user').length} échanges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;