/**
 * Playlist Builder Tab - Création et gestion de playlists
 * Interface drag-and-drop, export, partage, templates
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Download,
  Share2,
  Trash2,
  Music,
  Clock,
  Copy,
  Save,
  Settings2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: PlaylistTrack[];
  createdAt: Date;
  isPublic: boolean;
  coverColor?: string;
}

interface PlaylistBuilderTabProps {
  existingPlaylists?: Playlist[];
  onCreatePlaylist?: (playlist: Playlist) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  availableTracks?: PlaylistTrack[];
}

const PLAYLIST_TEMPLATES = [
  {
    id: 'relax',
    name: 'Relaxation Totale',
    description: 'Musiques apaisantes pour se détendre',
    icon: '😌',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'focus',
    name: 'Focus Total',
    description: 'Musiques pour la concentration',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-400',
  },
  {
    id: 'energy',
    name: 'Boost Énergie',
    description: 'Musiques énergiques et motivantes',
    icon: '⚡',
    color: 'from-orange-500 to-red-400',
  },
  {
    id: 'healing',
    name: 'Guérison',
    description: 'Musiques thérapeutiques',
    icon: '💚',
    color: 'from-green-500 to-emerald-400',
  },
];

export const PlaylistBuilderTab: React.FC<PlaylistBuilderTabProps> = ({
  existingPlaylists = [],
  onCreatePlaylist,
  onDeletePlaylist,
  availableTracks = [],
}) => {
  const { toast } = useToast();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom de la playlist ne peut pas être vide',
        variant: 'destructive',
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDescription,
      tracks: [],
      createdAt: new Date(),
      isPublic: false,
      coverColor: selectedTemplate || 'from-blue-500 to-cyan-400',
    };

    onCreatePlaylist?.(newPlaylist);

    toast({
      title: 'Playlist créée ! 🎵',
      description: `${newPlaylistName} a été créée avec succès`,
    });

    // Reset form
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setSelectedTemplate(null);
    setShowCreateForm(false);
  };

  const handleExportPlaylist = (playlist: Playlist) => {
    const m3uContent = `#EXTM3U
${playlist.tracks
  .map(
    (track) =>
      `#EXTINF:${track.duration},${track.artist} - ${track.title}\n${track.id}`
  )
  .join('\n')}`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(m3uContent)
    );
    element.setAttribute('download', `${playlist.name}.m3u`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Playlist exportée 📥',
      description: `${playlist.name} a été téléchargée au format M3U`,
    });
  };

  const handleSharePlaylist = (playlist: Playlist) => {
    const shareLink = `${window.location.origin}/shared-playlist/${playlist.id}`;
    navigator.clipboard.writeText(shareLink);

    toast({
      title: 'Lien copié ! 🔗',
      description: 'Le lien de partage est prêt à être partagé',
    });
  };

  return (
    <div className="space-y-8">
      {/* Templates Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Modèles de Playlist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLAYLIST_TEMPLATES.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setNewPlaylistName(template.name);
                  setNewPlaylistDescription(template.description);
                  setShowCreateForm(true);
                }}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-4xl">{template.icon}</div>
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Plus className="h-3 w-3" />
                    Utiliser ce modèle
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create New Playlist Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Créer une nouvelle playlist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la playlist</label>
                <Input
                  placeholder="Mon Playlist Personnalisée"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Décris ta playlist..."
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreatePlaylist} className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Créer la playlist
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Playlist Button */}
      {!showCreateForm && (
        <Button
          onClick={() => setShowCreateForm(true)}
          size="lg"
          className="w-full gap-2"
        >
          <Plus className="h-5 w-5" />
          Créer une playlist personnalisée
        </Button>
      )}

      {/* Existing Playlists */}
      {existingPlaylists.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mes Playlists</h3>
          <div className="grid gap-4">
            <AnimatePresence>
              {existingPlaylists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Playlist Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold truncate">
                              {playlist.name}
                            </h4>
                            {playlist.isPublic && (
                              <Badge variant="secondary" className="text-xs">
                                Public
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {playlist.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              {playlist.tracks.length} titres
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {Math.round(
                                playlist.tracks.reduce((acc, t) => acc + t.duration, 0) / 60
                              )}{' '}
                              min
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExportPlaylist(playlist)}
                            title="Exporter"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSharePlaylist(playlist)}
                            title="Partager"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeletePlaylist?.(playlist.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {existingPlaylists.length === 0 && !showCreateForm && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-8 text-center space-y-4">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h4 className="font-semibold">Aucune playlist</h4>
              <p className="text-sm text-muted-foreground">
                Crée ta première playlist pour organiser tes musiques préférées
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlaylistBuilderTab;
