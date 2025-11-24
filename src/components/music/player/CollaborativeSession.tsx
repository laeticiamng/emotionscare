import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Share2, Music, MessageCircle, Crown, Volume2 } from 'lucide-react';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { cn } from '@/lib/utils';

interface CollaborativeUser {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  isListening: boolean;
  lastActivity: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'track_change' | 'user_join' | 'user_leave';
}

interface CollaborativeSessionProps {
  className?: string;
}

const CollaborativeSession: React.FC<CollaborativeSessionProps> = ({ className }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const { currentTrack, isPlaying } = useMusicCompat().state;

  // Simulation d'une session collaborative
  useEffect(() => {
    if (sessionId) {
      // Simulation d'utilisateurs connectés
      const mockUsers: CollaborativeUser[] = [
        {
          id: '1',
          name: 'Vous',
          isHost: isHost,
          isListening: true,
          lastActivity: new Date()
        },
        {
          id: '2',
          name: 'Marie L.',
          avatar: '/api/placeholder/32/32',
          isHost: false,
          isListening: true,
          lastActivity: new Date(Date.now() - 30000)
        },
        {
          id: '3',
          name: 'Tom K.',
          isHost: false,
          isListening: false,
          lastActivity: new Date(Date.now() - 120000)
        }
      ];
      
      setUsers(mockUsers);
      
      // Simulation de messages
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          userId: '2',
          userName: 'Marie L.',
          message: 'J\'adore cette ambiance ! 🎵',
          timestamp: new Date(Date.now() - 300000),
          type: 'message'
        },
        {
          id: '2',
          userId: '3',
          userName: 'Tom K.',
          message: 'Quelqu\'un a une recommandation pour du jazz ?',
          timestamp: new Date(Date.now() - 180000),
          type: 'message'
        }
      ];
      
      setMessages(mockMessages);
      setIsConnected(true);
    }
  }, [sessionId, isHost]);

  const createSession = () => {
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    setIsHost(true);
  };

  const joinSession = (id: string) => {
    setSessionId(id);
    setIsHost(false);
  };

  const leaveSession = () => {
    setSessionId(null);
    setIsHost(false);
    setUsers([]);
    setMessages([]);
    setIsConnected(false);
  };

  const sendMessage = () => {
    if (newMessage.trim() && sessionId) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: '1',
        userName: 'Vous',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'message'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!sessionId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session Collaborative
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Écoutez de la musique en synchronisation avec vos amis
          </p>
          
          <div className="space-y-3">
            <Button onClick={createSession} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Créer une session
            </Button>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Code de session..."
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => joinSession('demo-session')}
              >
                Rejoindre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Session Active
            {isHost && <Crown className="h-4 w-4 text-yellow-500" />}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={leaveSession}>
            Quitter
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>ID: {sessionId}</span>
          <Badge variant="secondary">{users.length} connectés</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Piste actuelle partagée */}
        {currentTrack && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                {isPlaying && <Volume2 className="h-3 w-3 text-green-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Participants</h4>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.isHost && (
                      <Crown className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    user.isListening ? 'bg-green-500' : 'bg-gray-400'
                  )} />
                  <span className="text-xs text-muted-foreground">
                    {user.isListening ? 'Écoute' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat en temps réel */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Chat</h4>
          
          <div className="h-32 overflow-y-auto space-y-2 p-2 border rounded-lg">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-primary">
                    {msg.userName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-muted-foreground">{msg.message}</p>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez un message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button size="sm" onClick={sendMessage}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborativeSession;
