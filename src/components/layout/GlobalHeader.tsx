/**
 * GlobalHeader - Navigation unifiée EmotionsCare
 * Utilisé sur toutes les pages de l'application
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Brain, BookOpen, Music, ShoppingBag, User, LucideIcon } from 'lucide-react';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: Heart },
  { label: 'Scan', href: '/app/scan', icon: Brain },
  { label: 'Journal', href: '/app/journal', icon: BookOpen },
  { label: 'Musique', href: '/app/music', icon: Music },
  { label: 'Boutique', href: '/store', icon: ShoppingBag },
];

export const GlobalHeader: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">EmotionsCare</span>
        </Link>

        {/* Navigation principale */}
        <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Navigation principale">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href);
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-2">
          <CartDrawer />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profil</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation mobile */}
      <nav className="md:hidden border-t bg-background" role="navigation" aria-label="Navigation mobile">
        <div className="container mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href);
              
              return (
                <Link key={item.href} to={item.href} className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto flex-col gap-1 p-2",
                      isActive && "text-primary"
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
