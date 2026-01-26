// @ts-nocheck
/**
 * GlobalSearchCommand - Recherche globale avec raccourcis clavier
 * Commande palette pour navigation rapide
 */

// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, 
  CommandInput, CommandItem, CommandList, CommandSeparator 
} from '@/components/ui/command';
import { 
  Search, Brain, Music, Sparkles, FileText, Users, Trophy, 
  BarChart3, Settings, Zap, Wind, Camera, Star, Heart, Home, Shield, Monitor, Target, Palette
} from 'lucide-react';

interface SearchItem {
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  category: string;
  keywords: string[];
}

const searchItems: SearchItem[] = [
  // Dashboard
  { title: 'Dashboard', description: 'Tableau de bord principal', path: '/app/home', icon: Home, category: 'Navigation', keywords: ['accueil', 'dashboard', 'home'] },
  
  // Core Features
  { title: 'Scan Émotionnel', description: 'Analyser vos émotions', path: '/app/scan', icon: Brain, category: 'Core', keywords: ['scan', 'emotion', 'analyse', 'camera'] },
  { title: 'Thérapie Musicale', description: 'Musique personnalisée', path: '/app/music', icon: Music, category: 'Core', keywords: ['musique', 'thérapie', 'son', 'audio'] },
  { title: 'Coach IA', description: 'Assistant empathique', path: '/app/coach', icon: Sparkles, category: 'Core', keywords: ['coach', 'ia', 'chat', 'conseil'] },
  { title: 'Journal', description: 'Journal personnel', path: '/app/journal', icon: FileText, category: 'Core', keywords: ['journal', 'écriture', 'notes'] },
  { title: 'VR Experiences', description: 'Réalité virtuelle', path: '/app/vr', icon: Monitor, category: 'Core', keywords: ['vr', 'virtuel', 'immersion'] },
  
  // Fun-First
  { title: 'Flash Glow', description: 'Thérapie lumière', path: '/app/flash-glow', icon: Zap, category: 'Fun-First', keywords: ['glow', 'lumière', 'flash', 'thérapie'] },
  { title: 'Breathwork', description: 'Exercices de respiration', path: '/app/breath', icon: Wind, category: 'Fun-First', keywords: ['respiration', 'breath', 'souffle'] },
  { title: 'AR Filters', description: 'Filtres de réalité augmentée', path: '/app/face-ar', icon: Camera, category: 'Fun-First', keywords: ['ar', 'filtre', 'caméra', 'réalité'] },
  { title: 'Bubble Beat', description: 'Jeu rythmique', path: '/app/bubble-beat', icon: Heart, category: 'Fun-First', keywords: ['bubble', 'beat', 'jeu', 'rythme'] },
  { title: 'VR Galaxy', description: 'Exploration spatiale', path: '/app/vr-galaxy', icon: Star, category: 'Fun-First', keywords: ['galaxy', 'espace', 'vr', 'étoiles'] },
  { title: 'Boss Level Grit', description: 'Défis de résilience', path: '/app/boss-grit', icon: Target, category: 'Fun-First', keywords: ['boss', 'grit', 'défi', 'résilience'] },
  { title: 'Mood Mixer', description: 'Mélangeur d\'humeurs', path: '/app/mood-mixer', icon: Palette, category: 'Fun-First', keywords: ['mood', 'humeur', 'mixer', 'couleur'] },
  
  // Social
  { title: 'Communauté', description: 'Partage et entraide', path: '/app/community', icon: Users, category: 'Social', keywords: ['communauté', 'social', 'partage'] },
  { title: 'Social Cocon', description: 'Espaces privés', path: '/app/social-cocon', icon: Heart, category: 'Social', keywords: ['cocon', 'privé', 'safe space'] },
  { title: 'Gamification', description: 'Niveaux et badges', path: '/app/leaderboard', icon: Trophy, category: 'Social', keywords: ['game', 'badges', 'niveau', 'score'] },
  
  // Analytics
  { title: 'Analytics', description: 'Historique activité', path: '/app/activity', icon: BarChart3, category: 'Analytics', keywords: ['analytics', 'stats', 'données'] },
  { title: 'Scores & vibes', description: 'Courbes d’humeur et heatmap quotidienne', path: '/app/scores', icon: BarChart3, category: 'Analytics', keywords: ['scores', 'heatmap', 'émotions'] },
  
  // Settings
  { title: 'Paramètres Généraux', description: 'Configuration générale', path: '/settings/general', icon: Settings, category: 'Paramètres', keywords: ['paramètres', 'config', 'général'] },
  { title: 'Profil', description: 'Informations personnelles', path: '/settings/profile', icon: Users, category: 'Paramètres', keywords: ['profil', 'compte', 'personnel'] },
  { title: 'Confidentialité', description: 'Gestion de confidentialité', path: '/settings/privacy', icon: Shield, category: 'Paramètres', keywords: ['privacy', 'confidentialité', 'sécurité'] },
  { title: 'Notifications', description: 'Préférences notifications', path: '/settings/notifications', icon: Sparkles, category: 'Paramètres', keywords: ['notifications', 'alerts', 'rappels'] },
];

export default function GlobalSearchCommand() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Raccourci clavier Cmd+K / Ctrl+K
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

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const groupedItems = searchItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  return (
    <>
      {/* Trigger Button */}
      <div 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-background border rounded-md cursor-pointer hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher des fonctionnalités..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          {Object.entries(groupedItems).map(([category, items]) => (
            <React.Fragment key={category}>
              <CommandGroup heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.path}
                    value={`${item.title} ${item.description} ${item.keywords.join(' ')}`}
                    onSelect={() => handleSelect(item.path)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}