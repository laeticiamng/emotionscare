
import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  Headphones, 
  Menu, 
  Shield, 
  User, 
  Home,
  BarChart,
  LogOut
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast'
import MobileNavigation from '@/components/navigation/MobileNavigation'
import Sidebar from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'

// Composant temporaire pour remplacer MusicDrawer en attendant de résoudre l'import
const MusicDrawer = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return open ? (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 shadow-lg border-l">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Musique</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
        <p className="text-muted-foreground">Le lecteur de musique sera bientôt disponible.</p>
      </div>
    </div>
  ) : null;
};

const Shell: React.FC = () => {
  const [musicOpen, setMusicOpen] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      })
      navigate('/')
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
      toast({
        title: "Erreur",
        description: "Impossible de vous déconnecter. Veuillez réessayer.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">
              <Link to="/" className="hover:text-primary transition-colors">
                EmotionsCare
              </Link>
            </h1>
            
            {/* Navigation principale visible uniquement si connecté (format desktop) */}
            {isAuthenticated && !isMobile && (
              <nav className="hidden md:flex gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Accueil</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span>Tableau de bord</span>
                  </Link>
                </Button>
              </nav>
            )}
          </div>

          {/* Menu mobile pour les petits écrans */}
          {isMobile && <MobileNavigation />}

          {/* Actions toujours visibles */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setMusicOpen(o => !o)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              type="button"
            >
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Musique</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name || 'Utilisateur'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/admin-login" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Direction</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar visible uniquement si connecté */}
        {isAuthenticated && !isMobile && <Sidebar />}
        
        <main className="flex-1">
          <MusicDrawer
            open={musicOpen}
            onClose={() => setMusicOpen(false)}
          />
          <Outlet />
        </main>
      </div>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmotionsCare - Tous droits réservés</p>
            <p className="mt-2">Un espace dédié au bien-être émotionnel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Shell
