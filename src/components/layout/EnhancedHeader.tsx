
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bell,
  Search,
  Menu,
  X,
  Home,
  Music,
  MessageCircle,
  Users,
  Settings,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import MusicMiniPlayer from '@/components/music/MusicMiniPlayer';

interface EnhancedHeaderProps {
  scrolled: boolean;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ scrolled }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { to: "/dashboard", icon: <Home className="h-4 w-4 mr-2" />, label: "Tableau de bord" },
    { to: "/emotions", icon: <Home className="h-4 w-4 mr-2" />, label: "Émotions" },
    { to: "/music", icon: <Music className="h-4 w-4 mr-2" />, label: "Musique" },
    { to: "/coach", icon: <MessageCircle className="h-4 w-4 mr-2" />, label: "Coach" },
    { to: "/community", icon: <Users className="h-4 w-4 mr-2" />, label: "Communauté" },
    { to: "/settings", icon: <Settings className="h-4 w-4 mr-2" />, label: "Paramètres" }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">EC</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hidden sm:inline-block"
            >
              EmotionsCare
            </motion.span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <AnimatePresence mode="wait">
            {navigationItems.map((item) => (
              <Link to={item.to} key={item.to}>
                <motion.div
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center relative",
                    isActiveRoute(item.to)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  )}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActiveRoute(item.to) && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Mini Music Player */}
          <div className="hidden md:block">
            <MusicMiniPlayer className="mr-2" />
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle minimal className="mr-2" />

          {/* Search Button */}
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <p className="text-muted-foreground text-center">Pas de nouvelles notifications</p>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout && logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] max-w-sm">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EC</span>
                  </div>
                  <span className="ml-2">EmotionsCare</span>
                </SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <nav className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                          isActiveRoute(item.to)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent/50"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t">
                  <ThemeToggle />
                </div>
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      logout && logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button asChild variant="outline">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        S'inscrire
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
