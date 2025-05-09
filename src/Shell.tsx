
import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import MusicDrawer from '@/components/music/player/MusicDrawer'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './components/ui/button'
import { Headphones, Menu, User } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import MobileNavigation from '@/components/navigation/MobileNavigation'

const Shell: React.FC = () => {
  const [musicOpen, setMusicOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="container mx-auto py-3 sm:py-4 px-4 flex items-center justify-between">
          {isMobile && <MobileNavigation user={user} />}
          
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold">
              <Link to="/" className="hover:text-primary transition-colors">
                EmotionsCare
              </Link>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setMusicOpen(o => !o)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9"
              type="button"
              aria-label="Ouvrir le lecteur musical"
            >
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Musique</span>
            </Button>

            {isAuthenticated ? (
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9"
              >
                <Link to="/dashboard" className="flex items-center gap-1 sm:gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Tableau de bord</span>
                </Link>
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9"
              >
                <Link to="/login" className="flex items-center gap-1 sm:gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Le tiroir musical */}
      <MusicDrawer
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-muted py-4 sm:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmotionsCare - Tous droits réservés</p>
            <p className="mt-1 sm:mt-2">Un espace dédié au bien-être émotionnel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Shell
