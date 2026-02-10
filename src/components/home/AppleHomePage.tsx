/**
 * AppleHomePage - Homepage révolutionnaire style Apple
 * Minimaliste, impactante, avec animations fluides et storytelling visuel
 */

import React, { lazy, Suspense, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X, HelpCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleHeroSection from '@/components/home/AppleHeroSection';
import { cn } from '@/lib/utils';
import NyveeChat from '@/components/nyvee/NyveeChat';
import XPBar from '@/components/gamification/XPBar';

// Lazy load below-the-fold sections for better FCP/LCP
const AppleFeatureSection = lazy(() => import('@/components/home/AppleFeatureSection'));
const AppleShowcaseSection = lazy(() => import('@/components/home/AppleShowcaseSection'));
const AppleStatsSection = lazy(() => import('@/components/home/AppleStatsSection'));
const AppleCTASection = lazy(() => import('@/components/home/AppleCTASection'));
const Footer = lazy(() => import('@/components/home/Footer'));

// Skeleton for lazy sections
const SectionSkeleton = () => (
  <div className="py-16 bg-background">
    <div className="container">
      <div className="h-48 bg-muted/30 rounded-2xl animate-pulse" />
    </div>
  </div>
);

const AppleHomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none"
      >
        Aller au contenu principal
      </a>

      {/* Premium Header - Minimal Apple-style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
            >
              <Heart className="h-5 w-5 text-primary inline-block mr-1.5" />
              EmotionsCare
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
              <Link 
                to="/features" 
                className={cn(
                  "text-sm transition-colors",
                  isActive('/features') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Fonctionnalités
              </Link>
              <Link 
                to="/pricing" 
                className={cn(
                  "text-sm transition-colors",
                  isActive('/pricing') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tarifs
              </Link>
              <Link 
                to="/b2b" 
                className={cn(
                  "text-sm transition-colors",
                  isActive('/b2b') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Entreprise
              </Link>
              <Link 
                to="/about" 
                className={cn(
                  "text-sm transition-colors",
                  isActive('/about') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                À propos
              </Link>
              <Link 
                to="/help" 
                className={cn(
                  "text-sm transition-colors flex items-center gap-1",
                  isActive('/help') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Aide
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <XPBar />
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
                    <Button size="sm" className="rounded-full px-6">Commencer</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
              className="md:hidden bg-background border-t border-border"
            >
              <nav className="container px-4 py-6 space-y-4">
                <Link 
                  to="/features" 
                  className={cn(
                    "block text-lg transition-colors",
                    isActive('/features') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fonctionnalités
                </Link>
                <Link 
                  to="/pricing" 
                  className={cn(
                    "block text-lg transition-colors",
                    isActive('/pricing') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link 
                  to="/b2b" 
                  className={cn(
                    "block text-lg transition-colors",
                    isActive('/b2b') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entreprise
                </Link>
                <Link 
                  to="/about" 
                  className={cn(
                    "block text-lg transition-colors",
                    isActive('/about') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  À propos
                </Link>
                <Link 
                  to="/help" 
                  className={cn(
                    "block text-lg transition-colors flex items-center gap-2",
                    isActive('/help') ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  Aide & Support
                </Link>
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
                        <Button className="w-full">Commencer</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="main-content" role="main" className="pt-16">
        {/* Hero Section - Full viewport, impactant */}
        <AppleHeroSection />

        {/* Below-fold sections - lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <AppleFeatureSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AppleShowcaseSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AppleStatsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AppleCTASection />
        </Suspense>
      </main>

      {/* Footer */}
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>

      {/* Coach IA Nyvée - bulle flottante */}
      <NyveeChat />
    </div>
  );
};

export default AppleHomePage;
