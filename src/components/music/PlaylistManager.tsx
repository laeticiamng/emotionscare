/**
 * PlaylistManager - Gestionnaire de playlists avancé
 * Permet de créer, modifier et organiser des playlists
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit2, Music, Save } from 'lucide-react';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { toast } from '@/hooks/use-toast';

interface PlaylistManagerProps {
  playlists: MusicPlaylist[];
  onCreatePlaylist: (name: string, description?: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onUpdatePlaylist: (playlist: MusicPlaylist) => void;
  onAddTrackToPlaylist: (playlistId: string, track: MusicTrack) => void;
  onRemoveTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  onUpdatePlaylist,
  onAddTrackToPlaylist,
  onRemoveTrackFromPlaylist
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const startEditing = (playlist: MusicPlaylist) => {
    setEditingPlaylist(playlist.id);
    setEditName(playlist.name);
    setEditDescription(playlist.description || '');
  };

  const saveEdit = (playlist: MusicPlaylist) => {
    if (!editName.trim()) {
      toast({
        title: "Nom requis",
        description: "Le nom de la playlist ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }
    onUpdatePlaylist({
      ...playlist,
      name: editName,
      description: editDescription
    });
    setEditingPlaylist(null);
    toast({
      title: "Playlist modifiée",
      description: `"${editName}" a été mise à jour`
    });
  };

  const cancelEdit = () => {
    setEditingPlaylist(null);
    setEditName('');
    setEditDescription('');
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour la playlist",
        variant: "destructive"
      });
      return;
    }

    onCreatePlaylist(newPlaylistName, newPlaylistDescription);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setShowCreateForm(false);
    
    toast({
      title: "Playlist créée",
      description: `"${newPlaylistName}" a été créée avec succès`
    });
  };

  const handleDeletePlaylist = (playlistId: string, playlistName: string) => {
    if (window.confirm(`Supprimer la playlist "${playlistName}" ?`)) {
      onDeletePlaylist(playlistId);
      toast({
        title: "Playlist supprimée",
        description: `"${playlistName}" a été supprimée`
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes Playlists</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Playlist
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle playlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Ma super playlist..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (optionnel)</label>
              <Input
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="Description de la playlist..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePlaylist} className="gap-2">
                <Save className="w-4 h-4" />
                Créer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName('');
                  setNewPlaylistDescription('');
                }}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[600px]">
        <div className="grid gap-4">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    {editingPlaylist === playlist.id ? (
                      <div className="space-y-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nom de la playlist"
                          className="h-8"
                          autoFocus
                        />
                        <Input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description (optionnel)"
                          className="h-8"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(playlist)} className="gap-1">
                            <Save className="w-3 h-3" />
                            Sauvegarder
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CardTitle className="text-lg">{playlist.name}</CardTitle>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {playlist.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {editingPlaylist !== playlist.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(playlist)}
                        aria-label={`Modifier la playlist ${playlist.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                        aria-label={`Supprimer la playlist ${playlist.name}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-3">
                  {playlist.tracks.length} morceaux · {
                    formatDuration(
                      playlist.tracks.reduce((acc, t) => acc + t.duration, 0)
                    )
                  }
                </div>
                
                {playlist.tracks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun morceau dans cette playlist</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {playlist.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{track.title}</p>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(track.duration)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveTrackFromPlaylist(playlist.id, track.id)}
                            aria-label={`Retirer ${track.title} de la playlist`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {playlists.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Aucune playlist</p>
                <p className="text-muted-foreground mb-4">
                  Créez votre première playlist pour commencer
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
