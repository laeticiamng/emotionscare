// @ts-nocheck

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Settings, FileText, Music, Headphones, MessageCircle, 
  Glasses, Heart, Users, UserIcon, BookOpen, Calendar } from 'lucide-react';

export const GlobalNav = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Regrouper les routes par section pour une meilleure organisation
  const sections = [
    {
      title: "Navigation principale",
      routes: [
        { path: '/', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
        { path: '/dashboard', label: 'Tableau de bord', icon: <FileText className="w-4 h-4" /> },
        { path: '/profile', label: 'Profil', icon: <UserIcon className="w-4 h-4" />, requireAuth: true },
      ]
    },
    {
      title: "Fonctionnalités",
      routes: [
        { path: '/journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" />, requireAuth: true },
        { path: '/music', label: 'Musique', icon: <Music className="w-4 h-4" />, requireAuth: true },
        { path: '/coach', label: 'Coach', icon: <MessageCircle className="w-4 h-4" />, requireAuth: true },
        { path: '/vr', label: 'Réalité Virtuelle', icon: <Glasses className="w-4 h-4" />, requireAuth: true },
        { path: '/audio', label: 'Audio', icon: <Headphones className="w-4 h-4" />, requireAuth: true },
        { path: '/social', label: 'Social Cocoon', icon: <Heart className="w-4 h-4" />, requireAuth: true },
        { path: '/sessions', label: 'Sessions', icon: <Calendar className="w-4 h-4" />, requireAuth: true },
      ]
    },
    {
      title: "Information",
      routes: [
        { path: '/team', label: 'Équipe', icon: <Users className="w-4 h-4" /> },
        { path: '/support', label: 'Support', icon: <MessageCircle className="w-4 h-4" /> },
        { path: '/settings', label: 'Paramètres', icon: <Settings className="w-4 h-4" />, requireAuth: true },
      ]
    }
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Navigation rapide</h2>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{section.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {section.routes
                    .filter(route => !route.requireAuth || (route.requireAuth && isAuthenticated))
                    .map((route) => (
                      <Button
                        key={route.path}
                        size="sm"
                        variant={isActiveRoute(route.path) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => handleNavigation(route.path)}
                      >
                        {route.icon}
                        <span className="ml-2">{route.label}</span>
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GlobalNav;
