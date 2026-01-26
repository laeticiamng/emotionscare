// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Monitor, Palette, Check, Sparkles, Share2, Download, Upload, Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeName } from '@/types/theme';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onChange: (theme: ThemeName) => void;
  minimal?: boolean;
  showPreview?: boolean;
}

const THEME_CONFIG = {
  light: {
    icon: Sun,
    label: 'Clair',
    description: 'Interface lumineuse et aérée',
    colors: { bg: 'bg-white', card: 'bg-slate-50', accent: 'bg-blue-500', text: 'bg-slate-900' }
  },
  dark: {
    icon: Moon,
    label: 'Sombre',
    description: 'Repose les yeux en soirée',
    colors: { bg: 'bg-slate-900', card: 'bg-slate-800', accent: 'bg-purple-500', text: 'bg-slate-100' }
  },
  system: {
    icon: Monitor,
    label: 'Système',
    description: 'Suit les préférences système',
    colors: { bg: 'bg-gradient-to-br from-white to-slate-900', card: 'bg-slate-500', accent: 'bg-blue-500', text: 'bg-white' }
  },
  pastel: {
    icon: Palette,
    label: 'Pastel',
    description: 'Couleurs douces et apaisantes',
    colors: { bg: 'bg-gradient-to-br from-pink-100 to-purple-100', card: 'bg-white/80', accent: 'bg-pink-400', text: 'bg-purple-900' },
    isNew: true
  }
};

const ACCESSIBILITY_MODES = [
  { id: 'normal', label: 'Normal', description: 'Vision standard' },
  { id: 'protanopia', label: 'Protanopie', description: 'Déficience rouge-vert' },
  { id: 'deuteranopia', label: 'Deutéranopie', description: 'Déficience vert' },
  { id: 'tritanopia', label: 'Tritanopie', description: 'Déficience bleu-jaune' },
  { id: 'high-contrast', label: 'Contraste élevé', description: 'Maximum de lisibilité' },
];

