
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Eye,
  BookOpen, 
  Users, 
  Award, 
  VrCardboard, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
  { path: '/scan', label: 'Scan émotionnel', icon: <Eye className="w-5 h-5 mr-2" /> },
  { path: '/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { path: '/community', label: 'Communauté', icon: <Users className="w-5 h-5 mr-2" /> },
  { path: '/gamification', label: 'Gamification', icon: <Award className="w-5 h-5 mr-2" /> },
  { path: '/vr', label: 'VR Session', icon: <VrCardboard className="w-5 h-5 mr-2" /> }
];

const GlobalNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-background border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-lg text-primary">EmotionsCare</span>
          <span className="text-xs text-muted-foreground">par ResiMax™ 4.0</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavLink to={item.path}>
                    {({isActive}) => (
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          isActive && "bg-accent text-accent-foreground",
                          "flex items-center"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        {/* User Profile */}
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-right mr-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="px-2">
              <div className="flex items-center justify-between mb-6">
                <NavLink to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-xl text-primary">EmotionsCare</span>
                </NavLink>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {user && (
                <div className="flex items-center gap-3 p-4 mb-4 bg-muted/50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              )}
              
              <nav className="flex flex-col space-y-3">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center py-2 px-3 rounded-md transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-destructive mt-4" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Déconnexion</span>
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default GlobalNav;
