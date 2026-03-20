/**
 * Page principale du module Musicotherapie
 * Optimisee pour tous les appareils (mobile, tablette, desktop)
 */
import React, { useState, Suspense, lazy } from 'react';
import { Scene3DErrorBoundary } from '@/components/3d/Scene3DErrorBoundary';

const DashboardBackground3D = lazy(() => import('@/components/3d/DashboardBackground3D'));
import { MusicProvider } from '@/contexts/MusicContext';
import MusicPlayer from '@/components/music/MusicPlayer';
import TrackList from '@/components/music/TrackList';
import PlaylistCard from '@/components/music/PlaylistCard';
import { useRealMusicLibrary } from '@/hooks/useRealMusicLibrary';
import { MusicPlaylist } from '@/types/music';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Card3D from '@/components/ui/Card3D';
import { Button } from '@/components/ui/button';
import { Music, ListMusic, Disc3, ArrowLeft, Loader2 } from 'lucide-react';
import '@/styles/premium-3d-player.css';

function MusicPageContent() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(null);
  const { tracks, playlists, loading } = useRealMusicLibrary();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (selectedPlaylist) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-36 sm:pb-40 md:pb-44">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPlaylist(null)}
              aria-label="Retour"
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                {selectedPlaylist.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {selectedPlaylist.tracks.length} titres
              </p>
            </div>
          </div>
          <Card3D className="overflow-hidden p-2 sm:p-3 md:p-4">
            <TrackList tracks={selectedPlaylist.tracks} />
          </Card3D>
        </div>
        <MusicPlayer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-background">
      <Scene3DErrorBoundary>
        <Suspense fallback={null}>
          <DashboardBackground3D className="absolute inset-0 -z-10 opacity-15 pointer-events-none" />
        </Suspense>
      </Scene3DErrorBoundary>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-36 sm:pb-40 md:pb-44">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-primary/10 shrink-0">
            <Disc3 className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Musicotherapie
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Decouvrez des musiques adaptees a votre humeur
            </p>
          </div>
        </div>

        <Tabs defaultValue="playlists" className="space-y-4 sm:space-y-5 md:space-y-6">
          <TabsList className="grid w-full max-w-xs sm:max-w-sm md:max-w-md grid-cols-2 h-9 sm:h-10">
            <TabsTrigger value="playlists" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <ListMusic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="tracks" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">Tous les titres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            {playlists.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune playlist disponible</p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onClick={() => setSelectedPlaylist(playlist)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tracks">
            <Card3D className="overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold">
                  <Music className="h-4 w-4 sm:h-5 sm:w-5" />
                  Bibliotheque complete
                </h3>
              </div>
              <div className="p-2 sm:p-3 md:p-4 pt-0 sm:pt-0 md:pt-0">
                {tracks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucune piste disponible</p>
                ) : (
                  <TrackList tracks={tracks} />
                )}
              </div>
            </Card3D>
          </TabsContent>
        </Tabs>
      </div>

      <MusicPlayer />
    </div>
  );
}

export default function MusicPage() {
  return (
    <MusicProvider>
      <MusicPageContent />
    </MusicProvider>
  );
}
