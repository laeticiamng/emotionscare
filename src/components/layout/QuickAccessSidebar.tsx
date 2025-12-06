// @ts-nocheck
/**
 * QuickAccessSidebar - Navigation rapide latérale
 * Accès direct aux fonctionnalités principales
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Home, Brain, Music, Sparkles, FileText, Users, 
  Trophy, BarChart3, Settings, Zap, Wind, Camera, Star, 
  Heart, Grid3X3, Target, Palette, Waves, Gamepad2, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessItem {
  label: string;
  path: string;
  icon: React.ElementType;
  color: string;
  category: 'core' | 'fun' | 'social' | 'analytics' | 'settings';
}

const quickAccessItems: QuickAccessItem[] = [
  // Core
  { label: 'Dashboard', path: '/app/home', icon: Home, color: 'text-blue-500', category: 'core' },
  { label: 'Scan', path: '/app/scan', icon: Brain, color: 'text-pink-500', category: 'core' },
  { label: 'Musique', path: '/app/music', icon: Music, color: 'text-purple-500', category: 'core' },
  { label: 'Coach IA', path: '/app/coach', icon: Sparkles, color: 'text-blue-500', category: 'core' },
  { label: 'Journal', path: '/app/journal', icon: FileText, color: 'text-green-500', category: 'core' },
  
  // Fun-First
  { label: 'Flash Glow', path: '/app/flash-glow', icon: Zap, color: 'text-yellow-500', category: 'fun' },
  { label: 'Breathwork', path: '/app/breath', icon: Wind, color: 'text-teal-500', category: 'fun' },
  { label: 'AR Filters', path: '/app/face-ar', icon: Camera, color: 'text-indigo-500', category: 'fun' },
  { label: 'VR Galaxy', path: '/app/vr-galaxy', icon: Star, color: 'text-violet-500', category: 'fun' },
  { label: 'Bubble Beat', path: '/app/bubble-beat', icon: Waves, color: 'text-cyan-500', category: 'fun' },
  
  // Social
  { label: 'Communauté', path: '/app/community', icon: Users, color: 'text-green-500', category: 'social' },
  { label: 'Social Cocon', path: '/app/social-cocon', icon: Heart, color: 'text-pink-500', category: 'social' },
  { label: 'Gamification', path: '/app/leaderboard', icon: Trophy, color: 'text-amber-500', category: 'social' },
  
  // Analytics
  { label: 'Analytics', path: '/app/activity', icon: BarChart3, color: 'text-blue-500', category: 'analytics' },
  { label: 'Navigation', path: '/navigation', icon: Grid3X3, color: 'text-gray-500', category: 'analytics' },
  
  // Settings
  { label: 'Paramètres', path: '/settings/general', icon: Settings, color: 'text-gray-500', category: 'settings' },
];

export default function QuickAccessSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const categoryColors = {
    core: 'border-l-blue-500',
    fun: 'border-l-yellow-500',
    social: 'border-l-green-500',
    analytics: 'border-l-purple-500',
    settings: 'border-l-gray-500',
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 rounded-full w-12 h-12 p-0 bg-primary/90 hover:bg-primary shadow-lg"
        size="sm"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-lg border-r z-50 shadow-xl"
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-8 pt-16">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Accès Rapide
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Navigation instantanée
                  </p>
                </div>

                {/* Quick Access Items */}
                <div className="space-y-2">
                  {quickAccessItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Button
                          onClick={() => handleNavigate(item.path)}
                          variant={isActive ? 'default' : 'ghost'}
                          className={cn(
                            "w-full justify-start gap-3 h-12 border-l-4 rounded-l-none",
                            categoryColors[item.category],
                            isActive 
                              ? "bg-primary/10 border-l-primary" 
                              : "border-l-transparent hover:border-l-primary/50"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", item.color)} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Categories Legend */}
                <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Core', color: 'border-l-blue-500', count: 5 },
                      { name: 'Fun-First', color: 'border-l-yellow-500', count: 5 },
                      { name: 'Social', color: 'border-l-green-500', count: 3 },
                      { name: 'Analytics', color: 'border-l-purple-500', count: 2 },
                      { name: 'Settings', color: 'border-l-gray-500', count: 1 },
                    ].map((category) => (
                      <div key={category.name} className="flex items-center gap-2 text-xs">
                        <div className={cn("w-3 h-3 border-l-4 rounded-sm", category.color)} />
                        <span className="text-muted-foreground">{category.name}</span>
                        <span className="ml-auto text-xs bg-accent px-1.5 py-0.5 rounded">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t">
                  <Button
                    onClick={() => handleNavigate('/navigation')}
                    variant="outline"
                    className="w-full"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Voir tout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}