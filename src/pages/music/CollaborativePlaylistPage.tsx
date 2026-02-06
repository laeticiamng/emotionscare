/**
 * CollaborativePlaylistPage - Page dédiée aux playlists collaboratives
 * Route: /app/music/collab/:playlistId
 */

import React, { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Users, Music, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CollaborativePlaylistUI } from '@/components/music/CollaborativePlaylistUI';
import { useToast } from '@/hooks/use-toast';
import { MusicProvider } from '@/contexts/MusicContext';

interface CollaborativePlaylist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  collaborators: Array<{
    id: string;
    name: string;
    role: 'owner' | 'editor' | 'viewer';
    joinedAt: Date;
  }>;
}

const CollaborativePlaylistPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [playlist, setPlaylist] = useState<CollaborativePlaylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  usePageSEO({
    title: playlist?.name || 'Playlist Collaborative - EmotionsCare',
    description: 'Écoutez et collaborez sur cette playlist partagée',
  });

  useEffect(() => {
    const loadPlaylist = async () => {
      if (!playlistId) {
        setLoading(false);
        return;
      }

      try {
        // Try to find the playlist in user_settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('user_id, value')
          .eq('key', 'collab_playlist')
          .limit(50);

        if (error) throw error;

        // Search for the playlist across all users
        for (const row of data || []) {
          try {
            const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
            if (parsed?.id === playlistId) {
              setPlaylist(parsed);
              
              // Check if user has access
              if (parsed.isPublic) {
                setHasAccess(true);
              } else if (user) {
                const isCollaborator = parsed.collaborators?.some(
                  (c: any) => c.id === user.id
                );
                setHasAccess(isCollaborator || row.user_id === user.id);
              }
              break;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      } catch (error) {
        logger.error('Error loading playlist:', error, 'MUSIC');
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la playlist',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [playlistId, user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Playlist introuvable</h2>
              <p className="text-muted-foreground mb-6">
                Cette playlist n'existe pas ou a été supprimée
              </p>
              <Button onClick={() => navigate('/app/music')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la musique
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Playlist privée</h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas accès à cette playlist collaborative
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/app/music')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                {!user && (
                  <Button onClick={() => navigate('/login')}>
                    Se connecter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <MusicProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/music')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {playlist.name}
                </h1>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground">
                    {playlist.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={playlist.isPublic ? 'default' : 'secondary'}>
                {playlist.isPublic ? 'Public' : 'Privé'}
              </Badge>
              <Badge variant="outline">
                {playlist.collaborators?.length || 1} collaborateur(s)
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-4 space-y-6">
          <CollaborativePlaylistUI
            playlistId={playlist.id}
            playlistName={playlist.name}
            collaborators={playlist.collaborators || []}
            currentUserId={user?.id || ''}
            isPublic={playlist.isPublic}
            onTogglePublic={(isPublic) => {
              setPlaylist({ ...playlist, isPublic });
            }}
          />
        </main>
      </div>
    </MusicProvider>
  );
};

export default CollaborativePlaylistPage;
