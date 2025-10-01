// @ts-nocheck

// @ts-nocheck
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import AdaptiveNavigation from './AdaptiveNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileNavProps {
  className?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  
  const currentRole = user?.role || userMode || 'guest';
  
  const getRoleBadge = () => {
    switch (currentRole) {
      case 'b2c': return { label: 'Particulier', variant: 'default' as const };
      case 'b2b_user': return { label: 'Collaborateur', variant: 'secondary' as const };
      case 'b2b_admin': return { label: 'Admin RH', variant: 'destructive' as const };
      default: return { label: 'Invité', variant: 'outline' as const };
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };
  
  const handleNavItemClick = () => {
    setOpen(false);
  };
  
  const roleBadge = getRoleBadge();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu de navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header avec profil utilisateur */}
          <SheetHeader className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar_url} alt={user?.name || 'Utilisateur'} />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-left">
                  {user?.name || 'Utilisateur'}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={roleBadge.variant} className="text-xs">
                    {roleBadge.label}
                  </Badge>
                  {isAuthenticated && (
                    <div className="h-2 w-2 bg-green-500 rounded-full" title="Connecté" />
                  )}
                </div>
              </div>
            </div>
          </SheetHeader>
          
          {/* Navigation principale */}
          <div className="flex-1 overflow-auto px-4 py-4">
            {isAuthenticated ? (
              <AdaptiveNavigation 
                variant="sidebar"
                showCategories={true}
                onItemClick={handleNavItemClick}
              />
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Connexion Requise</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connectez-vous pour accéder à toutes les fonctionnalités
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      navigate('/b2c/login');
                      setOpen(false);
                    }}
                    className="w-full"
                  >
                    Se connecter
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/choose-mode');
                      setOpen(false);
                    }}
                    className="w-full"
                  >
                    Choisir le mode
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer avec actions rapides */}
          {isAuthenticated && (
            <>
              <Separator />
              <div className="p-4 space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/settings');
                    setOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
