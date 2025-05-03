
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, Scan, BookOpen, Users, 
  MonitorPlay, Library, Award, Settings, LogOut,
  BarChart
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { path: '/scan', icon: <Scan size={20} />, label: 'Scan émotionnel' },
    { path: '/journal', icon: <BookOpen size={20} />, label: 'Journal' },
    { path: '/community', icon: <Users size={20} />, label: 'Communauté' },
    { path: '/vr', icon: <MonitorPlay size={20} />, label: 'VR' },
    { path: '/library', icon: <Library size={20} />, label: 'Bibliothèque' },
    { path: '/gamification', icon: <Award size={20} />, label: 'Badges' },
    { path: '/reports', icon: <BarChart size={20} />, label: 'Rapports' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  ];
  
  return (
    <div className="h-screen flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-center p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-primary">Cocoon</h1>
      </div>
      
      {user && (
        <div className="flex flex-col items-center p-6 border-b border-sidebar-border">
          <Avatar className="w-16 h-16 mb-4">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">{user.name}</h3>
          <span className="text-xs text-muted-foreground">{user.role}</span>
          <div className="mt-2 text-xs px-3 py-1 bg-wellness-green rounded-full text-emerald-800">
            Score: {user.emotional_score}/100
          </div>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive" 
          onClick={logout}
        >
          <LogOut size={18} className="mr-2" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
