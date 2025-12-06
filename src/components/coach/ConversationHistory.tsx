
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageCircle, Calendar, Search, Star, Archive } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  date: string;
  messageCount: number;
  topic: string;
  rating?: number;
  isArchived?: boolean;
}

interface ConversationHistoryProps {
  onSelectConversation?: (conversationId: string) => void;
  className?: string;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  onSelectConversation,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Gestion du stress au travail',
      date: '2024-01-15',
      messageCount: 24,
      topic: 'stress',
      rating: 5
    },
    {
      id: '2',
      title: 'Techniques de relaxation',
      date: '2024-01-14',
      messageCount: 18,
      topic: 'relaxation',
      rating: 4
    },
    {
      id: '3',
      title: 'Améliorer mon sommeil',
      date: '2024-01-12',
      messageCount: 15,
      topic: 'sommeil'
    },
    {
      id: '4',
      title: 'Confiance en soi',
      date: '2024-01-10',
      messageCount: 32,
      topic: 'confiance',
      rating: 5,
      isArchived: true
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTopicColor = (topic: string) => {
    const colors: Record<string, string> = {
      'stress': 'bg-red-100 text-red-800',
      'relaxation': 'bg-blue-100 text-blue-800',
      'sommeil': 'bg-purple-100 text-purple-800',
      'confiance': 'bg-green-100 text-green-800'
    };
    return colors[topic] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Historique des Conversations
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                conversation.isArchived ? 'opacity-60' : ''
              }`}
              onClick={() => onSelectConversation?.(conversation.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm truncate pr-2">
                  {conversation.title}
                </h4>
                {conversation.isArchived && (
                  <Archive className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${getTopicColor(conversation.topic)}`}>
                  {conversation.topic}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(conversation.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {conversation.messageCount} messages
                </span>
                {renderStars(conversation.rating)}
              </div>
            </div>
          ))}
        </div>
        
        {filteredConversations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune conversation trouvée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationHistory;
