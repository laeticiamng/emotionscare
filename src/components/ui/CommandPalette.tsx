/**
 * ⚡ COMMAND PALETTE PREMIUM
 * Interface de commande rapide à la VSCode/Raycast
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Zap,
  Brain,
  Music,
  Activity,
  Users,
  BarChart3,
  FileText,
  Heart,
  Wind,
  Gamepad2,
  Camera,
  Globe,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Home,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePremiumStore } from '@/core/PremiumStateManager';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  keywords: string[];
  category: 'navigation' | 'actions' | 'settings' | 'tools' | 'quick';
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
  badge?: string;
  priority?: number;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, setUser } = usePremiumStore();

  // Toggle with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Define all available commands
  const commands: CommandAction[] = useMemo(() => {
    const baseCommands: CommandAction[] = [
      // Navigation
      {
        id: 'nav-home',
        title: 'Accueil',
        description: 'Retour à la page d\'accueil',
        icon: <Home className="w-4 h-4" />,
        keywords: ['home', 'accueil', 'dashboard'],
        category: 'navigation',
        action: () => { navigate('/'); setOpen(false); },
        priority: 1
      },
      {
        id: 'nav-scan',
        title: 'Scan Émotionnel',
        description: 'Analyser vos émotions instantanément',
        icon: <Camera className="w-4 h-4" />,
        keywords: ['scan', 'analyse', 'emotion', 'camera'],
        category: 'navigation',
        action: () => { navigate('/app/scan'); setOpen(false); },
        badge: 'IA',
        priority: 2
      },
      {
        id: 'nav-coach',
        title: 'Coach IA',
        description: 'Coaching personnalisé 24/7',
        icon: <Brain className="w-4 h-4" />,
        keywords: ['coach', 'ia', 'ai', 'conseil', 'aide'],
        category: 'navigation',
        action: () => { navigate('/app/coach'); setOpen(false); },
        badge: 'Premium',
        priority: 2
      },
      {
        id: 'nav-music',
        title: 'Musicothérapie',
        description: 'Musique adaptative pour votre bien-être',
        icon: <Music className="w-4 h-4" />,
        keywords: ['music', 'musique', 'therapie', 'son'],
        category: 'navigation',
        action: () => { navigate('/app/music'); setOpen(false); },
        badge: 'Premium',
        priority: 3
      },
      {
        id: 'nav-breath',
        title: 'Exercices de Respiration',
        description: 'Techniques de respiration guidées',
        icon: <Wind className="w-4 h-4" />,
        keywords: ['breath', 'respiration', 'meditation', 'relax'],
        category: 'navigation',
        action: () => { navigate('/app/breath'); setOpen(false); },
        priority: 3
      },
      {
        id: 'nav-journal',
        title: 'Journal Intelligent',
        description: 'Tenir un journal avec IA',
        icon: <FileText className="w-4 h-4" />,
        keywords: ['journal', 'diary', 'ecriture', 'notes'],
        category: 'navigation',
        action: () => { navigate('/app/journal'); setOpen(false); },
        priority: 3
      },

      // Quick Actions
      {
        id: 'action-quick-scan',
        title: 'Scan Rapide',
        description: 'Analyse émotionnelle instantanée',
        icon: <Zap className="w-4 h-4" />,
        keywords: ['quick', 'rapide', 'scan', 'instant'],
        category: 'quick',
        action: () => { navigate('/app/scan?quick=true'); setOpen(false); },
        shortcut: 'Q',
        priority: 1
      },
      {
        id: 'action-mood-check',
        title: 'Check Humeur',
        description: 'Évaluation rapide de l\'humeur',
        icon: <Smile className="w-4 h-4" />,
        keywords: ['mood', 'humeur', 'feeling', 'emotion'],
        category: 'quick',
        action: () => { navigate('/app/mood'); setOpen(false); },
        shortcut: 'M',
        priority: 2
      },

      // Tools
      {
        id: 'tool-calculator',
        title: 'Calculatrice Bien-être',
        description: 'Calculs de métriques de bien-être',
        icon: <Calculator className="w-4 h-4" />,
        keywords: ['calculator', 'calcul', 'metrics', 'score'],
        category: 'tools',
        action: () => { navigate('/app/tools/calculator'); setOpen(false); },
        priority: 5
      },
      {
        id: 'tool-calendar',
        title: 'Calendrier Émotionnel',
        description: 'Planifiez vos activités de bien-être',
        icon: <Calendar className="w-4 h-4" />,
        keywords: ['calendar', 'calendrier', 'planning', 'date'],
        category: 'tools',
        action: () => { navigate('/app/calendar'); setOpen(false); },
        priority: 4
      },

      // Settings
      {
        id: 'settings-profile',
        title: 'Profil',
        description: 'Gérer votre profil utilisateur',
        icon: <User className="w-4 h-4" />,
        keywords: ['profile', 'profil', 'account', 'compte'],
        category: 'settings',
        action: () => { navigate('/app/profile'); setOpen(false); },
        priority: 3
      },
      {
        id: 'settings-preferences',
        title: 'Préférences',
        description: 'Paramètres de l\'application',
        icon: <Settings className="w-4 h-4" />,
        keywords: ['settings', 'preferences', 'config', 'parametres'],
        category: 'settings',
        action: () => { navigate('/app/settings'); setOpen(false); },
        priority: 4
      },

      // Theme actions
      {
        id: 'theme-light',
        title: 'Mode Clair',
        description: 'Basculer vers le thème clair',
        icon: <Sun className="w-4 h-4" />,
        keywords: ['light', 'clair', 'theme', 'blanc'],
        category: 'settings',
        action: () => { setTheme('light'); setOpen(false); },
        disabled: theme === 'light',
        priority: 6
      },
      {
        id: 'theme-dark',
        title: 'Mode Sombre',
        description: 'Basculer vers le thème sombre',
        icon: <Moon className="w-4 h-4" />,
        keywords: ['dark', 'sombre', 'theme', 'noir'],
        category: 'settings',
        action: () => { setTheme('dark'); setOpen(false); },
        disabled: theme === 'dark',
        priority: 6
      },
      {
        id: 'theme-system',
        title: 'Thème Système',
        description: 'Suivre les préférences système',
        icon: <Monitor className="w-4 h-4" />,
        keywords: ['system', 'systeme', 'auto', 'automatic'],
        category: 'settings',
        action: () => { setTheme('system'); setOpen(false); },
        disabled: theme === 'system',
        priority: 6
      }
    ];

    // Add user-specific commands
    if (user) {
      // Employee/Manager specific
      if (['employee', 'manager'].includes(user.role)) {
        baseCommands.push({
          id: 'nav-teams',
          title: 'Équipes',
          description: 'Gestion d\'équipe collaborative',
          icon: <Users className="w-4 h-4" />,
          keywords: ['teams', 'equipes', 'collaboration'],
          category: 'navigation',
          action: () => { navigate('/app/teams'); setOpen(false); },
          priority: 3
        });
      }

      // Manager specific
      if (user.role === 'manager') {
        baseCommands.push({
          id: 'nav-analytics',
          title: 'Analytics RH',
          description: 'Tableaux de bord et rapports',
          icon: <BarChart3 className="w-4 h-4" />,
          keywords: ['analytics', 'reports', 'rapports', 'stats'],
          category: 'navigation',
          action: () => { navigate('/app/analytics'); setOpen(false); },
          priority: 2
        });
      }

      // Logout command
      baseCommands.push({
        id: 'action-logout',
        title: 'Se Déconnecter',
        description: 'Fermer votre session',
        icon: <LogOut className="w-4 h-4" />,
        keywords: ['logout', 'deconnexion', 'exit', 'quit'],
        category: 'actions',
        action: () => { 
          setUser(null); 
          navigate('/'); 
          setOpen(false); 
        },
        priority: 7
      });
    }

    return baseCommands.sort((a, b) => (a.priority || 10) - (b.priority || 10));
  }, [navigate, user, theme, setTheme, setUser]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const query = search.toLowerCase();
    return commands.filter(command => 
      command.title.toLowerCase().includes(query) ||
      command.description?.toLowerCase().includes(query) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [commands, search]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups = filteredCommands.reduce((acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    }, {} as Record<string, CommandAction[]>);

    return groups;
  }, [filteredCommands]);

  const categoryLabels = {
    navigation: 'Navigation',
    quick: 'Actions Rapides',
    actions: 'Actions',
    tools: 'Outils',
    settings: 'Paramètres'
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput
            placeholder="Rechercher des commandes..."
            value={search}
            onValueChange={setSearch}
            className="border-0 focus:ring-0"
          />
          
          <CommandList className="max-h-96 overflow-auto">
            <CommandEmpty>
              <div className="flex flex-col items-center py-6">
                <Search className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Aucune commande trouvée pour "{search}"
                </p>
              </div>
            </CommandEmpty>

            {Object.entries(groupedCommands).map(([category, categoryCommands], index) => (
              <React.Fragment key={category}>
                {index > 0 && <CommandSeparator />}
                
                <CommandGroup heading={categoryLabels[category as keyof typeof categoryLabels]}>
                  {categoryCommands.map((command) => (
                    <CommandItem
                      key={command.id}
                      value={command.id}
                      onSelect={command.action}
                      disabled={command.disabled}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 cursor-pointer",
                        command.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-muted-foreground">
                          {command.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {command.title}
                            </span>
                            {command.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {command.badge}
                              </Badge>
                            )}
                          </div>
                          {command.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {command.description}
                            </p>
                          )}
                        </div>

                        {command.shortcut && (
                          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                            {command.shortcut}
                          </kbd>
                        )}

                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-data-[selected=true]:opacity-100" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>

        {/* Footer with shortcut info */}
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>Tapez pour rechercher</span>
          <div className="flex items-center gap-1">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
              ↵
            </kbd>
            <span>pour sélectionner</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;