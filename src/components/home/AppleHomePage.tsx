/**
 * AppleHomePage - Homepage révolutionnaire style Apple
 * Minimaliste, impactante, avec animations fluides et storytelling visuel
 */

import React, { lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleHeroSection from '@/components/home/AppleHeroSection';
import AppleFeatureSection from '@/components/home/AppleFeatureSection';
import AppleShowcaseSection from '@/components/home/AppleShowcaseSection';
import AppleStatsSection from '@/components/home/AppleStatsSection';
import AppleCTASection from '@/components/home/AppleCTASection';
import CookieConsent from '@/components/home/CookieConsent';
import { useState } from 'react';

// Lazy load non-critical sections
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
              EmotionsCare
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
              <Link to="/navigation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tarifs
              </Link>
              <Link to="/b2b" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Entreprise
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                À propos
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/app/home">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Mon espace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
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
                  to="/navigation" 
                  className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fonctionnalités
                </Link>
                <Link 
                  to="/pricing" 
                  className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link 
                  to="/b2b" 
                  className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entreprise
                </Link>
                <Link 
                  to="/about" 
                  className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  À propos
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

      <main id="main-content" role="main" className="pt-16">
        {/* Hero Section - Full viewport, impactant */}
        <AppleHeroSection />

        {/* Features Section - Scroll reveal */}
        <AppleFeatureSection />

        {/* Showcase Section - Immersive demo */}
        <AppleShowcaseSection />

        {/* Stats Section - Chiffres animés */}
        <AppleStatsSection />

        {/* CTA Section - Final push */}
        <AppleCTASection />
      </main>

      {/* Footer */}
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default AppleHomePage;
