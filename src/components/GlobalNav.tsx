
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, User, Home, Plus, List, Settings, Brain, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from '@/hooks/use-mobile';

const GlobalNav = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center font-semibold">
            <img src="/logo.svg" alt="EmotionsCare Logo" className="h-8 w-auto mr-2" />
            EmotionsCare
          </NavLink>
        </div>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button onClick={toggleMenu} className="text-muted-foreground focus:outline-none">
            <List className="h-6 w-6" />
          </button>
        )}
        
        <div className={`items-center space-x-6 ${isMobile ? 'hidden' : 'flex'}`}>
          <ul className="flex items-center space-x-6">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-medium" : "hover:text-primary transition-colors"}>
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/scan" className={({ isActive }) => isActive ? "text-primary font-medium" : "hover:text-primary transition-colors"}>
                <Plus className="h-4 w-4" />
                <span>Scanner</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/coach" className={({ isActive }) => isActive ? "text-primary font-medium" : "hover:text-primary transition-colors"}>
                <Brain className="h-4 w-4" />
                <span>Coach IA</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/coach-chat" className={({ isActive }) => isActive ? "text-primary font-medium" : "hover:text-primary transition-colors"}>
                <MessageSquare className="h-4 w-4" />
                <span>Discussions Coach</span>
              </NavLink>
            </li>
          </ul>
          
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.avatar || user.avatar_url} 
                      alt={user.name} 
                    />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
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
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => window.location.href = '/login'}>Se connecter</Button>
          )}
        </div>
        
        {/* Mobile Menu (conditionally rendered) */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-md mt-1 overflow-hidden">
            <ul className="divide-y divide-border">
              <li>
                <NavLink to="/" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                  <Home className="h-4 w-4 inline-block mr-2" />
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink to="/scan" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                  <Plus className="h-4 w-4 inline-block mr-2" />
                  Scanner
                </NavLink>
              </li>
              <li>
                <NavLink to="/coach" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                  <Brain className="h-4 w-4 inline-block mr-2" />
                  Coach IA
                </NavLink>
              </li>
              <li>
                <NavLink to="/coach-chat" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                  <MessageSquare className="h-4 w-4 inline-block mr-2" />
                  Discussions Coach
                </NavLink>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="block py-2 px-4 hover:bg-muted transition-colors w-full justify-start" onClick={() => { toggleTheme(); toggleMenu(); }}>
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
                    <NavLink to="/settings" className="block py-2 px-4 hover:bg-muted transition-colors" onClick={toggleMenu}>
                      <Settings className="h-4 w-4 inline-block mr-2" />
                      Paramètres
                    </NavLink>
                  </li>
                  <li>
                    <Button variant="ghost" size="sm" className="block py-2 px-4 hover:bg-muted transition-colors w-full justify-start" onClick={signOut}>
                      Déconnexion
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <Button variant="ghost" size="sm" className="block py-2 px-4 hover:bg-muted transition-colors w-full justify-start" onClick={() => window.location.href = '/login'}>
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
