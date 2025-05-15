
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home,
  BookOpen,
  Music,
  Calendar,
  Smile,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const B2CNavBar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user_role');
      localStorage.removeItem('userMode');
      
      if (logout) {
        await logout();
      }
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { 
      label: "Tableau de bord", 
      icon: <Home className="h-5 w-5" />, 
      to: "/b2c/dashboard" 
    },
    { 
      label: "Journal émotionnel", 
      icon: <BookOpen className="h-5 w-5" />, 
      to: "/b2c/journal" 
    },
    { 
      label: "Musicothérapie", 
      icon: <Music className="h-5 w-5" />, 
      to: "/b2c/music" 
    },
    { 
      label: "Scan émotionnel", 
      icon: <Smile className="h-5 w-5" />, 
      to: "/b2c/scan" 
    },
    { 
      label: "Coach IA", 
      icon: <Calendar className="h-5 w-5" />, 
      to: "/b2c/coach" 
    }
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden" 
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar content */}
      <motion.aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-background/95 backdrop-blur-sm border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo and app name */}
          <div className="px-6 mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Mode particulier</p>
          </div>
          
          {/* User info */}
          <div className="px-6 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-sm">{user?.name || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "utilisateur@exemple.fr"}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-lg
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-muted text-foreground/80 hover:text-foreground'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Bottom actions */}
          <div className="mt-auto px-4 space-y-2">
            <NavLink
              to="/b2c/preferences"
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-lg w-full
                transition-colors duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted text-foreground/80 hover:text-foreground'
                }
              `}
            >
              <Settings className="h-5 w-5" />
              <span>Préférences</span>
            </NavLink>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default B2CNavBar;
