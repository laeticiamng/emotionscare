
// Corrigeons l'erreur avec le composant SheetContent qui n'accepte pas la propriété 'side'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/types/user';
import { Bell, Menu, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';

interface MainNavbarProps {
  user?: User;
  onLogout?: () => void;
  unreadNotifications?: number;
}

export function MainNavbar({ user, onLogout, unreadNotifications = 0 }: MainNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%]">
              <SheetHeader>
                <SheetTitle>EmotionsCare</SheetTitle>
                <SheetDescription>
                  Votre plateforme de bien-être émotionnel
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/b2c/dashboard" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/b2c/scan" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Scan Émotionnel
                </Link>
                <Link to="/b2c/journal" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Journal
                </Link>
                <Link to="/b2c/music" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Musique
                </Link>
                <Link to="/b2c/coach" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Coach
                </Link>
                <Link to="/b2c/community" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Communauté
                </Link>
                <Link to="/b2c/settings" className="font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Paramètres
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            EmotionsCare
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/b2c/dashboard" className="font-medium">
              Dashboard
            </Link>
            <Link to="/b2c/scan" className="font-medium">
              Scan
            </Link>
            <Link to="/b2c/journal" className="font-medium">
              Journal
            </Link>
            <Link to="/b2c/music" className="font-medium">
              Musique
            </Link>
            <Link to="/b2c/coach" className="font-medium">
              Coach
            </Link>
            <Link to="/b2c/community" className="font-medium">
              Communauté
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDrawer />
          <Link to="/b2c/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/b2c/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/b2c/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainNavbar;
