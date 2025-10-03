
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Eye, Save, RotateCcw } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface ThemeCustomizerProps {
  onClose?: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(8);
  const [animations, setAnimations] = useState(true);
  const [colorScheme, setColorScheme] = useState('default');
  const [previewMode, setPreviewMode] = useState(false);

  const colorSchemes = [
    { name: 'default', label: 'Par défaut', colors: ['#9b87f5', '#7E69AB'] },
    { name: 'ocean', label: 'Océan', colors: ['#0ea5e9', '#0284c7'] },
    { name: 'forest', label: 'Forêt', colors: ['#10b981', '#059669'] },
    { name: 'sunset', label: 'Coucher de soleil', colors: ['#f59e0b', '#d97706'] },
    { name: 'rose', label: 'Rose', colors: ['#ec4899', '#db2777'] },
  ];

  const applyTheme = () => {
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--base-border-radius', `${borderRadius}px`);
    document.documentElement.classList.toggle('reduce-motion', !animations);
    
    // Apply color scheme
    const scheme = colorSchemes.find(s => s.name === colorScheme);
    if (scheme) {
      document.documentElement.style.setProperty('--primary-color', scheme.colors[0]);
      document.documentElement.style.setProperty('--secondary-color', scheme.colors[1]);
    }
  };

  const resetTheme = () => {
    setFontSize(16);
    setBorderRadius(8);
    setAnimations(true);
    setColorScheme('default');
    setTheme('system');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
    >
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Personnalisation du thème
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Mode Preview */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mode aperçu</span>
            <Switch 
              checked={previewMode} 
              onCheckedChange={setPreviewMode}
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Thème</label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Scheme */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Palette de couleurs</label>
            <div className="grid grid-cols-1 gap-2">
              {colorSchemes.map((scheme) => (
                <motion.div
                  key={scheme.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    colorScheme === scheme.name 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setColorScheme(scheme.name)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{scheme.label}</span>
                    <div className="flex gap-1">
                      {scheme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Taille de police</label>
              <Badge variant="outline">{fontSize}px</Badge>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* Border Radius */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Arrondi des bordures</label>
              <Badge variant="outline">{borderRadius}px</Badge>
            </div>
            <Slider
              value={[borderRadius]}
              onValueChange={(value) => setBorderRadius(value[0])}
              min={0}
              max={20}
              step={2}
              className="w-full"
            />
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Animations</span>
            <Switch 
              checked={animations} 
              onCheckedChange={setAnimations}
            />
          </div>

          {/* Preview Section */}
          {previewMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <h4 className="font-medium mb-2">Aperçu</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full">
                  Bouton d'exemple
                </Button>
                <div className="p-2 bg-white dark:bg-gray-700 rounded border">
                  <p className="text-sm">Texte d'exemple avec la nouvelle police</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            <Button 
              onClick={applyTheme} 
              className="w-full"
              disabled={!previewMode}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Appliquer' : 'Aperçu activé'}
            </Button>
            
            <div className="flex gap-2">
              <Button onClick={resetTheme} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              
              <Button variant="outline" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>

            {onClose && (
              <Button onClick={onClose} variant="ghost" className="w-full">
                Fermer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ThemeCustomizer;
