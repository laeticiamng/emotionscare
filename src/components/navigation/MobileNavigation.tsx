
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types';
import ThemeButton from '@/components/ui/sidebar/ThemeButton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavItem, SidebarNavItem } from "@/types/navigation";
import { NavLink } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';
import { safeOpen } from '@/lib/utils';

interface MobileNavProps {
  user: User | null;
  mainNavItems?: NavItem[]
  sidebarNavItems?: SidebarNavItem[]
}

const MobileNavigation: React.FC<MobileNavProps> = ({ user, mainNavItems, sidebarNavItems }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { setOpenDrawer } = useMusic();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:w-64 p-0">
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
                <span>{user.name}</span>
              </div>
            )}

            <Separator className="my-2" />

            <nav className="grid gap-6 mb-8">
              {mainNavItems?.length ? (
                mainNavItems.map(
                  (item, i) =>
                    item.href && (
                      <NavLink key={i} to={item.href} className="flex items-center text-sm">
                        {item.title}
                      </NavLink>
                    )
                )
              ) : null}
            </nav>

            {sidebarNavItems?.length ? (
              <div className="py-4">
                {sidebarNavItems.map((item, i) =>
                  item.href ? (
                    <NavLink key={i} to={item.href} className="flex items-center text-sm">
                      {item.title}
                    </NavLink>
                  ) : null
                )}
              </div>
            ) : null}

            <Separator className="my-2" />

            <ThemeButton collapsed={false} />

            <Separator className="my-2" />

            <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
              Déconnexion
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => safeOpen(setOpenDrawer)}
              className="w-full justify-start"
            >
              Ouvrir lecteur musical
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
