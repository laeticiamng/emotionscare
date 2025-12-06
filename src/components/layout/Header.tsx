/**
 * HEADER PREMIUM EMOTIONSCARE - Version Complète
 * Navigation principale responsive avec toutes les fonctionnalités premium
 */

import React, { useState, useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Globe,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Zap,
  Crown,
  Shield,
  Headphones,
  Brain,
  Music,
  Camera,
  Sparkles,
  HelpCircle,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/providers/theme';
import { supabase } from '@/integrations/supabase/client';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const getXpRequirementForLevel = (level: number) => {
  const base = 120;
  const increment = 80;
  return Math.max(base, Math.round(base + (level - 1) * increment));
};

interface LevelStats {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
}

const calculateLevelStats = (rawXp: number): LevelStats => {
  const totalXp = Number.isFinite(rawXp) ? Math.max(0, Math.floor(rawXp)) : 0;

  let level = 1;
  let xpRemaining = totalXp;
  let requirement = getXpRequirementForLevel(level);

  while (xpRemaining >= requirement) {
    xpRemaining -= requirement;
    level += 1;
    requirement = getXpRequirementForLevel(level);
  }

  const progress = requirement > 0 ? xpRemaining / requirement : 0;

  return {
    level,
    xpIntoLevel: Math.max(0, Math.floor(xpRemaining)),
    xpForNextLevel: Math.max(1, Math.floor(requirement)),
    progress: clamp(progress),
  };
};

interface HeaderProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'transparent';
}

