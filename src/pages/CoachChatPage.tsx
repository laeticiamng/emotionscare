
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowLeft, MenuSquare, RotateCw } from 'lucide-react';

// Mocked coach details
const coach = {
  name: 'Coach Emma',
  avatar: '/coach-avatar.png',
};

// Message interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

// Initial greeting message from coach
const initialMessages: Message[] = [
  {
    id: '1',
    content: "Bonjour ! Je suis Emma, votre coach IA de bien-être émotionnel. Comment puis-je vous aider aujourd'hui ?",
    sender: 'coach',
    timestamp: new Date(),
  },
];

const CoachChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('conversation');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');

    // Simulate coach typing
    setIsTyping(true);
    setTimeout(() => {
      // Generate coach response based on user message
      let response: string;
      
      if (newMessage.toLowerCase().includes('stress') || newMessage.toLowerCase().includes('anxiété')) {
        response = "Le stress et l'anxiété sont des réactions normales, mais peuvent devenir problématiques. Avez-vous essayé des techniques de respiration profonde ou de méditation ? Je peux vous guider à travers quelques exercices simples.";
      } else if (newMessage.toLowerCase().includes('dormir') || newMessage.toLowerCase().includes('sommeil')) {
        response = "Les problèmes de sommeil peuvent affecter votre bien-être émotionnel. Essayez d'établir une routine régulière avant de vous coucher, limitez les écrans et créez un environnement propice au sommeil. Souhaitez-vous des conseils plus spécifiques ?";
      } else if (newMessage.toLowerCase().includes('travail') || newMessage.toLowerCase().includes('collègue')) {
        response = "Les relations au travail peuvent être complexes. Il est important de maintenir une communication ouverte et d'établir des limites saines. Pouvez-vous me décrire plus précisément la situation ?";
      } else {
        response = "Merci de partager cela avec moi. Comment vous sentez-vous par rapport à cette situation ? Y a-t-il des aspects particuliers sur lesquels vous aimeriez travailler ensemble ?";
      }

      // Add coach response
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        content: response,
        sender: 'coach',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, coachMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Start a new conversation
  const handleNewConversation = () => {
    toast({
      title: 'Nouvelle conversation',
      description: 'Une nouvelle conversation a été démarrée',
    });
    setMessages(initialMessages);
    navigate('/coach-chat');
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/coach')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={coach.avatar} alt={coach.name} />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-lg leading-none">{coach.name}</h2>
            <p className="text-xs text-muted-foreground">Coach IA de bien-être</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleNewConversation}>
            <MenuSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-secondary">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Saisissez votre message ici..."
            className="flex-1 min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isTyping || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function WrappedCoachChatPage() {
  return (
    <ProtectedLayoutWrapper>
      <CoachChatPage />
    </ProtectedLayoutWrapper>
  );
}
