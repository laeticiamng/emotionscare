// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Eye,
  Contrast,
  Check,
  History,
  Star,
  Sparkles,
  RotateCcw,
  Save,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { ThemeName } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

interface ThemePreset {
  id: string;
  name: string;
  theme: ThemeName;
  accentColor: string;
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: number;
  createdAt: string;
  isDefault?: boolean;
}

interface ThemeHistory {
  id: string;
  theme: ThemeName;
  accentColor: string;
  changedAt: string;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const { toast } = useToast();
  const [autoTheme, setAutoTheme] = useState(currentTheme === 'system');
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('theme_reduce_motion') === 'true';
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('theme_high_contrast') === 'true';
  });
  const [selectedAccent, setSelectedAccent] = useState(() => {
    return localStorage.getItem('theme_accent_color') || 'blue';
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('theme_font_size');
    return saved ? parseInt(saved) : 100;
  });
  
  // Presets
  const [presets, setPresets] = useState<ThemePreset[]>(() => {
    const saved = localStorage.getItem('theme_presets');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default-light',
        name: 'Par défaut clair',
        theme: 'light',
        accentColor: 'blue',
        reduceMotion: false,
        highContrast: false,
        fontSize: 100,
        createdAt: new Date().toISOString(),
        isDefault: true
      },
      {
        id: 'default-dark',
        name: 'Par défaut sombre',
        theme: 'dark',
        accentColor: 'purple',
        reduceMotion: false,
        highContrast: false,
        fontSize: 100,
        createdAt: new Date().toISOString(),
        isDefault: true
      }
    ];
  });
  
  // History
  const [history, setHistory] = useState<ThemeHistory[]>(() => {
    const saved = localStorage.getItem('theme_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoritePresets, setFavoritePresets] = useState<string[]>(() => {
    const saved = localStorage.getItem('theme_favorite_presets');
    return saved ? JSON.parse(saved) : [];
  });

  const themes = [
    {
      name: 'light' as ThemeName,
      label: 'Clair',
      description: 'Thème lumineux pour une utilisation de jour',
      icon: Sun,
      preview: 'bg-white border-gray-200'
    },
    {
      name: 'dark' as ThemeName,
      label: 'Sombre',
      description: 'Thème sombre pour réduire la fatigue oculaire',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700'
    },
    {
      name: 'system' as ThemeName,
      label: 'Système',
      description: 'Suit automatiquement les préférences de votre appareil',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-white to-gray-900'
    }
  ];

  const accentColors = [
    { name: 'blue', color: 'hsl(221, 83%, 53%)', label: 'Bleu' },
    { name: 'green', color: 'hsl(142, 76%, 36%)', label: 'Vert' },
    { name: 'purple', color: 'hsl(262, 83%, 58%)', label: 'Violet' },
    { name: 'orange', color: 'hsl(24, 95%, 53%)', label: 'Orange' },
    { name: 'pink', color: 'hsl(330, 81%, 60%)', label: 'Rose' },
    { name: 'teal', color: 'hsl(173, 80%, 40%)', label: 'Turquoise' },
    { name: 'red', color: 'hsl(0, 84%, 60%)', label: 'Rouge' },
    { name: 'amber', color: 'hsl(38, 92%, 50%)', label: 'Ambre' }
  ];

  // Persist settings
  useEffect(() => {
    localStorage.setItem('theme_reduce_motion', reduceMotion.toString());
    localStorage.setItem('theme_high_contrast', highContrast.toString());
    localStorage.setItem('theme_accent_color', selectedAccent);
    localStorage.setItem('theme_font_size', fontSize.toString());
    localStorage.setItem('theme_presets', JSON.stringify(presets));
    localStorage.setItem('theme_history', JSON.stringify(history.slice(-20)));
    localStorage.setItem('theme_favorite_presets', JSON.stringify(favoritePresets));
    
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // Apply reduce motion
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [reduceMotion, highContrast, selectedAccent, fontSize, presets, history, favoritePresets]);

  const handleThemeChange = (theme: ThemeName) => {
    onThemeChange(theme);
    addToHistory(theme, selectedAccent);
  };

  const handleAccentChange = (accent: string) => {
    setSelectedAccent(accent);
    addToHistory(currentTheme, accent);
    toast({
      title: "Couleur d'accent modifiée",
      description: `Nouvelle couleur: ${accentColors.find(c => c.name === accent)?.label}`
    });
  };

  const addToHistory = (theme: ThemeName, accent: string) => {
    const entry: ThemeHistory = {
      id: Date.now().toString(),
      theme,
      accentColor: accent,
      changedAt: new Date().toISOString()
    };
    setHistory(prev => [...prev, entry]);
  };

  const saveAsPreset = () => {
    const name = prompt('Nom du preset:');
    if (!name) return;
    
    const newPreset: ThemePreset = {
      id: Date.now().toString(),
      name,
      theme: currentTheme,
      accentColor: selectedAccent,
      reduceMotion,
      highContrast,
      fontSize,
      createdAt: new Date().toISOString()
    };
    
    setPresets(prev => [...prev, newPreset]);
    toast({
      title: "Preset sauvegardé",
      description: `"${name}" a été ajouté à vos presets`
    });
  };

  const applyPreset = (preset: ThemePreset) => {
    onThemeChange(preset.theme);
    setSelectedAccent(preset.accentColor);
    setReduceMotion(preset.reduceMotion);
    setHighContrast(preset.highContrast);
    setFontSize(preset.fontSize);
    
    toast({
      title: "Preset appliqué",
      description: `"${preset.name}" a été appliqué`
    });
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
    setFavoritePresets(prev => prev.filter(fid => fid !== id));
  };

  const toggleFavoritePreset = (id: string) => {
    setFavoritePresets(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const resetToDefaults = () => {
    onThemeChange('system');
    setSelectedAccent('blue');
    setReduceMotion(false);
    setHighContrast(false);
    setFontSize(100);
    toast({
      title: "Paramètres réinitialisés",
      description: "Les valeurs par défaut ont été restaurées"
    });
  };

  const exportSettings = () => {
    const settings = {
      theme: currentTheme,
      accentColor: selectedAccent,
      reduceMotion,
      highContrast,
      fontSize,
      presets,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const settings = JSON.parse(text);
        
        if (settings.theme) onThemeChange(settings.theme);
        if (settings.accentColor) setSelectedAccent(settings.accentColor);
        if (settings.reduceMotion !== undefined) setReduceMotion(settings.reduceMotion);
        if (settings.highContrast !== undefined) setHighContrast(settings.highContrast);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.presets) setPresets(prev => [...prev, ...settings.presets.filter((p: ThemePreset) => !p.isDefault)]);
        
        toast({
          title: "Import réussi",
          description: "Les paramètres ont été importés"
        });
      } catch (err) {
        toast({
          title: "Erreur d'import",
          description: "Le fichier est invalide",
          variant: "destructive"
        });
      }
    };
    input.click();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance" className="gap-1">
            <Palette className="h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="presets" className="gap-1">
            <Sparkles className="h-4 w-4" />
            Presets
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-1">
            <Eye className="h-4 w-4" />
            Accessibilité
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportSettings}>
                    <Download className="h-4 w-4 mr-1" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" onClick={importSettings}>
                    <Upload className="h-4 w-4 mr-1" />
                    Importer
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetToDefaults}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode d'affichage */}
              <div>
                <h3 className="text-lg font-medium mb-4">Mode d'affichage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <motion.div
                        key={theme.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${currentTheme === theme.name 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                        onClick={() => handleThemeChange(theme.name)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{theme.label}</span>
                        </div>
                        <div className={`h-8 rounded ${theme.preview} border mb-2`} />
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                        <AnimatePresence>
                          {currentTheme === theme.name && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute top-2 right-2"
                            >
                              <Check className="h-5 w-5 text-primary" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Couleurs d'accent */}
              <div>
                <h3 className="text-lg font-medium mb-4">Couleur d'accent</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {accentColors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative h-12 rounded-lg flex flex-col items-center justify-center gap-1 p-2
                        border-2 transition-colors
                        ${selectedAccent === color.name 
                          ? 'border-foreground' 
                          : 'border-transparent hover:border-muted-foreground/50'
                        }
                      `}
                      onClick={() => handleAccentChange(color.name)}
                      aria-label={`Sélectionner la couleur ${color.label}`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-xs">{color.label}</span>
                      {selectedAccent === color.name && (
                        <motion.div
                          layoutId="accent-check"
                          className="absolute -top-1 -right-1 bg-foreground text-background rounded-full p-0.5"
                        >
                          <Check className="h-3 w-3" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Taille de police */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Taille de police</h3>
                  <Badge variant="secondary">{fontSize}%</Badge>
                </div>
                <Slider
                  value={[fontSize]}
                  min={75}
                  max={150}
                  step={5}
                  onValueChange={([value]) => setFontSize(value)}
                  className="w-full"
                  aria-label="Taille de police"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Petit</span>
                  <span>Normal</span>
                  <span>Grand</span>
                </div>
              </div>

              {/* Save as preset */}
              <Button onClick={saveAsPreset} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder comme preset
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Presets de thème
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {presets.map((preset) => {
                    const isFavorite = favoritePresets.includes(preset.id);
                    const accentColor = accentColors.find(c => c.name === preset.accentColor);
                    return (
                      <motion.div
                        key={preset.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: accentColor?.color }}
                            />
                            <span className="font-medium">{preset.name}</span>
                            {preset.isDefault && (
                              <Badge variant="secondary" className="text-xs">Défaut</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => toggleFavoritePreset(preset.id)}
                            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {themes.find(t => t.name === preset.theme)?.label}
                          </Badge>
                          {preset.reduceMotion && (
                            <Badge variant="outline" className="text-xs">Sans animations</Badge>
                          )}
                          {preset.highContrast && (
                            <Badge variant="outline" className="text-xs">Contraste élevé</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">{preset.fontSize}%</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => applyPreset(preset)}
                          >
                            Appliquer
                          </Button>
                          {!preset.isDefault && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deletePreset(preset.id)}
                              aria-label="Supprimer le preset"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Accessibilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-motion">Réduire les animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Diminue les effets visuels pour plus de confort
                  </p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast" className="flex items-center gap-2">
                    <Contrast className="h-4 w-4" />
                    Contraste élevé
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Augmente le contraste pour une meilleure lisibilité
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-theme">Thème automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Change automatiquement selon l'heure de la journée
                  </p>
                </div>
                <Switch
                  id="auto-theme"
                  checked={autoTheme}
                  onCheckedChange={(checked) => {
                    setAutoTheme(checked);
                    if (checked) {
                      onThemeChange('system');
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune modification enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...history].reverse().map((entry) => {
                      const themeInfo = themes.find(t => t.name === entry.theme);
                      const colorInfo = accentColors.find(c => c.name === entry.accentColor);
                      return (
                        <div key={entry.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          {themeInfo && <themeInfo.icon className="h-4 w-4" />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{themeInfo?.label}</span>
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colorInfo?.color }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(entry.changedAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Aperçu */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-card">
            <h4 className="font-medium mb-2">Exemple de contenu</h4>
            <p className="text-muted-foreground mb-3">
              Voici à quoi ressemblera l'interface avec vos paramètres actuels.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Bouton principal</Button>
              <Button size="sm" variant="secondary">Secondaire</Button>
              <Button size="sm" variant="outline">Outline</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettingsTab;
