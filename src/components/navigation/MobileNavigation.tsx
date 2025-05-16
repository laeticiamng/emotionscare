
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { X, Menu, Home, Settings, Bell, User, Moon, Sun, Users, BookOpen } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '../theme/ThemeToggle';

interface MobileNavigationProps {
  className?: string;
}

const MobileDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ open, onClose, children, className = '' }) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={`sm:max-w-[425px] ${className}`}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      href: '/',
      label: 'Accueil',
      icon: Home,
      requiresAuth: false,
    },
    {
      href: '/scan',
      label: 'Scanner',
      icon: Bell,
      requiresAuth: true,
    },
    {
      href: '/journal',
      label: 'Journal',
      icon: BookOpen,
      requiresAuth: true,
    },
    {
      href: '/community',
      label: 'Communauté',
      icon: Users,
      requiresAuth: true,
    },
    {
      href: '/profile',
      label: 'Profil',
      icon: User,
      requiresAuth: true,
    },
    {
      href: '/preferences',
      label: 'Préférences',
      icon: Settings,
      requiresAuth: true,
    },
  ];

  return (
    <div className={`sm:hidden ${className}`}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <span className="font-bold text-lg">EmotionsCare</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col space-y-1 p-4">
            {menuItems.map(
              (item) =>
                (!item.requiresAuth || isAuthenticated) && (
                  <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
            )}
          </nav>

          <div className="mt-auto p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Déconnexion
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" className="w-full mb-2">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </MobileDrawer>
    </div>
  );
};

export default MobileNavigation;
