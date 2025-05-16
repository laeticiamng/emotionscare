
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  Home, 
  BarChart3, 
  Heart, 
  BookOpen, 
  Music, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { User as UserType } from '@/types/user';

interface MobileNavigationProps {
  onLogout?: () => void;
  user?: UserType;
  userMode?: 'b2c' | 'b2b_user' | 'b2b_admin' | null;
}

const MobileNavigation = ({ onLogout, user, userMode = 'b2c' }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  
  const getBaseRoute = () => {
    switch (userMode) {
      case 'b2b_user':
        return '/b2b/user';
      case 'b2b_admin':
        return '/b2b/admin';
      case 'b2c':
      default:
        return '/b2c';
    }
  };

  const baseRoute = getBaseRoute();
  
  const menuItems = [
    {
      name: 'Accueil',
      icon: <Home className="h-5 w-5" />,
      path: `${baseRoute}/dashboard`
    },
    {
      name: 'Scan Émotionnel',
      icon: <Heart className="h-5 w-5" />,
      path: `${baseRoute}/scan`,
      hideInAdmin: true
    },
    {
      name: 'Journal',
      icon: <BookOpen className="h-5 w-5" />,
      path: `${baseRoute}/journal`,
      hideInAdmin: true
    },
    {
      name: 'Musicothérapie',
      icon: <Music className="h-5 w-5" />,
      path: `${baseRoute}/music`,
      hideInAdmin: true
    },
    {
      name: 'Coach IA',
      icon: <MessageSquare className="h-5 w-5" />,
      path: `${baseRoute}/coach`,
      hideInAdmin: true
    },
    {
      name: 'Communauté',
      icon: <Users className="h-5 w-5" />,
      path: `${baseRoute}/community`,
      hideInAdmin: true
    },
    {
      name: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: `${baseRoute}/analytics`,
      onlyInAdmin: true
    },
    {
      name: 'Utilisateurs',
      icon: <User className="h-5 w-5" />,
      path: `${baseRoute}/users`,
      onlyInAdmin: true
    },
    {
      name: 'Paramètres',
      icon: <Settings className="h-5 w-5" />,
      path: `${baseRoute}/settings`
    }
  ];
  
  const filteredMenuItems = menuItems.filter(item => {
    if (userMode === 'b2b_admin') {
      return !item.hideInAdmin;
    } else {
      return !item.onlyInAdmin;
    }
  });
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col h-full">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-left">EmotionsCare</SheetTitle>
          {user && (
            <div className="flex items-center gap-3 pt-3">
              <Avatar>
                <AvatarImage src={user.avatar_url || user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
        </SheetHeader>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t pt-4 px-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
