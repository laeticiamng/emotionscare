
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Eye,
  Contrast
} from 'lucide-react';
import { ThemeName } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [autoTheme, setAutoTheme] = React.useState(currentTheme === 'system');
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);

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
    { name: 'blue', color: 'bg-blue-500', label: 'Bleu' },
    { name: 'green', color: 'bg-green-500', label: 'Vert' },
    { name: 'purple', color: 'bg-purple-500', label: 'Violet' },
    { name: 'orange', color: 'bg-orange-500', label: 'Orange' },
    { name: 'pink', color: 'bg-pink-500', label: 'Rose' },
    { name: 'teal', color: 'bg-teal-500', label: 'Turquoise' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du thème */}
          <div>
            <h3 className="text-lg font-medium mb-4">Mode d'affichage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <div
                    key={theme.name}
                    className={`
                      relative p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${currentTheme === theme.name 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => onThemeChange(theme.name)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{theme.label}</span>
                    </div>
                    <div className={`h-8 rounded ${theme.preview} border mb-2`} />
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                    {currentTheme === theme.name && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Couleurs d'accent */}
          <div>
            <h3 className="text-lg font-medium mb-4">Couleur d'accent</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {accentColors.map((color) => (
                <Button
                  key={color.name}
                  variant="outline"
                  className="h-12 flex flex-col items-center gap-1 p-2"
                >
                  <div className={`w-4 h-4 rounded-full ${color.color}`} />
                  <span className="text-xs">{color.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibilité */}
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
            <Button size="sm">Bouton d'exemple</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettingsTab;
