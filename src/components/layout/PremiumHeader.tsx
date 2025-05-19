
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Home, 
  BarChart2, 
  Music, 
  MessageSquare, 
  Settings, 
  User, 
  Bell, 
  Search,
  ChevronDown,
  SunMoon,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import MusicMiniPlayer from '@/components/music/MusicMiniPlayer';
import { useMusic } from '@/hooks/useMusic';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const mainNavItems: NavItem[] = [
  { label: 'Accueil', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart2 className="h-5 w-5" /> },
  { label: 'Musique', href: '/music', icon: <Music className="h-5 w-5" /> },
  { label: 'Coach', href: '/coach', icon: <MessageSquare className="h-5 w-5" />, badge: 'New' },
  { label: 'Paramètres', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

export const PremiumHeader = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTrack } = useMusic();
  
  // Check if current route matches nav item
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Listen for scroll events to modify header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-bold text-xl">EmotionsCare</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-1">
                  {mainNavItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      asChild
                      className="justify-start px-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to={item.href}>
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="outline" 
                            className="ml-auto bg-primary text-primary-foreground"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  ))}
                </nav>
                
                <div className="mt-auto pt-4">
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      alert("Déconnexion simulée");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="hidden sm:inline">EmotionsCare</span>
            <span className="sm:hidden">EC</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {mainNavItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="gap-1.5"
            >
              <Link to={item.href}>
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="outline" 
                    className="ml-1 bg-primary text-primary-foreground"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Global Search */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                className="relative flex items-center"
              >
                <Input 
                  placeholder="Rechercher..." 
                  className="w-full pr-8"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Rechercher</span>
              </Button>
            )}
          </AnimatePresence>
          
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon">
            <SunMoon className="h-5 w-5" />
            <span className="sr-only">Theme</span>
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <span className="font-semibold">Notifications</span>
                <Button variant="ghost" size="sm">
                  Tout marquer comme lu
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto py-1">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                    <div>
                      <p className="font-medium">Nouvelle fonctionnalité disponible</p>
                      <p className="text-sm text-muted-foreground">
                        Découvrez les dernières améliorations de l'application.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Il y a 2h</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="p-2 cursor-pointer">
                <Link to="/notifications" className="w-full text-center font-medium">
                  Voir toutes les notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 pr-2 pl-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar-placeholder.jpg" alt="Avatar" />
                  <AvatarFallback>EC</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline font-medium">Jean Dupont</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Déconnexion simulée")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mini Music Player (appears when music is playing) */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 transform mb-2"
          >
            <MusicMiniPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PremiumHeader;
