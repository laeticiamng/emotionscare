
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { Menu, Home, Settings, Heart, FileText, Music, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  requireAuth = true
}) => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useLayout();
  const navigate = useNavigate();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoading, isAuthenticated, navigate, requireAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Chargement...</p>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // L'effet useEffect va rediriger, pas besoin de rendre quoi que ce soit ici
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Accueil', path: '/' },
    { icon: <Heart className="w-5 h-5" />, label: 'Scan Émotionnel', path: '/app/scan' },
    { icon: <FileText className="w-5 h-5" />, label: 'Journal', path: '/app/journal' },
    { icon: <Music className="w-5 h-5" />, label: 'Musicothérapie', path: '/app/music' },
    { icon: <User className="w-5 h-5" />, label: 'Profil', path: '/settings/profile' },
    { icon: <Settings className="w-5 h-5" />, label: 'Paramètres', path: '/settings/general' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-lg md:hidden"
        >
          <div className="p-4 border-b">
            <h2 className="font-bold text-xl">EmoCare</h2>
            <p className="text-sm text-muted-foreground">Votre bien-être émotionnel</p>
          </div>
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    toggleSidebar();
                    navigate(item.path);
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Déconnexion</span>
              </Button>
            </nav>
          </div>
        </motion.div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <div className="flex-1 flex items-center">
            <Button variant="ghost" className="font-bold text-lg" onClick={() => navigate('/')}>
              EmoCare
            </Button>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8 space-x-2">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center"
                >
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Déconnexion
              </Button>
            )}
            <ModeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-muted/20">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