const Header: React.FC<HeaderProps> = ({ 
  className,
  variant = 'default'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [xp, setXp] = useState<number>(0);
  const [isLoadingXp, setIsLoadingXp] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const xpStats = useMemo(() => calculateLevelStats(xp), [xp]);
  const xpFormatter = useMemo(() => new Intl.NumberFormat('fr-FR'), []);
  const xpProgressPercent = useMemo(() => Math.round(xpStats.progress * 100), [xpStats.progress]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const parseXpValue = (value: unknown) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    const loadXp = async () => {
      if (!isAuthenticated || !user?.id) {
        if (isMounted) {
          setXp(0);
          setIsLoadingXp(false);
        }
        return;
      }

      setIsLoadingXp(true);

      try {
        // Note: xp column does not exist in profiles table
        // Using default value for now
        const data = { xp: 0 };

        if (data && isMounted) {
          setXp(parseXpValue(data.xp));
        }
      } catch (error) {
        logger.error('Erreur lors du chargement des points XP', error as Error, 'AUTH');
      } finally {
        if (isMounted) {
          setIsLoadingXp(false);
        }
      }
    };

    loadXp();

    if (isAuthenticated && user?.id) {
      const channel = supabase
        .channel(`xp-tracker-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            const newXp = parseXpValue((payload.new as Record<string, unknown>)?.xp);
            if (isMounted) {
              setXp(newXp);
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  // Navigation items configuration
  interface NavItem {
    label: string;
    href: string;
    icon: typeof Heart;
    badge?: string;
    children?: Array<{ label: string; href: string }>;
  }

  const guestNavItems: NavItem[] = [
    { label: 'Accueil', href: '/', icon: Heart },
    { label: 'Personnel (B2C)', href: '/b2c', icon: User },
    { label: 'Entreprise (B2B)', href: '/entreprise', icon: Building2 },
    { label: 'Tarifs', href: '/pricing', icon: Crown },
    { label: 'Aide', href: '/help', icon: HelpCircle },
  ];

  const authenticatedNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/app/home', icon: Heart },
    { 
      label: 'Scanner', 
      href: '/app/scan', 
      icon: Camera,
      badge: 'IA',
      children: [
        { label: 'Scan Facial', href: '/app/scan/facial' },
        { label: 'Analyse Vocale', href: '/app/scan/voice' },
        { label: 'Analyse de Texte', href: '/app/scan/text' },
      ]
    },
    { 
      label: 'Musique', 
      href: '/app/music', 
      icon: Music,
      badge: 'Suno',
      children: [
        { label: 'Thérapie Musicale', href: '/app/music' },
        { label: 'Génération IA', href: '/app/music/generate' },
        { label: 'Bibliothèque', href: '/app/music/library' },
      ]
    },
    { 
      label: 'Coach IA', 
      href: '/app/coach', 
      icon: Brain,
      badge: 'Premium',
      children: [
        { label: 'Chat avec Nyvée', href: '/app/coach' },
        { label: 'Séances guidées', href: '/app/coach/sessions' },
        { label: 'Programmes', href: '/app/coach/programs' },
      ]
    },
    { label: 'Journal', href: '/app/journal', icon: Sparkles },
    { 
      label: 'Bien-être', 
      href: '/app/breath', 
      icon: Zap,
      children: [
        { label: 'Respiration', href: '/app/breath' },
        { label: 'VR Thérapie', href: '/app/vr-breath-guide' },
        { label: 'Méditation', href: '/app/meditation' },
      ]
    },
  ];

  const navigationItems = isAuthenticated ? authenticatedNavItems : guestNavItems;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      logger.error('Erreur lors de la déconnexion', error as Error, 'AUTH');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const getUserInitials = (email?: string) => {
    if (!email) return 'U';
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  // Quick access buttons for authenticated users
  const quickActions = [
    { icon: Camera, label: 'Scan Rapide', action: () => navigate('/app/scan') },
    { icon: Music, label: 'Musique', action: () => navigate('/app/music') },
    { icon: Brain, label: 'Coach', action: () => navigate('/app/coach') },
    { icon: Headphones, label: 'VR', action: () => navigate('/app/vr-breath-guide') },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 border-b',
        variant === 'transparent'
          ? 'bg-transparent border-transparent'
          : isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-border/50'
            : 'bg-background/90 backdrop-blur-sm border-border',
        className
      )}
      role="banner"
      aria-label="Navigation principale EmotionsCare"
      id="global-navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Premium */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-bold group focus-enhanced"
            aria-label="EmotionsCare - Retour à l'accueil"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Heart className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:via-primary group-hover:to-primary transition-all">
              EmotionsCare
            </span>
            <Badge variant="secondary" className="text-xs font-semibold">
              Premium
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-1"
            aria-label="Navigation principale"
          >
            {navigationItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all focus-enhanced',
                          isActiveRoute(item.href)
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            to={child.href}
                            className="flex items-center gap-2"
                            aria-current={isActiveRoute(child.href) ? 'page' : undefined}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all focus-enhanced',
                      isActiveRoute(item.href)
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Search Premium */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Recherche intelligente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 focus-visible:w-80 transition-all duration-300 bg-background/50"
              />
            </form>

            {/* Quick Actions for Authenticated Users */}
            {isAuthenticated && (
              <div className="flex items-center gap-1">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    className="w-9 h-9 p-0 hover:bg-primary/10"
                    title={action.label}
                    aria-label={action.label}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            )}

            {isAuthenticated && (
              <div className="hidden xl:flex flex-col items-start justify-center min-w-[180px]">
                <div className="flex w-full items-center justify-between text-[11px] text-muted-foreground">
                  <span>Niveau {xpStats.level}</span>
                  <span>{xpProgressPercent}%</span>
                </div>
                <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                  {isLoadingXp ? (
                    <div className="absolute inset-0 animate-pulse bg-muted-foreground/20" />
                  ) : (
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgressPercent}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                  )}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {xpFormatter.format(xpStats.xpIntoLevel)} / {xpFormatter.format(xpStats.xpForNextLevel)} XP
                </div>
              </div>
            )}

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost" 
                  size="sm"
                  className="w-9 h-9 p-0"
                  aria-label="Changer le thème"
                >
                  {theme === 'light' && <Sun className="h-4 w-4" />}
                  {theme === 'dark' && <Moon className="h-4 w-4" />}
                  {theme === 'system' && <Monitor className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Apparence</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Clair</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Sombre</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Système</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {/* Notifications Premium */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative w-9 h-9 p-0" aria-label={`Notifications${notifications > 0 ? ` (${notifications} nouvelles)` : ''}`}>
                      <Bell className="h-4 w-4" />
                      {notifications > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse"
                        >
                          {notifications}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nouvelle session disponible avec votre coach IA
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      Voir toutes les notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu Premium */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/70 text-white">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
                            {getUserInitials(user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.user_metadata?.full_name || 'Utilisateur'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings/profile" className="flex items-center gap-2">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings/general" className="flex items-center gap-2">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center gap-2">
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Premium</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          Upgrade Premium
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Gérer l'abonnement
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all" asChild>
                  <Link to="/signup">Commencer gratuitement</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden w-9 h-9 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div
              className="container mx-auto px-4 py-6 space-y-4"
              id="mobile-navigation"
              role="navigation"
              aria-label="Navigation principale mobile"
            >
              {/* Search Mobile */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </form>

              {/* Navigation Links */}
              <nav className="space-y-1" aria-label="Navigation principale">
                {navigationItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors focus-enhanced w-full',
                        isActiveRoute(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                      aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                    {item.children && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md focus-enhanced"
                            aria-current={isActiveRoute(child.href) ? 'page' : undefined}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              {isAuthenticated && user ? (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {user?.user_metadata?.full_name || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mx-3 rounded-lg border border-border/50 bg-muted/40 px-3 py-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Niveau {xpStats.level}</span>
                      <span>{xpProgressPercent}%</span>
                    </div>
                    <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-background/40">
                      {isLoadingXp ? (
                        <div className="absolute inset-0 animate-pulse bg-muted-foreground/20" />
                      ) : (
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                          initial={{ width: 0 }}
                          animate={{ width: `${xpProgressPercent}%` }}
                          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                        />
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      {xpFormatter.format(xpStats.xpIntoLevel)} / {xpFormatter.format(xpStats.xpForNextLevel)} XP
                    </div>
                  </div>

                  <Link
                    to="/settings/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted/50 rounded-md focus-enhanced"
                  >
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                  
                  <Link
                    to="/settings/general"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted/50 rounded-md focus-enhanced"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted/50 rounded-md w-full text-left focus-enhanced text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button asChild className="w-full" size="sm">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      S'inscrire gratuitement
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;