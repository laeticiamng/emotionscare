/**
 * Collaborative Playlist Section - Playlists collaboratives
 * Invitations, votes, chat, édition en temps réel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  MoreVertical,
  Sparkles,
  Heart,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const MOCK_PLAYLIST: CollaborativePlaylist = {
  id: '1',
  name: 'Road Trip Mix 2024',
  description: 'Notre playlist pour le voyage !',
  isPublic: false,
  createdAt: new Date(),
  collaborators: [
    { id: '1', name: 'Marie', role: 'owner', isOnline: true, addedTracks: 12 },
    { id: '2', name: 'Lucas', role: 'editor', isOnline: true, addedTracks: 8 },
    { id: '3', name: 'Emma', role: 'editor', isOnline: false, addedTracks: 5 },
    { id: '4', name: 'Hugo', role: 'viewer', isOnline: false, addedTracks: 0 },
  ],
  tracks: [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', addedBy: 'Marie', votes: { up: 3, down: 0 } },
    { id: '2', title: 'Flowers', artist: 'Miley Cyrus', addedBy: 'Lucas', votes: { up: 2, down: 1 } },
    { id: '3', title: 'As It Was', artist: 'Harry Styles', addedBy: 'Emma', votes: { up: 4, down: 0 } },
  ],
  chat: [
    { id: '1', userId: '1', userName: 'Marie', message: 'Ajouté quelques classiques !', timestamp: new Date() },
    { id: '2', userId: '2', userName: 'Lucas', message: 'Super choix 🎵', timestamp: new Date() },
  ],
};

export const CollaborativePlaylistSection: React.FC = () => {
  const { toast } = useToast();
  const [playlist, setPlaylist] = useState<CollaborativePlaylist>(MOCK_PLAYLIST);
  const [activeTab, setActiveTab] = useState('tracks');
  const [newMessage, setNewMessage] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleVote = (trackId: string, vote: 'up' | 'down') => {
    setPlaylist((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) => {
        if (track.id === trackId) {
          const currentVote = track.userVote;
          let newVotes = { ...track.votes };

          if (currentVote === vote) {
            // Remove vote
            newVotes[vote]--;
            return { ...track, votes: newVotes, userVote: undefined };
          } else {
            // Change or add vote
            if (currentVote) newVotes[currentVote]--;
            newVotes[vote]++;
            return { ...track, votes: newVotes, userVote: vote };
          }
        }
        return track;
      }),
    }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'Vous',
      message: newMessage,
      timestamp: new Date(),
    };

    setPlaylist((prev) => ({
      ...prev,
      chat: [...prev.chat, message],
    }));
    setNewMessage('');
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
    navigator.clipboard.writeText(`https://emotionscare.app/playlist/collab/${playlist.id}`);
    toast({
      title: '📋 Lien copié',
      description: 'Partagez ce lien pour inviter des collaborateurs',
    });
  };

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
              <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
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
                  className="p-3 rounded-lg bg-muted/30 border flex items-center gap-3"
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
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={track.userVote === 'up' ? 'default' : 'ghost'}
                      className="h-7 w-7 p-0"
                      onClick={() => handleVote(track.id, 'up')}
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
                      onClick={() => handleVote(track.id, 'down')}
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
            <div className="space-y-2 max-h-48 overflow-y-auto">
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
