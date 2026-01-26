// @ts-nocheck
/**
 * DashboardNavigationWidget - Widget de navigation pour le dashboard
 * Accès rapide aux fonctionnalités principales
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, Brain, Music, Sparkles, FileText, Zap, Wind, 
  Users, Trophy, Search, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  path: string;
  icon: React.ElementType;
  color: string;
  category: 'core' | 'fun' | 'social';
  new?: boolean;
}

const quickActions: QuickAction[] = [
  { label: 'Scan Émotions', path: '/app/scan', icon: Brain, color: 'from-destructive to-destructive/80', category: 'core' },
  { label: 'Thérapie Musicale', path: '/app/music', icon: Music, color: 'from-accent to-primary', category: 'core' },
  { label: 'Coach IA', path: '/app/coach', icon: Sparkles, color: 'from-primary to-info', category: 'core' },
  { label: 'Journal', path: '/app/journal', icon: FileText, color: 'from-success to-success/80', category: 'core' },
  { label: 'Flash Glow', path: '/app/flash-glow', icon: Zap, color: 'from-warning to-warning/80', category: 'fun' },
  { label: 'Breathwork', path: '/app/breath', icon: Wind, color: 'from-success/80 to-success', category: 'fun' },
  { label: 'Communauté', path: '/app/community', icon: Users, color: 'from-success to-info', category: 'social' },
  { label: 'Gamification', path: '/app/leaderboard', icon: Trophy, color: 'from-warning to-warning/80', category: 'social' },
];

const recentPages = [
  { label: 'Analytics', path: '/app/activity', visits: 12 },
  { label: 'VR Galaxy', path: '/app/vr-galaxy', visits: 8, new: true },
  { label: 'Paramètres', path: '/settings/general', visits: 5 },
];

export default function DashboardNavigationWidget() {
  const navigate = useNavigate();

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Actions Rapides */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.slice(0, 6).map((action, index) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => handleQuickAction(action.path)}
                  variant="ghost"
                  className="w-full h-auto p-3 justify-start gap-3 hover:scale-105 transition-transform"
                >
                  <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-br text-primary-foreground",
                    action.color
                  )}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-left flex-1">
                    {action.label}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <Button
            onClick={() => navigate('/navigation')}
            variant="outline"
            className="w-full mt-4 gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Voir toutes les fonctionnalités
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Pages Récentes & Recherche */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Navigation & Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Recherche rapide */}
          <Button
            onClick={() => {
              // Déclencher Cmd+K
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                ctrlKey: true
              });
              document.dispatchEvent(event);
            }}
            variant="outline"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span>Rechercher...</span>
            <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
          </Button>

          {/* Pages récentes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Pages récentes</h4>
            {recentPages.map((page, index) => (
              <Button
                key={page.path}
                onClick={() => navigate(page.path)}
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{page.label}</span>
                  {page.new && (
                    <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {page.visits}
                  </Badge>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Button>
            ))}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">24</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">5</div>
              <div className="text-xs text-muted-foreground">Favoris</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">12</div>
              <div className="text-xs text-muted-foreground">Récents</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}