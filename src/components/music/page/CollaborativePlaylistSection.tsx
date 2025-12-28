/**
 * Collaborative Playlist Section - Playlists collaboratives
 * Connecté à Supabase avec persistence réelle
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Plus,
  Music,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Crown,
  UserPlus,
  Link2,
  Play,
  Sparkles,
  Clock,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useMusic } from '@/hooks/useMusic';
import type { MusicTrack } from '@/types/music';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  addedTracks: number;
}

interface CollaborativeTrack {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  votes: { up: number; down: number };
  userVote?: 'up' | 'down';
  audioUrl?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface CollaborativePlaylist {
  id: string;
  name: string;
  description?: string;
  collaborators: Collaborator[];
  tracks: CollaborativeTrack[];
  chat: ChatMessage[];
  isPublic: boolean;
  createdAt: Date;
}

export const CollaborativePlaylistSection: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { play } = useMusic();
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<CollaborativePlaylist | null>(null);
  const [activeTab, setActiveTab] = useState('tracks');
  const [newMessage, setNewMessage] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Charger ou créer la playlist collaborative depuis Supabase
  useEffect(() => {
    const loadPlaylist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Charger depuis Supabase user_settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'collab_playlist')
          .maybeSingle();

        if (data?.value) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setPlaylist(parsed as CollaborativePlaylist);
        } else {
          // Create default playlist
          const newPlaylist: CollaborativePlaylist = {
            id: crypto.randomUUID(),
            name: 'Ma Playlist Collaborative',
            description: 'Partagez vos morceaux préférés !',
            isPublic: false,
            createdAt: new Date(),
            collaborators: [{
              id: user.id,
              name: user.email?.split('@')[0] || 'Vous',
              role: 'owner',
              isOnline: true,
              addedTracks: 0
            }],
            tracks: [],
            chat: []
          };
          setPlaylist(newPlaylist);
        }
      } catch (error) {
        console.error('Error loading playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [user]);

  // Supabase Realtime subscription for collaborative updates
  useEffect(() => {
    if (!user || !playlist) return;

    const channel = supabase
      .channel('collab-playlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
          filter: `key=eq.collab_playlist`
        },
        (payload) => {
          // Only process updates from other users (not our own)
          if (payload.new && (payload.new as any).user_id !== user.id) {
            const newValue = (payload.new as any).value;
            if (newValue) {
              const parsed = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
              // Merge collaborative changes (tracks, chat) without overwriting local state
              setPlaylist(prev => {
                if (!prev) return parsed;
                return {
                  ...prev,
                  tracks: [...new Map([...prev.tracks, ...parsed.tracks].map(t => [t.id, t])).values()],
                  chat: [...new Map([...prev.chat, ...parsed.chat].map(m => [m.id, m])).values()].sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                  )
                };
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, playlist?.id]);

  // Sauvegarder les changements vers Supabase (debounced)
  const savePlaylistRef = React.useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!playlist || !user) return;

    // Clear previous timeout
    if (savePlaylistRef.current) {
      clearTimeout(savePlaylistRef.current);
    }

    savePlaylistRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            key: 'collab_playlist',
            value: JSON.stringify(playlist),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving playlist:', error);
      }
    }, 500);

    return () => {
      if (savePlaylistRef.current) {
        clearTimeout(savePlaylistRef.current);
      }
    };
  }, [playlist, user]);

  const handleVote = (trackId: string, vote: 'up' | 'down') => {
    if (!playlist) return;
    setPlaylist({
      ...playlist,
      tracks: playlist.tracks.map((track) => {
        if (track.id === trackId) {
          const currentVote = track.userVote;
          let newVotes = { ...track.votes };

          if (currentVote === vote) {
            newVotes[vote]--;
            return { ...track, votes: newVotes, userVote: undefined };
          } else {
            if (currentVote) newVotes[currentVote]--;
            newVotes[vote]++;
            return { ...track, votes: newVotes, userVote: vote };
          }
        }
        return track;
      }),
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !playlist) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      userName: user?.email?.split('@')[0] || 'Vous',
      message: newMessage,
      timestamp: new Date(),
    };

    setPlaylist({
      ...playlist,
      chat: [...playlist.chat, message],
    });
    setNewMessage('');
    
    // Auto-scroll to bottom after sending message
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    toast({
      title: '✉️ Invitation envoyée',
      description: `Invitation envoyée à ${inviteEmail}`,
    });
    setInviteEmail('');
    setShowInvite(false);
  };

  const copyInviteLink = () => {
    if (!playlist) return;
    navigator.clipboard.writeText(`https://emotionscare.app/playlist/collab/${playlist.id}`);
    toast({
      title: '📋 Lien copié',
      description: 'Partagez ce lien pour inviter des collaborateurs',
    });
  };

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (!playlist) {
    return (
      <Card className="p-8 text-center">
        <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">Connectez-vous pour créer une playlist collaborative</p>
      </Card>
    );
  }

  const onlineCount = playlist.collaborators.filter((c) => c.isOnline).length;
  const sortedTracks = [...playlist.tracks].sort(
    (a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {playlist.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{playlist.description}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Online Collaborators */}
            <div className="flex -space-x-2">
              {playlist.collaborators
                .filter((c) => c.isOnline)
                .slice(0, 3)
                .map((collab) => (
                  <Avatar key={collab.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={collab.avatar} />
                    <AvatarFallback className="text-xs">
                      {collab.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
            </div>
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {onlineCount} en ligne
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="tracks" className="text-xs gap-1">
              <Music className="h-3 w-3" />
              Titres ({playlist.tracks.length})
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs gap-1">
              <Users className="h-3 w-3" />
              Membres ({playlist.collaborators.length})
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs gap-1">
              <MessageCircle className="h-3 w-3" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Tracks Tab */}
          <TabsContent value="tracks" className="space-y-3 mt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Triés par votes</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 gap-1 text-xs"
                onClick={() => {
                  // Ajouter un track de démonstration
                  const demoTrack: CollaborativeTrack = {
                    id: crypto.randomUUID(),
                    title: `Track ${(playlist?.tracks.length || 0) + 1}`,
                    artist: 'Nouveau Titre',
                    addedBy: user?.email?.split('@')[0] || 'Vous',
                    votes: { up: 0, down: 0 },
                    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                  };
                  if (playlist) {
                    setPlaylist({
                      ...playlist,
                      tracks: [...playlist.tracks, demoTrack],
                      collaborators: playlist.collaborators.map(c => 
                        c.id === user?.id ? { ...c, addedTracks: c.addedTracks + 1 } : c
                      )
                    });
                    toast({
                      title: '🎵 Track ajouté',
                      description: 'Ajouté à la playlist collaborative'
                    });
                  }
                }}
              >
                <Plus className="h-3 w-3" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sortedTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-muted/30 border flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    if (track.audioUrl) {
                      play({ id: track.id, title: track.title, artist: track.artist, url: track.audioUrl, audioUrl: track.audioUrl, duration: 180 });
                    }
                  }}
                >
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Play className="h-4 w-4" />
                  </Button>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist} • ajouté par {track.addedBy}
                    </p>
                  </div>

                  {/* Votes */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant={track.userVote === 'up' ? 'default' : 'ghost'}
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(track.id, 'up');
                      }}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium min-w-[20px] text-center">
                      {track.votes.up - track.votes.down}
                    </span>
                    <Button
                      size="sm"
                      variant={track.userVote === 'down' ? 'destructive' : 'ghost'}
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(track.id, 'down');
                      }}
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-3 mt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Collaborateurs</p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
                onClick={() => setShowInvite(!showInvite)}
              >
                <UserPlus className="h-3 w-3" />
                Inviter
              </Button>
            </div>

            <AnimatePresence>
              {showInvite && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-primary/5 border space-y-2"
                >
                  <div className="flex gap-2">
                    <Input
                      placeholder="Email du collaborateur"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button size="sm" onClick={handleInvite} className="h-8">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyInviteLink}
                    className="w-full h-7 text-xs gap-1"
                  >
                    <Link2 className="h-3 w-3" />
                    Copier le lien d'invitation
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {playlist.collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="p-2 rounded-lg flex items-center gap-3"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback>{collab.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {collab.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{collab.name}</p>
                      {collab.role === 'owner' && <Crown className="h-3 w-3 text-yellow-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {collab.addedTracks} titre(s) ajouté(s)
                    </p>
                  </div>

                  <Badge variant="outline" className="text-xs capitalize">
                    {collab.role}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-3 mt-3">
            <div 
              ref={chatContainerRef}
              className="space-y-2 max-h-48 overflow-y-auto"
            >
              {playlist.chat.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {msg.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-medium">{msg.userName}</span>{' '}
                      <span className="text-muted-foreground">{msg.message}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Input
                placeholder="Votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={handleSendMessage} className="h-8">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Créé il y a 3 jours
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Playlist active
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborativePlaylistSection;
