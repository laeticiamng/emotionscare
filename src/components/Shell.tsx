
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MusicDrawer from '@/components/music/player/MusicDrawer'

const Shell: React.FC = () => {
  const [musicOpen, setMusicOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">EmotionsCare</h1>
          <button
            onClick={() => setMusicOpen(o => !o)}
            className="px-3 py-1 bg-green-600 text-white rounded"
            type="button"
          >
            🎵 Musique
          </button>
        </div>
      </header>

      {/* Le tiroir musical */}
      <MusicDrawer
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
      />

      <main className="flex-1">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>

      <footer className="bg-muted py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EmotionsCare
        </div>
      </footer>
    </div>
  )
}

export default Shell
