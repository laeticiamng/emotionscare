
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, User, PlusCircle, HistoryIcon, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  isTyping?: boolean;
}

interface ConversationTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const mockConversationTopics: ConversationTopic[] = [
  {
    id: '1',
    title: 'Gestion du stress',
    description: 'Techniques et conseils pour mieux gérer le stress quotidien',
    icon: <Sparkles className="h-6 w-6 text-blue-500" />
  },
  {
    id: '2',
    title: 'Équilibre vie pro/perso',
    description: 'Trouver le bon équilibre entre vie professionnelle et personnelle',
    icon: <User className="h-6 w-6 text-purple-500" />
  },
  {
    id: '3',
    title: 'Motivation et objectifs',
    description: 'Techniques pour rester motivé et atteindre vos objectifs',
    icon: <ThumbsUp className="h-6 w-6 text-green-500" />
  }
];

const CoachPage: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd'hui ?",
      sender: 'coach',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<{ id: string, title: string, preview: string, unread: boolean }[]>([
    { id: 'main', title: 'Conversation principale', preview: 'Bonjour ! Je suis votre coach...', unread: false }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simuler la réponse du coach
    setIsTyping(true);
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getCoachResponse(inputValue),
        sender: 'coach',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const getCoachResponse = (userInput: string): string => {
    const userMessage = userInput.toLowerCase();
    
    if (userMessage.includes('bonjour') || userMessage.includes('salut')) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    }
    
    if (userMessage.includes('stress') || userMessage.includes('anxiété')) {
      return "Le stress peut être difficile à gérer. Avez-vous essayé des techniques de respiration profonde ? Je peux vous guider à travers un exercice simple qui pourrait vous aider.";
    }
    
    if (userMessage.includes('travail') || userMessage.includes('job') || userMessage.includes('emploi')) {
      return "Les défis professionnels peuvent être exigeants. Pouvez-vous me dire plus précisément ce qui vous préoccupe dans votre environnement de travail ?";
    }
    
    if (userMessage.includes('fatigue') || userMessage.includes('épuisé') || userMessage.includes('dormir')) {
      return "La fatigue peut affecter de nombreux aspects de notre vie. Avez-vous remarqué des changements dans vos habitudes de sommeil ou votre routine quotidienne ?";
    }
    
    if (userMessage.includes('merci')) {
      return "Je vous en prie ! N'hésitez pas à revenir si vous avez d'autres questions ou préoccupations.";
    }
    
    return "Merci de partager cela avec moi. Pouvez-vous m'en dire plus pour que je puisse mieux vous aider ?";
  };
  
  const handleTopicSelect = (topicId: string) => {
    const topic = mockConversationTopics.find(t => t.id === topicId);
    if (!topic) return;
    
    // Ajouter un message du coach pour commencer la conversation sur ce sujet
    const coachMessage: Message = {
      id: Date.now().toString(),
      content: `Parlons de ${topic.title.toLowerCase()}. ${topic.description}. Qu'est-ce qui vous intéresse particulièrement à ce sujet ?`,
      sender: 'coach',
      timestamp: new Date()
    };
    
    setMessages([coachMessage]);
    toast({
      title: `Conversation sur ${topic.title}`,
      description: "Une nouvelle conversation a été démarrée",
    });
  };
  
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: `Conversation ${conversations.length + 1}`,
      preview: 'Nouvelle conversation',
      unread: false
    };
    
    setConversations([...conversations, newConversation]);
    setSelectedConversation(newConversation.id);
    setMessages([{
      id: '1',
      content: "Bonjour ! Comment puis-je vous aider dans cette nouvelle conversation ?",
      sender: 'coach',
      timestamp: new Date()
    }]);
    
    toast({
      title: "Nouvelle conversation",
      description: "Une nouvelle conversation a été créée",
    });
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Coach IA personnel</h1>
        <p className="text-muted-foreground">Discutez avec votre coach IA pour obtenir des conseils et du soutien</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sujets populaires</CardTitle>
              <CardDescription>Commencez une conversation guidée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockConversationTopics.map((topic) => (
                <Button
                  key={topic.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <div className="mr-3">{topic.icon}</div>
                  <div className="text-left">
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">{topic.description}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Historique
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={createNewConversation}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-1">
                {conversations.map(conv => (
                  <Button
                    key={conv.id}
                    variant={selectedConversation === conv.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto py-2"
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center w-full">
                        <span className="font-medium">{conv.title}</span>
                        {conv.unread && <Badge className="ml-auto">Nouveau</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full">{conv.preview}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Coach IA</CardTitle>
                  <CardDescription>En ligne</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 flex-grow overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-3",
                          msg.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {msg.content}
                      </motion.div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted max-w-[80%] rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce animation-delay-200" />
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce animation-delay-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex-shrink-0 border-t pt-3">
              <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
                <Input
                  placeholder="Écrivez votre message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="resources">
          <TabsList>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exercices de respiration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Techniques de respiration pour réduire le stress et améliorer le bien-être.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast({
                    title: "Exercices de respiration",
                    description: "Cette ressource sera disponible prochainement"
                  })}>
                    Accéder
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Méditations guidées</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Séances de méditation pour la relaxation et la pleine conscience.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast({
                    title: "Méditations guidées",
                    description: "Cette ressource sera disponible prochainement"
                  })}>
                    Accéder
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Articles bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Collection d'articles sur divers aspects du bien-être émotionnel.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast({
                    title: "Articles bien-être",
                    description: "Cette ressource sera disponible prochainement"
                  })}>
                    Accéder
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du coach</CardTitle>
                <CardDescription>Personnalisez votre expérience avec le coach IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Les paramètres de personnalisation seront disponibles prochainement.
                </p>
                <Button onClick={() => toast({
                  title: "Paramètres",
                  description: "Cette fonctionnalité sera disponible prochainement"
                })}>
                  Activer la personnalisation avancée
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>Donnez-nous votre avis sur le coach IA</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toast({
                    title: "Feedback positif",
                    description: "Merci pour votre retour positif !"
                  })}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Utile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toast({
                    title: "Feedback négatif",
                    description: "Merci de nous aider à améliorer notre service !"
                  })}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  À améliorer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoachPage;
