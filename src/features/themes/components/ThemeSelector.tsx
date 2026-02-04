/**
 * ThemeSelector - Sélecteur de thèmes visuel
 * Permet de choisir et prévisualiser les thèmes
 */

import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Moon, Sun, Palette, Sparkles, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  isPremium?: boolean;
  isNew?: boolean;
}

interface ThemeSelectorProps {
  themes?: ThemeOption[];
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
  isPremiumUser?: boolean;
}

const DEFAULT_THEMES: ThemeOption[] = [
  {
    id: 'default',
    name: 'Défaut',
    description: 'Thème classique équilibré',
    preview: { primary: '#8b5cf6', secondary: '#22c55e', accent: '#f59e0b', background: '#ffffff' }
  },
  {
    id: 'ocean',
    name: 'Océan',
    description: 'Bleus apaisants et verts profonds',
    preview: { primary: '#0ea5e9', secondary: '#14b8a6', accent: '#06b6d4', background: '#f0f9ff' }
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    description: 'Teintes chaudes relaxantes',
    preview: { primary: '#f97316', secondary: '#ec4899', accent: '#f43f5e', background: '#fff7ed' }
  },
  {
    id: 'forest',
    name: 'Forêt',
    description: 'Verts naturels et terreux',
    preview: { primary: '#22c55e', secondary: '#84cc16', accent: '#a3e635', background: '#f0fdf4' }
  },
  {
    id: 'lavender',
    name: 'Lavande',
    description: 'Violets doux et apaisants',
    preview: { primary: '#a855f7', secondary: '#c084fc', accent: '#e879f9', background: '#faf5ff' },
    isPremium: true
  },
  {
    id: 'midnight',
    name: 'Minuit',
    description: 'Mode sombre profond',
    preview: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa', background: '#0f172a' },
    isNew: true
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    description: 'Tons roses thérapeutiques',
    preview: { primary: '#f472b6', secondary: '#fb7185', accent: '#fda4af', background: '#fff1f2' },
    isPremium: true
  },
  {
    id: 'zen',
    name: 'Zen',
    description: 'Minimaliste et serein',
    preview: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1', background: '#f8fafc' },
    isPremium: true,
    isNew: true
  }
];

export const ThemeSelector = memo<ThemeSelectorProps>(({
  themes = DEFAULT_THEMES,
  currentTheme = 'default',
  onThemeChange,
  isPremiumUser = false
}) => {
  const { theme: systemTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeSelect = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme?.isPremium && !isPremiumUser) return;
    
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Thèmes visuels
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de votre espace
            </CardDescription>
          </div>
          
          {/* Toggle mode sombre/clair */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              size="sm"
              variant={systemTheme === 'light' ? 'default' : 'ghost'}
              className="h-8 w-8 p-0"
              onClick={() => setTheme('light')}
              aria-label="Mode clair"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={systemTheme === 'dark' ? 'default' : 'ghost'}
              className="h-8 w-8 p-0"
              onClick={() => setTheme('dark')}
              aria-label="Mode sombre"
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            const isLocked = theme.isPremium && !isPremiumUser;
            const isHovered = hoveredTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                disabled={isLocked}
                className={`
                  relative p-3 rounded-xl border-2 transition-all text-left
                  ${isSelected 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'}
                  ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  ${isHovered && !isLocked ? 'scale-105 shadow-lg' : ''}
                `}
                aria-label={`Thème ${theme.name}${isLocked ? ' (Premium)' : ''}`}
              >
                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {theme.isNew && (
                    <Badge className="text-xs bg-primary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Nouveau
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="h-3 w-3" />
                    </Badge>
                  )}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Prévisualisation couleurs */}
                <div className="mb-3 flex gap-1 h-12 rounded-lg overflow-hidden">
                  <div 
                    className="flex-1 transition-all"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div 
                    className="flex-1 transition-all"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <div 
                    className="flex-1 transition-all"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </div>

                {/* Mini preview card */}
                <div 
                  className="mb-3 p-2 rounded-lg border"
                  style={{ backgroundColor: theme.preview.background }}
                >
                  <div 
                    className="h-2 w-3/4 rounded mb-1"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div 
                    className="h-1.5 w-1/2 rounded opacity-60"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                </div>

                {/* Infos */}
                <h4 className="font-medium text-sm">{theme.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {theme.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Message Premium */}
        {!isPremiumUser && themes.some(t => t.isPremium) && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Débloquez plus de thèmes</p>
                <p className="text-xs text-muted-foreground">
                  Passez à Premium pour accéder à tous les thèmes exclusifs
                </p>
              </div>
              <Button size="sm">
                Passer Premium
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ThemeSelector.displayName = 'ThemeSelector';

export default ThemeSelector;
