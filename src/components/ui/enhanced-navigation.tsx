import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home, Brain, Music, BookOpen, MessageCircle, User, Menu, X,
  Sparkles, Headphones, Trophy, Zap, Heart, Building2, Settings,
  ChevronDown, Search, Bell, Moon, Sun, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { routes } from '@/routerV2';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  premium?: boolean;
  badge?: string;
  description?: string;
  category?: 'main' | 'features' | 'tools' | 'settings';
}

const EnhancedNavigation: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: NavItem[] = [
    { name: 'Accueil', path: '/', icon: Home, category: 'main' },
    { name: 'Scanner', path: '/scan', icon: Brain, premium: true, category: 'features', description: 'Analyse émotionnelle en temps réel' },
    { name: 'Musique', path: '/music', icon: Music, premium: true, category: 'features', description: 'Thérapie musicale personnalisée' },
    { name: 'Journal', path: '/journal', icon: BookOpen, category: 'features', description: 'Suivi de votre bien-être' },
    { name: 'Coach IA', path: '/coach', icon: MessageCircle, premium: true, category: 'features', description: 'Accompagnement personnalisé' },
    { name: 'VR', path: '/vr', icon: Headphones, premium: true, badge: 'Nouveau', category: 'features' },
    { name: 'Gamification', path: '/gamification', icon: Trophy, category: 'features' },
    { name: 'Flash Glow', path: '/flash-glow', icon: Zap, category: 'tools' },
    { name: 'Breathwork', path: '/breathwork', icon: Sparkles, category: 'tools' },
    { name: 'Préférences', path: '/preferences', icon: Settings, category: 'settings' },
  ];

  const quickAccess = [
    { name: 'Instant Glow', path: '/instant-glow', icon: Zap },
    { name: 'Mood Mixer', path: '/mood-mixer', icon: Palette },
  ];

  const filteredItems = navItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const handleThemeChange = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme as any);
  };

  return (
    <>
      {/* Enhanced Header */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo amélioré */}
            <Link to={routes.public.home()} className="flex items-center space-x-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg">EC</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EmotionsCare
                </span>
                <p className="text-xs text-muted-foreground -mt-1">Intelligence Émotionnelle</p>
              </div>
            </Link>

            {/* Navigation Desktop - Améliorée */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.filter(item => item.category === 'main' || item.category === 'features').slice(0, 6).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                          "flex items-center space-x-2 relative transition-all duration-300",
                          isActive 
                            ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg' 
                            : 'hover:bg-muted/80 hover:shadow-md'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="hidden xl:inline">{item.name}</span>
                        {item.premium && (
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                        )}
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs px-1 py-0 ml-1">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 w-2 h-2 bg-primary rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          layoutId="activeIndicator"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Actions Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Quick Access */}
              <div className="flex items-center space-x-1 px-3 py-1 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm">
                {quickAccess.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title={item.name}
                    >
                      <item.icon className="h-4 w-4" />
                    </motion.button>
                  </Link>
                ))}
              </div>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="relative"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">3</span>
                </span>
              </Button>

              {/* Theme Switcher */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeChange}
                className="relative"
              >
                {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* User Actions */}
              <Button
                variant="outline"
                className="border-border/50 hover:bg-muted/80 backdrop-blur-sm"
                onClick={() => window.location.href = '/auth'}
              >
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Button>
              
              <Button
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-xl hover:shadow-2xl"
                onClick={() => window.location.href = '/choose-mode'}
              >
                Commencer
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              className="fixed top-16 left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border/50 max-h-[calc(100vh-4rem)] overflow-y-auto"
              initial={{ y: -400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="px-4 py-6 space-y-6">
                {/* Search in Mobile */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Navigation Items */}
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                      {category === 'main' ? 'Principal' : 
                       category === 'features' ? 'Fonctionnalités' :
                       category === 'tools' ? 'Outils' : 'Paramètres'}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                              isActive
                                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20'
                                : 'hover:bg-muted/50'
                            )}
                          >
                            <item.icon className={cn("h-5 w-5", isActive ? 'text-primary' : 'text-muted-foreground')} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className={cn("font-medium", isActive ? 'text-primary' : 'text-foreground')}>
                                  {item.name}
                                </span>
                                {item.premium && <Sparkles className="h-3 w-3 text-yellow-500" />}
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Mobile Actions */}
                <div className="border-t border-border/50 pt-4 space-y-3">
                  <Button
                    onClick={() => {
                      window.location.href = '/auth';
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                  
                  <Button
                    onClick={() => {
                      window.location.href = '/choose-mode';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-primary to-purple-600"
                  >
                    Commencer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.div
              className="relative w-full max-w-lg mx-4 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -50 }}
            >
              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher des fonctionnalités..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredItems.slice(0, 6).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedNavigation;