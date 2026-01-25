/**
 * Enhanced Music Discovery Tab - Version améliorée avec search, queue, collaboration
 * Intègre: Search, Queue avancée, Collaboration
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Search, Users, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedMusicQueue } from './AdvancedMusicQueue';
import { MusicSearchAndFilter } from './MusicSearchAndFilter';
import { CollaborativePlaylistUI } from './CollaborativePlaylistUI';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

interface Collaborator {
  id: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  lastActive?: Date;
}

interface EnhancedMusicDiscoveryTabProps {
  vinylTracks: MusicTrack[];
  loadingTrackId: string | null;
  onPlayTrack: (track: MusicTrack) => void;
  onFavoritesChange?: (trackId: string, isFavorite: boolean) => void;
  isFavorite?: (trackId: string) => boolean;
  children?: React.ReactNode;
  collaborators?: Collaborator[];
  currentUserId?: string;
}

const categoryIcons = {
  doux: '💙',
  énergique: '⚡',
  créatif: '✨',
  guérison: '🧠',
};

export const EnhancedMusicDiscoveryTab: React.FC<EnhancedMusicDiscoveryTabProps> = ({
  vinylTracks,
  loadingTrackId,
  onPlayTrack,
  onFavoritesChange,
  isFavorite = () => false,
  children,
  collaborators = [
    {
      id: '1',
      name: 'Vous',
      role: 'owner',
      joinedAt: new Date(),
    },
  ],
  currentUserId = '1',
}) => {
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>(vinylTracks);
  const [activeTab, setActiveTab] = useState('discover');

  // Convert vinyl tracks to queue format
  const queueTracks = useMemo(
    () =>
      filteredTracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        duration: t.duration,
        mood: t.mood,
        color: t.color,
      })),
    [filteredTracks]
  );

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-2">
          <TabsTrigger value="discover" className="gap-2 text-xs">
            <Music className="h-4 w-4" />
            <span className="hidden sm:inline">Découverte</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2 text-xs">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Recherche</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-2 text-xs">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Queue</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {queueTracks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="collaborate" className="gap-2 text-xs">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Collab</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {collaborators.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Discovery Tab */}
        <TabsContent value="discover" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Introduction */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-foreground">
                Vinyles en Apesanteur
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvre des musiques générées par IA adaptées à ton état émotionnel.
              </p>
            </div>

            {/* Custom Children */}
            {children}

            {/* Vinyl Collection by Category */}
            {[
              'doux',
              'énergique',
              'créatif',
              'guérison',
            ].map((category) => {
              const categoryTracks = filteredTracks.filter(
                (t) => t.category === category
              );

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </span>
                    <h3 className="text-lg font-semibold capitalize">{category}</h3>
                    <Badge variant="secondary">{categoryTracks.length} titres</Badge>
                  </div>

                  {categoryTracks.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                      <AnimatePresence>
                        {categoryTracks.map((track) => (
                          <motion.div
                            key={track.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              className="h-full cursor-pointer hover:shadow-lg transition-all"
                              onClick={() => onPlayTrack(track)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  onPlayTrack(track);
                                }
                              }}
                            >
                              <CardContent className="p-6 space-y-4">
                                {/* Vinyl */}
                                <div className="flex justify-center">
                                  <motion.div
                                    animate={
                                      loadingTrackId === track.id
                                        ? { rotate: 360 }
                                        : {}
                                    }
                                    transition={
                                      loadingTrackId === track.id
                                        ? {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                          }
                                        : {}
                                    }
                                    className="w-24 h-24 rounded-full"
                                    style={{ background: track.vinylColor }}
                                  >
                                    <div className="absolute inset-2 rounded-full border-2 border-foreground/20" />
                                  </motion.div>
                                </div>

                                {/* Info */}
                                <div className="text-center space-y-2">
                                  <h4 className="font-medium truncate">{track.title}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {track.artist}
                                  </p>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                    style={{
                                      backgroundColor: `${track.color}20`,
                                      color: track.color,
                                    }}
                                  >
                                    {track.mood}
                                  </Badge>
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                  <Button
                                    size="sm"
                                    className="w-full"
                                    disabled={loadingTrackId === track.id}
                                  >
                                    ▶️ Lancer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={
                                      isFavorite(track.id) ? 'secondary' : 'ghost'
                                    }
                                    className="w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onFavoritesChange?.(
                                        track.id,
                                        !isFavorite(track.id)
                                      );
                                    }}
                                  >
                                    ❤️{' '}
                                    {isFavorite(track.id) ? 'Favori' : 'Ajouter'}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun titre dans cette catégorie
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MusicSearchAndFilter
              tracks={vinylTracks}
              onTracksFiltered={setFilteredTracks}
              onTrackSelect={onPlayTrack}
            />
          </motion.div>
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdvancedMusicQueue
              tracks={queueTracks}
              onTrackSelect={(trackId) => {
                const track = vinylTracks.find((t) => t.id === trackId);
                if (track) onPlayTrack(track);
              }}
              onQueueChange={(newQueue) => {
                setFilteredTracks(
                  vinylTracks.filter((t) =>
                    newQueue.some((q) => q.id === t.id)
                  )
                );
              }}
            />
          </motion.div>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaborate" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CollaborativePlaylistUI
              playlistId="playlist-1"
              playlistName="Ma Playlist"
              collaborators={collaborators}
              currentUserId={currentUserId}
              isPublic={false}
              onAddCollaborator={(email, role) => {
                logger.debug(`Invite ${email} as ${role}`, 'COMPONENT');
              }}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedMusicDiscoveryTab;
