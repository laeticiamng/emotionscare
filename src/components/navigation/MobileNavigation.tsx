
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { getUserAvatarUrl, getUserInitials } from '@/utils/userUtils';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MobileNavigationProps {
  items: NavItem[];
}

export default function MobileNavigation({ items }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLinkClick = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/');
      setOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
      console.error(error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const avatarUrl = getUserAvatarUrl(user);
  const userInitials = getUserInitials(user);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {user && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-auto py-2">
          <ul className="grid gap-1 p-2">
            {items.map((item, index) => (
              <li key={index}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base" 
                  onClick={() => handleLinkClick(item.href)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          <ul className="grid gap-2">
            <li>
              <Button 
                variant="ghost"
                className="w-full justify-start"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Mode clair</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Mode sombre</span>
                  </>
                )}
              </Button>
            </li>
            {user ? (
              <>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleLinkClick('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleLinkClick('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button 
                  className="w-full"
                  onClick={() => handleLinkClick('/login')}
                >
                  Se connecter
                </Button>
              </li>
            )}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
