
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Music, 
  Heart, 
  MessageSquare, 
  Headset, 
  Settings,
  Trophy,
  LogOut 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: 'Accueil', path: '/dashboard', icon: Home },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Musicothérapie', path: '/music', icon: Music },
    { name: 'Scan émotionnel', path: '/scan', icon: Heart },
    { name: 'Coach IA', path: '/coach', icon: MessageSquare },
    { name: 'VR Immersive', path: '/vr', icon: Headset },
    { name: 'Gamification', path: '/gamification', icon: Trophy },
    { name: 'Préférences', path: '/settings', icon: Settings },
  ];

  return (
    <div className={cn("flex h-screen w-16 md:w-64 flex-col border-r bg-background", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-semibold md:inline hidden">EmotionsCare</span>
        <span className="text-lg font-semibold md:hidden">EC</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "transparent"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline-flex">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-2">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline-flex">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
