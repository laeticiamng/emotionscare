/**
 * MusicCollaborativePlaylist - Création collaborative de playlists
 * Permet à plusieurs utilisateurs de contribuer à une playlist partagée
 */

import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, Plus, Music, Heart, MessageCircle, Share2, 
  Lock, Unlock, Copy, Check, MoreVertical, Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Contributor {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  addedTracks: number;
}

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  addedBy: Contributor;
  likes: number;
  comments: number;
  addedAt: Date;
}

interface CollaborativePlaylist {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  contributors: Contributor[];
  tracks: PlaylistTrack[];
  createdAt: Date;
}

const MusicCollaborativePlaylist = memo(() => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [newTrackUrl, setNewTrackUrl] = useState('');

  const [playlist] = useState<CollaborativePlaylist>({
    id: 'collab-1',
    name: 'Zen Collectif 🧘',
    description: 'Notre playlist de relaxation partagée',
    isPublic: true,
    contributors: [
      { id: '1', name: 'Marie L.', avatar: undefined, role: 'owner', addedTracks: 12 },
      { id: '2', name: 'Thomas B.', avatar: undefined, role: 'editor', addedTracks: 8 },
      { id: '3', name: 'Sophie M.', avatar: undefined, role: 'editor', addedTracks: 5 },
      { id: '4', name: 'Alex R.', avatar: undefined, role: 'viewer', addedTracks: 0 }
    ],
    tracks: [
      {
        id: 't1',
        title: 'Ocean Waves Meditation',
        artist: 'Nature Sounds',
        duration: '5:32',
        addedBy: { id: '1', name: 'Marie L.', role: 'owner', addedTracks: 12 },
        likes: 8,
        comments: 2,
        addedAt: new Date()
      },
      {
        id: 't2',
        title: 'Deep Breathing Flow',
        artist: 'Calm Mind',
        duration: '8:15',
        addedBy: { id: '2', name: 'Thomas B.', role: 'editor', addedTracks: 8 },
        likes: 5,
        comments: 1,
        addedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 't3',
        title: 'Forest Rain Ambience',
        artist: 'Ambient World',
        duration: '12:00',
        addedBy: { id: '3', name: 'Sophie M.', role: 'editor', addedTracks: 5 },
        likes: 12,
        comments: 4,
        addedAt: new Date(Date.now() - 172800000)
      }
    ],
    createdAt: new Date(Date.now() - 604800000)
  });

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://emotionscare.app/playlist/${playlist.id}/join`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Lien copié', description: 'Partagez ce lien pour inviter des collaborateurs' });
  };

  const handleAddTrack = () => {
    if (!newTrackUrl.trim()) return;
    toast({ title: 'Piste ajoutée', description: 'La musique a été ajoutée à la playlist' });
    setNewTrackUrl('');
  };

  const getRoleBadge = (role: Contributor['role']) => {
    switch (role) {
      case 'owner': return <Badge className="bg-yellow-500">Créateur</Badge>;
      case 'editor': return <Badge variant="secondary">Éditeur</Badge>;
      default: return <Badge variant="outline">Auditeur</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {playlist.name}
            </CardTitle>
            <CardDescription>{playlist.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={playlist.isPublic ? 'default' : 'secondary'}>
              {playlist.isPublic ? (
                <><Unlock className="h-3 w-3 mr-1" /> Publique</>
              ) : (
                <><Lock className="h-3 w-3 mr-1" /> Privée</>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contributeurs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Contributeurs ({playlist.contributors.length})</h4>
            <Button variant="outline" size="sm" onClick={copyInviteLink}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copié!' : 'Inviter'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {playlist.contributors.map(contributor => (
              <div
                key={contributor.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contributor.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(contributor.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{contributor.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {contributor.addedTracks} pistes
                  </div>
                </div>
                {getRoleBadge(contributor.role)}
              </div>
            ))}
          </div>
        </div>

        {/* Ajouter une piste */}
        <div className="flex gap-2">
          <Input
            value={newTrackUrl}
            onChange={(e) => setNewTrackUrl(e.target.value)}
            placeholder="Coller un lien YouTube, Spotify, SoundCloud..."
            className="flex-1"
          />
          <Button onClick={handleAddTrack} disabled={!newTrackUrl.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {/* Liste des pistes */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{playlist.tracks.length} pistes</h4>
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{track.title}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>{track.artist}</span>
                  <span>•</span>
                  <span>{track.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(track.addedBy.name)}
                  </AvatarFallback>
                </Avatar>

                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">{track.likes}</span>
                </button>

                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{track.comments}</span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Music className="h-4 w-4 mr-2" />
            Lire la playlist
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{playlist.tracks.length}</div>
            <div className="text-xs text-muted-foreground">Pistes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{playlist.contributors.length}</div>
            <div className="text-xs text-muted-foreground">Contributeurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {playlist.tracks.reduce((sum, t) => sum + t.likes, 0)}
            </div>
            <div className="text-xs text-muted-foreground">J'aime</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MusicCollaborativePlaylist.displayName = 'MusicCollaborativePlaylist';

export default MusicCollaborativePlaylist;
