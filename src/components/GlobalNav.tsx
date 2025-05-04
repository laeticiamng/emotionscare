
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scan, 
  BookOpen, 
  Users, 
  Award, 
  Glasses, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from 'react';

const mainNavItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
  { path: '/scan', label: 'Scan émotionnel', icon: <Scan className="w-5 h-5 mr-2" /> },
  { path: '/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { path: '/community', label: 'Communauté', icon: <Users className="w-5 h-5 mr-2" /> },
  { path: '/gamification', label: 'Gamification', icon: <Award className="w-5 h-5 mr-2" /> },
  { path: '/vr', label: 'VR Session', icon: <Glasses className="w-5 h-5 mr-2" /> }
];

const GlobalNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-lg text-primary">EmotionsCare</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
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
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default GlobalNav;
