
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, User, Home, Plus, List, Settings, Brain, MessageSquare, Building, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserMode } from '@/contexts/UserModeContext';
import { isAdminRole } from '@/utils/roleUtils';
import { toast } from 'sonner';
import { getUserAvatarUrl, getUserInitials } from '@/lib/utils';

const GlobalNav = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { userMode } = useUserMode();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      window.location.href = '/login';
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };
  
  // Check if user has admin role
  const isAdmin = user ? isAdminRole(user.role) : false;
  const isB2BMode = userMode === 'b2b_admin' || userMode === 'b2b_user';
  
  // Define menu items based on user role and mode
  const standardMenuItems = [
    { icon: Home, title: 'Accueil', path: '/' },
    { icon: Plus, title: 'Scanner', path: '/scan' },
    { icon: Brain, title: 'Coach IA', path: '/coach' },
    { icon: MessageSquare, title: 'Discussions Coach', path: '/coach-chat' },
  ];
  
  const adminMenuItems = [
    { icon: Home, title: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, title: 'Utilisateurs', path: '/admin/users' },
    { icon: Building, title: 'Organisation', path: '/admin/organization' },
  ];
  
  const menuItems = isB2BMode && isAdmin ? adminMenuItems : standardMenuItems;
  
  const avatarUrl = getUserAvatarUrl(user);
  const userInitials = getUserInitials(user);
  
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center font-semibold">
            <img src="/logo.svg" alt="EmotionsCare Logo" className="h-8 w-auto mr-2" />
            EmotionsCare
            {isB2BMode && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">B2B</span>}
          </NavLink>
        </div>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button 
            onClick={toggleMenu} 
            className="text-muted-foreground focus:outline-none"
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
          >
            <List className="h-6 w-6" />
          </button>
        )}
        
        <div className={`items-center space-x-6 ${isMobile ? 'hidden' : 'flex'}`}>
          <ul className="flex items-center space-x-6">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? "text-primary font-medium flex items-center space-x-1" : "hover:text-primary transition-colors flex items-center space-x-1"}
                  aria-label={item.title}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 mr-1" />
            ) : (
              <Moon className="h-4 w-4 mr-1" />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" aria-label="Menu utilisateur">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={avatarUrl}
                      alt={user.name || "Utilisateur"} 
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                  <User className="h-4 w-4 mr-2" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                  <Home className="h-4 w-4 mr-2" />
                  <span>Tableau de bord</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => window.location.href = '/login'}>Se connecter</Button>
          )}
        </div>
        
        {/* Mobile Menu (conditionally rendered) */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-md mt-1 overflow-hidden z-50">
            <ul className="divide-y divide-border">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path} 
                    className="block py-2 px-4 hover:bg-muted transition-colors" 
                    onClick={toggleMenu}
                  >
                    <item.icon className="h-4 w-4 inline-block mr-2" />
                    {item.title}
                  </NavLink>
                </li>
              ))}
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="block py-2 px-4 hover:bg-muted transition-colors w-full justify-start" 
                  onClick={() => { 
                    setTheme(theme === "dark" ? "light" : "dark"); 
                    toggleMenu(); 
                  }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 inline-block mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 inline-block mr-2" />
                  )}
                  {theme === "dark" ? "Light" : "Dark"}
                </Button>
              </li>
              {user ? (
                <>
                  <li>
                    <NavLink to="/profile" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                      <User className="h-4 w-4 inline-block mr-2" />
                      Mon profil
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                      <Home className="h-4 w-4 inline-block mr-2" />
                      Tableau de bord
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/settings" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                      <Settings className="h-4 w-4 inline-block mr-2" />
                      Paramètres
                    </NavLink>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="block py-2 px-4 hover:bg-muted transition-colors w-full justify-start text-destructive" 
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="block py-2 px-4 hover:bg-muted transition-colors w-full justify-start" 
                    onClick={() => window.location.href = '/login'}
                  >
                    Se connecter
                  </Button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GlobalNav;
