/**
 * Page principale du module Musicothérapie
 * Optimisée pour tous les appareils (mobile, tablette, desktop)
 */
import { useState } from 'react';
import { MusicProvider } from '@/contexts/MusicContext';
import MusicPlayer from '@/components/music/MusicPlayer';
import TrackList from '@/components/music/TrackList';
import PlaylistCard from '@/components/music/PlaylistCard';
import { sampleTracks, samplePlaylists } from '@/data/sampleTracks';
import { MusicPlaylist } from '@/types/music';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ListMusic, Disc3, ArrowLeft } from 'lucide-react';

function MusicPageContent() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(null);

  if (selectedPlaylist) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background">
        {/* Container avec padding responsive et espace pour le player fixe */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-36 sm:pb-40 md:pb-44">
          {/* Header responsive */}
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

          {/* Track List */}
          <Card className="overflow-hidden">
            <CardContent className="p-2 sm:p-3 md:p-4">
              <TrackList tracks={selectedPlaylist.tracks} />
            </CardContent>
          </Card>
        </div>
        <MusicPlayer />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      {/* Container avec padding responsive et espace pour le player fixe */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-36 sm:pb-40 md:pb-44">
        {/* Header responsive */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-primary/10 shrink-0">
            <Disc3 className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Musicothérapie
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Découvrez des musiques adaptées à votre humeur
            </p>
          </div>
        </div>

        <Tabs defaultValue="playlists" className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* TabsList responsive */}
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
            {/* Grid responsive : 1 colonne mobile, 2 tablette, 3-4 desktop */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {samplePlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onClick={() => setSelectedPlaylist(playlist)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracks">
            <Card className="overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Music className="h-4 w-4 sm:h-5 sm:w-5" />
                  Bibliothèque complète
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 md:p-4 pt-0 sm:pt-0 md:pt-0">
                <TrackList tracks={sampleTracks} />
              </CardContent>
            </Card>
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
