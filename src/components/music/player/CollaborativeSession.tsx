/**
 * CollaborativeSession - Session collaborative avec Supabase Realtime
 * Écoute synchronisée en temps réel
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Share2, Music, MessageCircle, Crown, Volume2, Copy, Loader2 } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [joinCode, setJoinCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { state, play, pause, seek } = useMusic();
 const { currentTrack, isPlaying } = state;
  const { user } = useAuth();

  // Subscribe to realtime channel
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase.channel(`music-session-${sessionId}`)
      .on('broadcast', { event: 'track_change' }, (payload) => {
        // Host changed track - sync all clients
        if (!isHost && payload.payload?.track) {
          play(payload.payload.track);
          toast.info(`🎵 Nouveau morceau: ${payload.payload.track.title}`);
        }
      })
      .on('broadcast', { event: 'playback_state' }, (payload) => {
        // Sync play/pause state
        if (!isHost) {
          if (payload.payload?.isPlaying) {
            play();
          } else {
            pause();
          }
        }
      })
      .on('broadcast', { event: 'seek' }, (payload) => {
        // Sync seek position
        if (!isHost && payload.payload?.time !== undefined) {
          seek(payload.payload.time);
        }
      })
      .on('broadcast', { event: 'chat' }, (payload) => {
        if (payload.payload?.message) {
          const msg: ChatMessage = {
            id: Date.now().toString(),
            userId: payload.payload.userId,
            userName: payload.payload.userName,
            message: payload.payload.message,
            timestamp: new Date(),
            type: 'message'
          };
          setMessages(prev => [...prev, msg]);
        }
      })
      .on('broadcast', { event: 'user_presence' }, (payload) => {
        if (payload.payload?.users) {
          setUsers(payload.payload.users);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, isHost, play, pause, seek]);

  // Broadcast track changes when host
  useEffect(() => {
    if (!sessionId || !isHost || !currentTrack) return;

    supabase.channel(`music-session-${sessionId}`).send({
      type: 'broadcast',
      event: 'track_change',
      payload: { track: currentTrack }
    });
  }, [sessionId, isHost, currentTrack]);

  // Broadcast play/pause state
  useEffect(() => {
    if (!sessionId || !isHost) return;

    supabase.channel(`music-session-${sessionId}`).send({
      type: 'broadcast',
      event: 'playback_state',
      payload: { isPlaying }
    });
  }, [sessionId, isHost, isPlaying]);

  const createSession = useCallback(async () => {
    setIsConnecting(true);
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    try {
      setSessionId(newSessionId);
      setIsHost(true);
      
      const currentUser: CollaborativeUser = {
        id: user?.id || 'host',
        name: user?.email?.split('@')[0] || 'Hôte',
        isHost: true,
        isListening: true,
        lastActivity: new Date()
      };
      setUsers([currentUser]);
      
      toast.success('Session créée !', {
        description: `Code: ${newSessionId.slice(-8)}`
      });
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const joinSession = useCallback(async (code: string) => {
    if (!code.trim()) {
      toast.error('Entrez un code de session');
      return;
    }
    
    setIsConnecting(true);
    try {
      // In real impl, would validate session exists
      setSessionId(code);
      setIsHost(false);
      
      const currentUser: CollaborativeUser = {
        id: user?.id || 'guest',
        name: user?.email?.split('@')[0] || 'Invité',
        isHost: false,
        isListening: true,
        lastActivity: new Date()
      };
      setUsers(prev => [...prev, currentUser]);
      
      // Broadcast join
      await supabase.channel(`music-session-${code}`).send({
        type: 'broadcast',
        event: 'user_presence',
        payload: { 
          action: 'join',
          user: currentUser
        }
      });
      
      toast.success('Connecté à la session !');
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const leaveSession = useCallback(() => {
    if (sessionId) {
      supabase.channel(`music-session-${sessionId}`).send({
        type: 'broadcast',
        event: 'user_presence',
        payload: { action: 'leave', userId: user?.id }
      });
    }
    
    setSessionId(null);
    setIsHost(false);
    setUsers([]);
    setMessages([]);
    toast.info('Vous avez quitté la session');
  }, [sessionId, user]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !sessionId) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || 'me',
      userName: user?.email?.split('@')[0] || 'Vous',
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    };
    
    setMessages(prev => [...prev, msg]);
    
    // Broadcast to others
    supabase.channel(`music-session-${sessionId}`).send({
      type: 'broadcast',
      event: 'chat',
      payload: {
        userId: msg.userId,
        userName: msg.userName,
        message: msg.message
      }
    });
    
    setNewMessage('');
  }, [newMessage, sessionId, user]);

  const copySessionCode = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId.slice(-8));
      toast.success('Code copié !');
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
            Écoutez de la musique en synchronisation avec vos amis via Supabase Realtime
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={createSession} 
              className="w-full"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Créer une session
            </Button>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Code de session..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => joinSession(joinCode)}
                disabled={isConnecting}
              >
                Rejoindre
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
            <p>🔗 Sessions en temps réel via Supabase Realtime</p>
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
          <span>Code: {sessionId.slice(-8)}</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copySessionCode}>
            <Copy className="h-3 w-3" />
          </Button>
          <Badge variant="secondary">{users.length} connecté(s)</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Piste actuelle partagée */}
        {currentTrack && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                {isPlaying && <Volume2 className="h-3 w-3 text-green-500 animate-pulse" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
              {isHost && (
                <Badge variant="outline" className="text-xs">Hôte</Badge>
              )}
            </div>
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Participants</h4>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={u.avatar} />
                  <AvatarFallback>{u.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{u.name}</span>
                    {u.isHost && <Crown className="h-3 w-3 text-yellow-500" />}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    u.isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  )} />
                  <span className="text-xs text-muted-foreground">
                    {u.isListening ? 'Écoute' : 'Absent'}
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
            {messages.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Aucun message. Commencez la conversation !
              </p>
            ) : (
              messages.map((msg) => (
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
              ))
            )}
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
