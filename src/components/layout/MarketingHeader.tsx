/**
 * MarketingHeader - Header pour les pages marketing/publiques
 * Design moderne et épuré avec navigation simple
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '@/providers/theme';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface MarketingHeaderProps {
  className?: string;
}

const MarketingHeader: React.FC<MarketingHeaderProps> = ({ className }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = resolvedTheme === 'dark';

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Fonctionnalités', href: '#features', icon: Sparkles },
    { label: 'Entreprises', href: '/entreprise', icon: Building2 },
    { label: 'À propos', href: '/about', icon: Users },
    { label: 'Aide', href: '/help', icon: HelpCircle },
  ];

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/90 backdrop-blur-lg border-b border-border/50 shadow-sm" 
          : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            aria-label="EmotionsCare - Accueil"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-blue-500 flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              EmotionsCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/80 hover:text-accent-foreground",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              className="rounded-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/app/dashboard" className="gap-2">
                    Mon espace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="text-foreground/80 hover:text-foreground">
                    <Link to="/login">Connexion</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-primary to-primary/80 shadow-md hover:shadow-lg">
                    <Link to="/signup" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Essai gratuit
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    EmotionsCare
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="mt-8 flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 flex flex-col gap-3 px-4">
                  {isAuthenticated ? (
                    <Button asChild className="w-full">
                      <Link to="/app/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        Mon espace
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          Connexion
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/80">
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                          Essai gratuit
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketingHeader;
