
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Building, BarChart2, Users, Home, Heart, FileText, Music, MessageSquare, Headphones, X, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserMode } from '@/contexts/UserModeContext';
import { Badge } from '@/components/ui/badge';
import { isAdminRole } from '@/utils/roleUtils';

const MobileNavigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user ? isAdminRole(user.role) : false;
  const isB2BMode = userMode === 'b2b-admin';
  
  const mainLinks = [
    { title: 'Accueil', href: '/', icon: Home },
    { title: 'Tableau de bord', href: '/dashboard', icon: BarChart2 },
    { title: 'Scan émotionnel', href: '/scan', icon: Heart },
    { title: 'Journal', href: '/journal', icon: FileText },
    { title: 'Musicothérapie', href: '/music', icon: Music },
    { title: 'Coach IA', href: '/coach', icon: MessageSquare }
  ];

  const adminLinks = [
    { title: 'Dashboard Admin', href: '/admin/dashboard', icon: BarChart2 },
    { title: 'Gestion utilisateurs', href: '/admin/users', icon: Users },
    { title: 'Gestion d\'entreprise', href: '/admin/organization', icon: Building }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
                adminLinks.map((item, i) => (
                  <NavLink 
                    key={i} 
                    to={item.href} 
                    className={({ isActive }) => 
                      `flex items-center px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${
                        isActive ? "bg-muted font-medium" : ""
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </NavLink>
                ))
              ) : (
                // Regular navigation items
                mainLinks.map((item, i) => (
                  <NavLink 
                    key={i} 
                    to={item.href} 
                    className={({ isActive }) => 
                      `flex items-center px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${
                        isActive ? "bg-muted font-medium" : ""
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </NavLink>
                ))
              )}
            </nav>

            <Separator className="my-2" />

            {user ? (
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/settings');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="default" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <NavLink to="/login">Se connecter</NavLink>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
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
