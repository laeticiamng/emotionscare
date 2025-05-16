import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Menu, 
  User, 
  Settings, 
  FileText,
  BarChart2,
  Music,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, isActive, onClick }) => {
  return (
    <Link to={href} onClick={onClick}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }`}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

const Shell: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[240px] sm:w-[300px]">
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4 px-3">Menu</h2>
                  <nav className="space-y-2">
                    <SidebarItem
                      href="/"
                      icon={<Home className="h-5 w-5" />}
                      label="Accueil"
                      isActive={isActive('/')}
                      onClick={closeMenu}
                    />
                    <SidebarItem
                      href="/dashboard"
                      icon={<BarChart2 className="h-5 w-5" />}
                      label="Tableau de bord"
                      isActive={isActive('/dashboard')}
                      onClick={closeMenu}
                    />
                    <SidebarItem
                      href="/scan"
                      icon={<FileText className="h-5 w-5" />}
                      label="Analyse"
                      isActive={isActive('/scan')}
                      onClick={closeMenu}
                    />
                    <SidebarItem
                      href="/music"
                      icon={<Music className="h-5 w-5" />}
                      label="Musique"
                      isActive={isActive('/music')}
                      onClick={closeMenu}
                    />
                    
                    {user && (user.role === 'b2b_user' || user.role === 'b2b_admin') && (
                      <SidebarItem
                        href="/team"
                        icon={<Users className="h-5 w-5" />}
                        label="Équipe"
                        isActive={isActive('/team')}
                        onClick={closeMenu}
                      />
                    )}
                    
                    <SidebarItem
                      href="/profile"
                      icon={<User className="h-5 w-5" />}
                      label="Profil"
                      isActive={isActive('/profile')}
                      onClick={closeMenu}
                    />
                    <SidebarItem
                      href="/settings"
                      icon={<Settings className="h-5 w-5" />}
                      label="Paramètres"
                      isActive={isActive('/settings')}
                      onClick={closeMenu}
                    />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-lg md:text-xl">EmotionCare</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-md">
            <Link
              to="/"
              className={isActive('/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
            >
              Accueil
            </Link>
            <Link
              to="/dashboard"
              className={isActive('/dashboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
            >
              Tableau de bord
            </Link>
            <Link
              to="/scan"
              className={isActive('/scan') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
            >
              Analyse
            </Link>
            <Link
              to="/music"
              className={isActive('/music') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
            >
              Musique
            </Link>
            
            {user && (user.role === 'b2b_user' || user.role === 'b2b_admin') && (
              <Link
                to="/team"
                className={isActive('/team') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
              >
                Équipe
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to={isAuthenticated ? '/profile' : '/login'}>
                {isAuthenticated ? 'Mon Profil' : 'Se connecter'}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-sm">
          <p>© {new Date().getFullYear()} EmotionCare. Tous droits réservés.</p>
          <nav className="flex gap-4">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              À propos
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              Conditions
            </Link>
          </nav>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Shell;
