
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/theme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, Monitor, PenTool, Type, TextCursorInput } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { FontSize, FontFamily, Theme } from '@/types/theme';

export function ThemeSettingsTab() {
  const { theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);

  // Map display names for better readability
  const fontFamilyMap: Record<string, string> = {
    sans: 'Sans-Serif',
    serif: 'Serif',
    mono: 'Monospace',
    rounded: 'Arrondie'
  };

  const fontSizeMap: Record<string, string> = {
    sm: 'Petite',
    md: 'Moyenne',
    lg: 'Grande',
    xl: 'Très grande'
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Paramètres d'affichage</h2>
        <p className="text-muted-foreground mb-6">
          Personnalisez l'apparence de l'application selon vos préférences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Thème */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <span>Thème</span>
            </CardTitle>
            <CardDescription>
              Choisissez le thème qui vous convient le mieux.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`relative cursor-pointer rounded-lg border p-4 text-center hover:bg-accent ${theme === 'light' ? 'bg-accent border-primary' : ''}`}
                   onClick={() => setTheme('light')}>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-white flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <div className="font-medium">Clair</div>
                <RadioGroupItem value="light" id="theme-light" className="sr-only" checked={theme === 'light'} />
              </div>

              <div className={`relative cursor-pointer rounded-lg border p-4 text-center hover:bg-accent ${theme === 'dark' ? 'bg-accent border-primary' : ''}`}
                   onClick={() => setTheme('dark')}>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center">
                  <Moon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="font-medium">Sombre</div>
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" checked={theme === 'dark'} />
              </div>

              <div className={`relative cursor-pointer rounded-lg border p-4 text-center hover:bg-accent ${theme === 'system' ? 'bg-accent border-primary' : ''}`}
                   onClick={() => setTheme('system')}>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gradient-to-br from-white to-slate-900 flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="font-medium">Système</div>
                <RadioGroupItem value="system" id="theme-system" className="sr-only" checked={theme === 'system'} />
              </div>

              <div className={`relative cursor-pointer rounded-lg border p-4 text-center hover:bg-accent ${theme === 'pastel' ? 'bg-accent border-primary' : ''}`}
                   onClick={() => setTheme('pastel')}>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <PenTool className="h-6 w-6 text-blue-500" />
                </div>
                <div className="font-medium">Pastel</div>
                <RadioGroupItem value="pastel" id="theme-pastel" className="sr-only" checked={theme === 'pastel'} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Police */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              <span>Police</span>
            </CardTitle>
            <CardDescription>
              Sélectionnez votre police préférée.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <RadioGroup 
                value={fontFamily || 'sans'} 
                onValueChange={(value) => setFontFamily(value as FontFamily)}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                <Label
                  className={`flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${fontFamily === 'sans' ? 'border-primary' : 'border-muted'}`}
                  htmlFor="font-sans"
                >
                  <RadioGroupItem value="sans" id="font-sans" className="sr-only" />
                  <span className="font-sans text-xl">Aa</span>
                  <span className="mt-2 text-center text-xs">Sans-Serif</span>
                </Label>

                <Label
                  className={`flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${fontFamily === 'serif' ? 'border-primary' : 'border-muted'}`}
                  htmlFor="font-serif"
                >
                  <RadioGroupItem value="serif" id="font-serif" className="sr-only" />
                  <span className="font-serif text-xl">Aa</span>
                  <span className="mt-2 text-center text-xs">Serif</span>
                </Label>

                <Label
                  className={`flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${fontFamily === 'mono' ? 'border-primary' : 'border-muted'}`}
                  htmlFor="font-mono"
                >
                  <RadioGroupItem value="mono" id="font-mono" className="sr-only" />
                  <span className="font-mono text-xl">Aa</span>
                  <span className="mt-2 text-center text-xs">Monospace</span>
                </Label>

                <Label
                  className={`flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${fontFamily === 'rounded' ? 'border-primary' : 'border-muted'}`}
                  htmlFor="font-rounded"
                >
                  <RadioGroupItem value="rounded" id="font-rounded" className="sr-only" />
                  <span className="font-sans text-xl tracking-wide" style={{ borderRadius: '0.2rem' }}>Aa</span>
                  <span className="mt-2 text-center text-xs">Arrondie</span>
                </Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Taille de texte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TextCursorInput className="h-5 w-5" />
              <span>Taille du texte</span>
            </CardTitle>
            <CardDescription>
              Ajustez la taille du texte selon vos préférences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={fontSize || 'md'} 
              onValueChange={(value) => setFontSize(value as FontSize)}
              className="grid grid-cols-4 gap-2"
            >
              <Label
                className={`flex h-16 cursor-pointer flex-col items-center justify-center rounded-md border-2 p-2 ${fontSize === 'sm' ? 'border-primary' : 'border-muted'} hover:bg-accent`}
                htmlFor="font-size-sm"
              >
                <RadioGroupItem value="sm" id="font-size-sm" className="sr-only" />
                <span className="text-sm">Aa</span>
                <span className="mt-1 text-[10px]">Petite</span>
              </Label>

              <Label
                className={`flex h-16 cursor-pointer flex-col items-center justify-center rounded-md border-2 p-2 ${fontSize === 'md' ? 'border-primary' : 'border-muted'} hover:bg-accent`}
                htmlFor="font-size-md"
              >
                <RadioGroupItem value="md" id="font-size-md" className="sr-only" />
                <span className="text-base">Aa</span>
                <span className="mt-1 text-[10px]">Moyenne</span>
              </Label>

              <Label
                className={`flex h-16 cursor-pointer flex-col items-center justify-center rounded-md border-2 p-2 ${fontSize === 'lg' ? 'border-primary' : 'border-muted'} hover:bg-accent`}
                htmlFor="font-size-lg"
              >
                <RadioGroupItem value="lg" id="font-size-lg" className="sr-only" />
                <span className="text-lg">Aa</span>
                <span className="mt-1 text-[10px]">Grande</span>
              </Label>

              <Label
                className={`flex h-16 cursor-pointer flex-col items-center justify-center rounded-md border-2 p-2 ${fontSize === 'xl' ? 'border-primary' : 'border-muted'} hover:bg-accent`}
                htmlFor="font-size-xl"
              >
                <RadioGroupItem value="xl" id="font-size-xl" className="sr-only" />
                <span className="text-xl">Aa</span>
                <span className="mt-1 text-[10px]">XL</span>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Accessibilité */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibilité</CardTitle>
            <CardDescription>
              Options pour améliorer l'accessibilité de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduced-motion">Réduire les animations</Label>
                <p className="text-sm text-muted-foreground">
                  Réduit ou élimine les effets d'animation
                </p>
              </div>
              <Switch 
                id="reduced-motion" 
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast">Contraste élevé</Label>
                <p className="text-sm text-muted-foreground">
                  Augmente le contraste des couleurs pour une meilleure lisibilité
                </p>
              </div>
              <Switch 
                id="high-contrast" 
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
