import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Play, Pause, SkipForward, SkipBack } from 'lucide-react'

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Méditation Relaxante')

  const tracks = [
    'Méditation Relaxante',
    'Sons de la Nature',
    'Musique Apaisante',
    'Ambiance Zen'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Musique Thérapeutique</h1>
          <p className="text-lg text-muted-foreground">
            Musique personnalisée pour votre bien-être
          </p>
        </header>

        <main role="main">
          <Card className="mb-8" role="region" aria-labelledby="music-player">
            <CardHeader>
              <CardTitle id="music-player" className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" aria-hidden="true" />
                Lecteur Musical
              </CardTitle>
              <CardDescription>
                Actuellement en écoute: {currentTrack}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-4" role="group" aria-label="Contrôles de lecture">
                <Button variant="outline" size="icon" aria-label="Piste précédente">
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)} 
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  aria-label={isPlaying ? "Mettre en pause" : "Lire"}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button variant="outline" size="icon" aria-label="Piste suivante">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2" role="region" aria-labelledby="playlist-title">
                <h2 id="playlist-title" className="font-semibold">Playlist Recommandée</h2>
                <div className="grid gap-2" role="list">
                  {tracks.map((track, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer hover:bg-accent transition-colors ${currentTrack === track ? 'bg-accent' : ''}`}
                      onClick={() => setCurrentTrack(track)}
                      role="listitem"
                      tabIndex={0}
                      aria-selected={currentTrack === track}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setCurrentTrack(track)
                        }
                      }}
                    >
                      <CardContent className="flex items-center gap-3 py-3">
                        <Music className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="flex-1">{track}</span>
                        {currentTrack === track && isPlaying && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-label="En cours de lecture" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}