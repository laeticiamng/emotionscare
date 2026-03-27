// @ts-nocheck
/**
 * SharedHeader - Header partagé entre HomePage et MarketingLayout
 * Style Apple minimal, backdrop-blur, responsive
 */

import React, { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SharedHeaderProps {
  /** Extra elements to render in desktop CTA area (e.g. XPBar) */
  extraDesktopCTA?: React.ReactNode;
}

const NAV_LINKS = [
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/pricing', label: 'Tarifs' },
  { to: '/b2b', label: 'Entreprise' },
  { to: '/about', label: 'À propos' },
] as const;

const SharedHeader: React.FC<SharedHeaderProps> = ({ extraDesktopCTA }) => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-display font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <Heart className="h-5 w-5 text-primary inline-block mr-1.5" aria-hidden="true" />
            EmotionsCare
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'text-sm transition-colors',
                  isActive(to)
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {extraDesktopCTA}
                <Link to="/app/home">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Mon espace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Se connecter</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full px-6">Essai gratuit</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-y-auto"
            style={{ maxHeight: 'calc(100dvh - 4rem)' }}
          >
            <nav className="container px-4 py-6 space-y-4 safe-area-bottom">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'block text-lg transition-colors',
                    isActive(to)
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <Link to="/app/home" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Mon espace</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Se connecter</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Essai gratuit</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default memo(SharedHeader);
