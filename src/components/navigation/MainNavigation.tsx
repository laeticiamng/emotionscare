/**
 * MainNavigation - Navigation principale accessible
 * Inclut la navigation mobile responsive et l'accessibilité complète
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Heart, 
  Building2, 
  Menu, 
  X, 
  User, 
  Settings, 
  HelpCircle,
  Phone,
  Mail,
  LogIn,
  UserPlus,
  Home,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
}

const b2cFeatures: NavItem[] = [
  {
    title: 'Scanner Émotionnel',
    href: '/app/scan',
    description: 'Analysez vos émotions en temps réel',
    icon: Sparkles
  },
  {
    title: 'Coach IA',
    href: '/app/coach',
    description: 'Accompagnement personnalisé 24h/24',
    icon: User,
    badge: 'IA'
  },
  {
    title: 'Journal Numérique',
    href: '/app/journal',
    description: 'Suivez votre évolution émotionnelle',
    icon: Heart
  },
  {
    title: 'Thérapie Musicale',
    href: '/app/music',
    description: 'Musique adaptée à vos émotions',
    icon: Heart,
    badge: 'Premium'
  },
];

const enterpriseFeatures: NavItem[] = [
  {
    title: 'Dashboard Équipe',
    href: '/enterprise/dashboard',
    description: 'Vue d\'ensemble du bien-être',
    icon: Building2
  },
  {
    title: 'Analytics RH',
    href: '/enterprise/reports',
    description: 'Métriques et insights avancés',
    icon: Settings
  },
  {
    title: 'Gestion Équipes',
    href: '/enterprise/teams',
    description: 'Organisation et collaboration',
    icon: User
  },
];

const supportLinks: NavItem[] = [
  {
    title: 'Centre d\'aide',
    href: '/help',
    description: 'Guides et documentation',
    icon: HelpCircle
  },
  {
    title: 'Nous contacter',
    href: '/contact',
    description: 'Support personnalisé',
    icon: Phone
  },
  {
    title: 'À propos',
    href: '/about',
    description: 'Notre mission et équipe',
    icon: Heart
  },
];

export default function MainNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détection du scroll pour adapter le header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-sm' 
          : 'bg-background'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
            aria-label="EmotionsCare - Retour à l'accueil"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-6" role="navigation">
            <Link 
              to="/b2c"
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary',
                isCurrentPath('/b2c') || isCurrentPath('/app') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              <Heart className="w-4 h-4" />
              <span>Particuliers</span>
            </Link>

            <Link 
              to="/entreprise"
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary',
                isCurrentPath('/entreprise') || isCurrentPath('/enterprise') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              <Building2 className="w-4 h-4" />
              <span>Entreprises</span>
            </Link>

            <Link 
              to="/help"
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary',
                isCurrentPath('/help') || isCurrentPath('/contact') || isCurrentPath('/about') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </Link>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Connexion</span>
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate('/signup')}
              className="flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Inscription</span>
            </Button>
          </div>

          {/* Menu Mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>EmotionsCare</span>
                </SheetTitle>
                <SheetDescription>
                  Navigation principale
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* B2C Section */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-primary" />
                    Particuliers
                  </h3>
                  <div className="space-y-2 ml-6">
                    <Link
                      to="/b2c"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Découvrir B2C
                    </Link>
                    {b2cFeatures.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.icon && <item.icon className="w-3 h-3" />}
                        <span>{item.title}</span>
                        {item.badge && <Badge variant="secondary" className="text-xs">{item.badge}</Badge>}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* B2B Section */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-primary" />
                    Entreprises
                  </h3>
                  <div className="space-y-2 ml-6">
                    <Link
                      to="/entreprise"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Solutions Entreprise
                    </Link>
                    {enterpriseFeatures.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.icon && <item.icon className="w-3 h-3" />}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Support Section */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2 text-primary" />
                    Support
                  </h3>
                  <div className="space-y-2 ml-6">
                    {supportLinks.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.icon && <item.icon className="w-3 h-3" />}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth Actions */}
                <div className="pt-6 border-t space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                  <Button 
                    className="w-full justify-start"
                    onClick={() => navigate('/signup')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscription Gratuite
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}