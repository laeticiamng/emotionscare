
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
  tags: string[];
  unread?: boolean;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Stress au travail',
    lastMessage: "Voici quelques techniques pour gérer le stress au travail...",
    date: new Date('2023-03-15T14:30:00'),
    tags: ['stress', 'travail'],
    unread: true,
  },
  {
    id: '2',
    title: 'Améliorer mon sommeil',
    lastMessage: "Pour améliorer votre sommeil, essayez ces habitudes...",
    date: new Date('2023-03-10T09:15:00'),
    tags: ['sommeil', 'détente'],
  },
  {
    id: '3',
    title: 'Techniques de méditation',
    lastMessage: "La méditation pleine conscience peut être pratiquée en...",
    date: new Date('2023-03-05T16:45:00'),
    tags: ['méditation', 'pleine conscience'],
  },
];

const ChatHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 800);
  }, []);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Historique des conversations</h1>
          <p className="text-muted-foreground">
            Retrouvez et continuez vos échanges avec le coach IA
          </p>
        </div>
        <Button
          onClick={() => navigate('/coach-chat')}
          className="flex items-center gap-2"
        >
          <MessageSquare size={18} />
          <span>Nouvelle conversation</span>
        </Button>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Rechercher par titre ou tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredConversations.length > 0 ? (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${
                conversation.unread ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => navigate(`/coach-chat?conversation=${conversation.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{conversation.title}</h3>
                    {conversation.unread && (
                      <Badge variant="secondary">Nouveau</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(conversation.date)}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {conversation.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">Aucune conversation trouvée</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Aucune conversation ne correspond à votre recherche."
              : "Vous n'avez pas encore de conversations."}
          </p>
          <Button onClick={() => navigate('/coach-chat')}>
            Démarrer une nouvelle conversation
          </Button>
        </div>
      )}
    </div>
  );
};

export default function WrappedChatHistoryPage() {
  return (
    <ProtectedLayoutWrapper>
      <ChatHistoryPage />
    </ProtectedLayoutWrapper>
  );
}
