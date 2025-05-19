
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Music, 
  MessageCircle, 
  Users, 
  LayoutDashboard, 
  Settings,
  Sun,
  Moon,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useMusic } from '@/providers/MusicProvider';
import MusicMiniPlayer from '@/components/music/MusicMiniPlayer';

interface PremiumHeaderProps {
  scrolled: boolean;
}

const PremiumHeader: React.FC<PremiumHeaderProps> = ({ scrolled }) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentTrack, isPlaying } = useMusic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" />, label: "Dashboard" },
    { to: "/emotions", icon: <Home className="h-4 w-4 mr-2" />, label: "Émotions" },
    { to: "/music", icon: <Music className="h-4 w-4 mr-2" />, label: "Music" },
    { to: "/coach", icon: <MessageCircle className="h-4 w-4 mr-2" />, label: "Coach" },
    { to: "/community", icon: <Users className="h-4 w-4 mr-2" />, label: "Communauté" }
  ];

  return (
    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="flex items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
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
      <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
        {navigationItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => cn(
              "relative px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center",
              isActive 
                ? "text-primary" 
                : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
            )}
          >
            {({ isActive }) => (
              <>
                {item.icon}
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Right Menu Controls */}
      <div className="flex items-center space-x-2">
        {/* Mini Music Player when track is active */}
        {currentTrack && (
          <div className="hidden sm:block">
            <MusicMiniPlayer />
          </div>
        )}
        
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* User Menu or Login/Register Buttons */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
        
        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Menu</span>
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg md:hidden z-50"
          >
            <div className="container mx-auto py-4 px-6">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/settings"
                  className={({ isActive }) => cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </NavLink>
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border/50">
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumHeader;
