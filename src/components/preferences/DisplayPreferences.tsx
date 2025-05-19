
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences } from '@/types/preferences';
import ThemePreview from './ThemePreview';

interface DisplayPreferencesProps {
  preferences: UserPreferences;
  onSave: (values: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

const DisplayPreferences: React.FC<DisplayPreferencesProps> = ({ preferences, onSave, isLoading = false }) => {
  const { register, handleSubmit, setValue, watch } = useForm<UserPreferences>({
    defaultValues: {
      theme: preferences.theme || 'system',
      fontSize: preferences.fontSize || 'medium',
      fontFamily: preferences.fontFamily || 'system',
      highContrast: preferences.highContrast || false,
      reduceMotion: preferences.reduceMotion || false,
      colorBlindMode: preferences.colorBlindMode || false,
    }
  });
  
  const currentTheme = watch('theme');
  const currentFontSize = watch('fontSize');
  
  const handleThemeChange = async (theme: string) => {
    setValue('theme', theme as 'light' | 'dark' | 'system' | 'pastel');
    await onSave({ theme: theme as 'light' | 'dark' | 'system' | 'pastel' });
  };
  
  const handleFontSizeChange = async (size: string) => {
    setValue('fontSize', size as 'small' | 'medium' | 'large' | 'xlarge');
    await onSave({ fontSize: size as 'small' | 'medium' | 'large' | 'xlarge' });
  };
  
  const handleFontFamilyChange = async (family: string) => {
    setValue('fontFamily', family as 'sans' | 'serif' | 'mono' | 'system' | 'rounded');
    await onSave({ fontFamily: family as 'sans' | 'serif' | 'mono' | 'system' | 'rounded' });
  };
  
  const themes = [
    { value: 'light', label: 'Lumineux' },
    { value: 'dark', label: 'Sombre' },
    { value: 'system', label: 'Système' },
    { value: 'pastel', label: 'Pastel' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Petit' },
    { value: 'medium', label: 'Moyen' },
    { value: 'large', label: 'Grand' },
    { value: 'xlarge', label: 'Très grand' }
  ];

  const fontFamilies = [
    { value: 'sans', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
    { value: 'system', label: 'Système' },
    { value: 'rounded', label: 'Arrondi' }
  ];
  
  const handleToggleHighContrast = async (checked: boolean) => {
    setValue('highContrast', checked);
    await onSave({ highContrast: checked });
  };
  
  const handleToggleReduceMotion = async (checked: boolean) => {
    setValue('reduceMotion', checked);
    await onSave({ reduceMotion: checked });
  };
  
  const handleToggleColorBlindMode = async (checked: boolean) => {
    setValue('colorBlindMode', checked);
    await onSave({ colorBlindMode: checked });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thème et couleurs</CardTitle>
          <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="theme">Thème visuel</Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {themes.map((theme) => (
                <div key={theme.value} className="relative group">
                  <button
                    type="button"
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
                      theme.value === currentTheme ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleThemeChange(theme.value)}
                    disabled={isLoading}
                  >
                    <div className="aspect-video w-full">
                      <ThemePreview theme={theme.value as any} />
                    </div>
                    <div className="p-2 text-center text-sm font-medium">
                      {theme.label}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="font-size">Taille du texte</Label>
              <Select 
                value={currentFontSize} 
                onValueChange={handleFontSizeChange}
                disabled={isLoading}
              >
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Choisir une taille de texte" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="font-family">Police d'écriture</Label>
              <Select 
                value={preferences.fontFamily || 'system'} 
                onValueChange={handleFontFamilyChange}
                disabled={isLoading}
              >
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Choisir une police" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Accessibilité</CardTitle>
          <CardDescription>Options d'accessibilité et de confort visuel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-contrast" className="block">Contraste élevé</Label>
              <p className="text-sm text-muted-foreground">Augmenter le contraste pour faciliter la lecture</p>
            </div>
            <Switch
              id="high-contrast"
              checked={preferences.highContrast || false}
              onCheckedChange={handleToggleHighContrast}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduce-motion" className="block">Réduire les animations</Label>
              <p className="text-sm text-muted-foreground">Limiter les effets de mouvement et les animations</p>
            </div>
            <Switch
              id="reduce-motion"
              checked={preferences.reduceMotion || false}
              onCheckedChange={handleToggleReduceMotion}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="color-blind" className="block">Mode daltonien</Label>
              <p className="text-sm text-muted-foreground">Ajuster les couleurs pour les personnes daltoniennes</p>
            </div>
            <Switch
              id="color-blind"
              checked={Boolean(preferences.colorBlindMode)}
              onCheckedChange={handleToggleColorBlindMode}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreferences;
