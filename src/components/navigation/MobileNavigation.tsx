
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Building, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserMode } from '@/contexts/UserModeContext';
import { isAdminRole } from '@/utils/roleUtils';
import { Badge } from '@/components/ui/badge';

interface MobileNavProps {
  user: User | null;
}

const MobileNavigation: React.FC<MobileNavProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();

  const handleLogout = async () => {
    await logout?.();
    navigate('/login');
  };

  const mainNavItems = [
    { title: 'Accueil', href: '/' },
    { title: 'Scan émotionnel', href: '/scan' },
    { title: 'Journal', href: '/journal' },
    { title: 'Musicothérapie', href: '/music' },
    { title: 'VR thérapie', href: '/vr' },
    { title: 'Coach IA', href: '/coach' },
  ];
  
  const adminNavItems = [
    { title: 'Tableau de bord', href: '/admin/dashboard', icon: BarChart2 },
    { title: 'Gestion utilisateurs', href: '/admin/users', icon: Users },
    { title: 'Gestion d\'entreprise', href: '/admin/organization', icon: Building },
  ];
  
  // Check if user has admin role
  const isAdmin = user ? isAdminRole(user.role) : false;
  const isB2BMode = userMode === 'b2b-admin';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col space-y-1 text-sm font-medium p-4">
            <SheetHeader className="pl-0 pb-4 pt-4">
              <SheetTitle className="text-lg">
                {user ? `Bonjour, ${user.name}` : 'Menu'}
              </SheetTitle>
              <SheetDescription>
                Explorez les différentes sections de EmotionsCare.
              </SheetDescription>
            </SheetHeader>

            {user && (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar || "/avatars/placeholder.jpg"} alt={user.name || "Utilisateur"} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <span>{user.name}</span>
                  {isAdmin && <Badge className="ml-2" variant="outline">Admin</Badge>}
                </div>
              </div>
            )}

            <Separator className="my-2" />
            
            {isAdmin && (
              <>
                <div className="mb-2 px-2 text-xs text-muted-foreground">
                  Mode: {isB2BMode ? 'Administrateur' : 'Particulier'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setUserMode(isB2BMode ? 'b2c' : 'b2b-admin')}
                  className="mb-2"
                >
                  Passer en mode {isB2BMode ? 'Particulier' : 'Administrateur'}
                </Button>
                <Separator className="my-2" />
              </>
            )}

            <nav className="grid gap-2 mb-6">
              {isAdmin && isB2BMode ? (
                // Admin navigation items
                adminNavItems.map((item, i) => (
                  <NavLink 
                    key={i} 
                    to={item.href} 
                    className={({ isActive }) => 
                      `flex items-center px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${
                        isActive ? "bg-muted font-medium" : ""
                      }`
                    }
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </NavLink>
                ))
              ) : (
                // Regular navigation items
                mainNavItems.map((item, i) => (
                  <NavLink 
                    key={i} 
                    to={item.href} 
                    className={({ isActive }) => 
                      `flex items-center px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${
                        isActive ? "bg-muted font-medium" : ""
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))
              )}
            </nav>

            <Separator className="my-2" />

            {user ? (
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                Déconnexion
              </Button>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="default" className="w-full">
                  <NavLink to="/login">Se connecter</NavLink>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <NavLink to="/register">S'inscrire</NavLink>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