const SCHEDULE_OPTIONS = [
  { id: 'none', label: 'Désactivé' },
  { id: 'sunset', label: 'Coucher du soleil', description: 'Passe en sombre automatiquement' },
  { id: 'custom', label: 'Personnalisé', description: 'Définir des heures spécifiques' },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onChange, 
  minimal = false,
  showPreview = true 
}) => {
  const [hoveredTheme, setHoveredTheme] = useState<ThemeName | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(() => 
    localStorage.getItem('accessibility-mode') || 'normal'
  );
  const [schedule, setSchedule] = useState(() => 
    localStorage.getItem('theme-schedule') || 'none'
  );
  const [reducedMotion, setReducedMotion] = useState(() => 
    localStorage.getItem('reduced-motion') === 'true'
  );
  const [customHours, setCustomHours] = useState(() => {
    const saved = localStorage.getItem('theme-custom-hours');
    return saved ? JSON.parse(saved) : { dark: '20:00', light: '07:00' };
  });

  // Apply accessibility mode
  useEffect(() => {
    document.documentElement.setAttribute('data-accessibility', accessibilityMode);
    localStorage.setItem('accessibility-mode', accessibilityMode);
  }, [accessibilityMode]);

  // Apply reduced motion
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduced-motion', String(reducedMotion));
  }, [reducedMotion]);

  // Schedule handler
  useEffect(() => {
    localStorage.setItem('theme-schedule', schedule);
    if (schedule === 'sunset') {
      // Simplified: switch to dark at 19:00
      const hour = new Date().getHours();
      if (hour >= 19 || hour < 7) {
        onChange('dark');
      } else {
        onChange('light');
      }
    }
  }, [schedule]);

  const handleThemeChange = (value: string) => {
    if (value === 'light' || value === 'dark' || value === 'system' || value === 'pastel') {
      onChange(value as ThemeName);
    }
  };

  const handleExportPreferences = () => {
    const prefs = {
      theme: currentTheme,
      accessibilityMode,
      schedule,
      reducedMotion,
      customHours,
    };
    const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-preferences.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Préférences exportées');
  };

  const handleImportPreferences = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const prefs = JSON.parse(text);
          if (prefs.theme) onChange(prefs.theme);
          if (prefs.accessibilityMode) setAccessibilityMode(prefs.accessibilityMode);
          if (prefs.schedule) setSchedule(prefs.schedule);
          if (prefs.reducedMotion !== undefined) setReducedMotion(prefs.reducedMotion);
          toast.success('Préférences importées');
        } catch {
          toast.error('Fichier invalide');
        }
      }
    };
    input.click();
  };

  const handleShareTheme = async () => {
    const shareText = `Mon thème EmotionsCare : ${THEME_CONFIG[currentTheme].label} 🎨`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        navigator.clipboard.writeText(shareText);
        toast.success('Copié !');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Copié !');
    }
  };

  const ThemePreview = ({ theme }: { theme: keyof typeof THEME_CONFIG }) => {
    const config = THEME_CONFIG[theme];
    return (
      <div className={cn("w-full h-12 rounded-lg overflow-hidden relative", config.colors.bg)}>
        <div className={cn("absolute top-2 left-2 w-6 h-3 rounded", config.colors.card)} />
        <div className={cn("absolute top-2 right-2 w-3 h-3 rounded-full", config.colors.accent)} />
        <div className={cn("absolute bottom-2 left-2 right-4 h-1.5 rounded opacity-30", config.colors.text)} />
      </div>
    );
  };
  
  if (minimal) {
    return (
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {Object.entries(THEME_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = currentTheme === key;
          return (
            <motion.button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={cn("p-2 rounded-md transition-all", isSelected ? "bg-background shadow-sm" : "hover:bg-background/50")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={config.label}
            >
              <Icon className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
            </motion.button>
          );
        })}
      </div>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Thème
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShareTheme} aria-label="Partager">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAdvanced(true)} aria-label="Options avancées">
                <Accessibility className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentTheme} onValueChange={handleThemeChange} className="grid grid-cols-2 gap-4">
            {Object.entries(THEME_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = currentTheme === key;
              return (
                <motion.div
                  key={key}
                  onHoverStart={() => setHoveredTheme(key as ThemeName)}
                  onHoverEnd={() => setHoveredTheme(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Label
                    htmlFor={key}
                    className={cn(
                      "flex flex-col cursor-pointer rounded-lg border-2 p-3 transition-all",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    {showPreview && (
                      <div className="mb-3 relative">
                        <ThemePreview theme={key as keyof typeof THEME_CONFIG} />
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={key} id={key} className="sr-only" />
                      <motion.div
                        className={cn("p-1.5 rounded-md", isSelected ? "bg-primary/20" : "bg-muted")}
                        animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium text-sm", isSelected && "text-primary")}>
                            {config.label}
                          </span>
                          {config.isNew && (
                            <Badge className="text-[10px] px-1 py-0 bg-gradient-to-r from-pink-500 to-purple-500">
                              <Sparkles className="w-2 h-2 mr-0.5" />
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </Label>
                </motion.div>
              );
            })}
          </RadioGroup>

          {/* Quick settings */}
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Réduire les animations</Label>
                <p className="text-xs text-muted-foreground">Pour les utilisateurs sensibles</p>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings Dialog */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Options d'accessibilité
            </DialogTitle>
            <DialogDescription>Personnalisez l'affichage selon vos besoins</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="accessibility">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="accessibility">Vision</TabsTrigger>
              <TabsTrigger value="schedule">Planification</TabsTrigger>
              <TabsTrigger value="export">Import/Export</TabsTrigger>
            </TabsList>

            <TabsContent value="accessibility" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Mode d'accessibilité visuelle</Label>
                <Select value={accessibilityMode} onValueChange={setAccessibilityMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESSIBILITY_MODES.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id}>
                        <div>
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-xs text-muted-foreground">{mode.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Réduire les animations</Label>
                  <p className="text-xs text-muted-foreground">Désactive les transitions</p>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Changement automatique</Label>
                <Select value={schedule} onValueChange={setSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        <div>
                          <div className="font-medium">{opt.label}</div>
                          {opt.description && <div className="text-xs text-muted-foreground">{opt.description}</div>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {schedule === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thème sombre à</Label>
                    <input
                      type="time"
                      value={customHours.dark}
                      onChange={(e) => setCustomHours({ ...customHours, dark: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Thème clair à</Label>
                    <input
                      type="time"
                      value={customHours.light}
                      onChange={(e) => setCustomHours({ ...customHours, light: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Exportez vos préférences pour les utiliser sur un autre appareil.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleExportPreferences}>
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleImportPreferences}>
                  <Upload className="h-4 w-4" />
                  Importer
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThemeSelector;
