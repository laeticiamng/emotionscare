
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/ThemeToggle';
import {
  Home,
  Music,
  MessageCircle,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
  Palette
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';

interface EnhancedHeaderProps {
  scrolled: boolean;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ scrolled }) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  
  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/emotions', label: 'Émotions', icon: <Home className="h-5 w-5" /> },
    { path: '/music', label: 'Musique', icon: <Music className="h-5 w-5" /> },
    { path: '/coach', label: 'Coach', icon: <MessageCircle className="h-5 w-5" /> },
    { path: '/community', label: 'Communauté', icon: <Users className="h-5 w-5" /> },
    { path: '/settings', label: 'Paramètres', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">EC</span>
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            <AnimatePresence mode="wait">
              {navigationItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => cn(
                    "relative px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center",
                    isActive 
                      ? "text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <span className="mr-2">{item.icon}</span>
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
            </AnimatePresence>
          </nav>

          {/* Right Menu Controls */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  {theme === 'light' && <Sun className="h-5 w-5" />}
                  {theme === 'dark' && <Moon className="h-5 w-5" />}
                  {theme === 'system' && <Laptop className="h-5 w-5" />}
                  {theme === 'pastel' && <Palette className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <DropdownMenuRadioItem value="light">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Clair</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Sombre</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <Laptop className="mr-2 h-4 w-4" />
                    <span>Système</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="pastel">
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Pastel</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Button */}
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notificationCount}
                </motion.span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Mon profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Paramètres</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild className="hidden sm:flex">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Inscription</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">EC</span>
                    </div>
                    <span className="ml-2">EmotionsCare</span>
                  </SheetTitle>
                  <SheetDescription>
                    {isAuthenticated 
                      ? `Bonjour, ${user?.name}`
                      : "Navigation principale"}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col p-4 space-y-2">
                  {navigationItems.map((item) => (
                    <SheetClose asChild key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                          location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        )}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                
                <SheetFooter className="p-4 border-t mt-auto">
                  {isAuthenticated ? (
                    <Button variant="destructive" onClick={logout} className="w-full">
                      Se déconnecter
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <SheetClose asChild>
                        <Button variant="outline" asChild>
                          <Link to="/login">Connexion</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild>
                          <Link to="/register">Inscription</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default EnhancedHeader;
