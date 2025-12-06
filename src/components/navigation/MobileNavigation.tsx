// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  items: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 w-[280px] sm:w-[350px]">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fermer le menu">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 py-4">
          <nav className="flex flex-col space-y-1">
            <AnimatePresence>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {item.icon}
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 w-1 h-full bg-primary-foreground rounded-r-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </AnimatePresence>
          </nav>
          
          <div className="border-t mt-6 pt-6">
            <h3 className="text-sm font-medium mb-3">Actions rapides</h3>
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(false)}>
                    Mon profil
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(false)}>
                    Paramètres
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(false)}>
                    Support
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" onClick={() => setOpen(false)}>
                    Se connecter
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                    S'inscrire
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
