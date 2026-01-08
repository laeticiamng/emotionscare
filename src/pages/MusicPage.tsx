/**
 * Page principale du module Musicothérapie
 */
import React, { useState } from 'react';
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-32">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPlaylist(null)}
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedPlaylist.name}</h1>
              <p className="text-muted-foreground">{selectedPlaylist.tracks.length} titres</p>
            </div>
          </div>

          {/* Track List */}
          <Card>
            <CardContent className="p-2">
              <TrackList tracks={selectedPlaylist.tracks} />
            </CardContent>
          </Card>
        </div>
        <MusicPlayer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <Disc3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Musicothérapie</h1>
            <p className="text-muted-foreground">
              Découvrez des musiques adaptées à votre humeur
            </p>
          </div>
        </div>

        <Tabs defaultValue="playlists" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="playlists" className="gap-2">
              <ListMusic className="h-4 w-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="tracks" className="gap-2">
              <Music className="h-4 w-4" />
              Tous les titres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Bibliothèque complète
                </CardTitle>
              </CardHeader>
              <CardContent>
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
