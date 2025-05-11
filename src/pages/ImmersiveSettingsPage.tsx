import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemePreview from '@/components/preferences/ThemePreview';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { FontFamily, FontSize, ThemeName } from '@/types/user';

// Autres imports...

const ImmersiveSettingsPage: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(preferences.theme || 'light');
  const [selectedFont, setSelectedFont] = useState<FontFamily>(preferences.font as FontFamily || 'inter');
  const [selectedFontSize, setSelectedFontSize] = useState<FontSize>(preferences.fontSize as FontSize || 'medium');
  
  const [highContrast, setHighContrast] = useState<boolean>(preferences.highContrast || false);
  const [reducedAnimations, setReducedAnimations] = useState<boolean>(preferences.reducedAnimations || false);
  const [screenReader, setScreenReader] = useState<boolean>(preferences.screenReader || false);
  const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(preferences.keyboardNavigation || false);
  const [audioGuidance, setAudioGuidance] = useState<boolean>(preferences.audioGuidance || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(preferences.notificationsEnabled || true);
  const [notificationFrequency, setNotificationFrequency] = useState<string>(preferences.notificationFrequency || 'daily');
  const [notificationTone, setNotificationTone] = useState<string>(preferences.notificationTone || 'minimalist');
  const [reminderTime, setReminderTime] = useState<string>(preferences.reminderTime || '09:00');
  const [dynamicThemeMode, setDynamicThemeMode] = useState<'none' | 'time' | 'emotion' | 'weather'>(preferences.dynamicTheme || 'none');
  
  const handleThemeChange = (theme: ThemeName) => {
    setSelectedTheme(theme);
    updatePreferences({ theme });
  };
  
  const handleFontChange = (font: FontFamily) => {
    setSelectedFont(font);
    updatePreferences({ font: font as string });
  };
  
  const handleFontSizeChange = (fontSize: FontSize) => {
    setSelectedFontSize(fontSize);
    updatePreferences({ fontSize: fontSize as string });
  };
  
  const handleHighContrastChange = (value: boolean) => {
    setHighContrast(value);
    updatePreferences({ highContrast: value });
  };
  
  const handleReducedAnimationsChange = (value: boolean) => {
    setReducedAnimations(value);
    updatePreferences({ reducedAnimations: value });
  };
  
  const handleScreenReaderChange = (value: boolean) => {
    setScreenReader(value);
    updatePreferences({ screenReader: value });
  };
  
  const handleKeyboardNavigationChange = (value: boolean) => {
    setKeyboardNavigation(value);
    updatePreferences({ keyboardNavigation: value });
  };
  
  const handleAudioGuidanceChange = (value: boolean) => {
    setAudioGuidance(value);
    updatePreferences({ audioGuidance: value });
  };
  
  const handleNotificationsEnabledChange = (value: boolean) => {
    setNotificationsEnabled(value);
    updatePreferences({ notificationsEnabled: value });
  };
  
  const handleNotificationFrequencyChange = (value: string) => {
    setNotificationFrequency(value);
    updatePreferences({ notificationFrequency: value });
  };
  
  const handleNotificationToneChange = (value: string) => {
    setNotificationTone(value);
    updatePreferences({ notificationTone: value });
  };
  
  const handleReminderTimeChange = (value: string) => {
    setReminderTime(value);
    updatePreferences({ reminderTime: value });
  };
  
  const handleDynamicThemeModeChange = (value: 'none' | 'time' | 'emotion' | 'weather') => {
    setDynamicThemeMode(value);
    updatePreferences({ dynamicTheme: value });
  };
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Paramètres immersifs</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-8">
          {/* Thème */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Thème</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['light', 'dark', 'pastel', 'nature', 'misty', 'starry'].map((theme) => (
                  <ThemePreview 
                    key={theme}
                    theme={theme as ThemeName}
                    isSelected={selectedTheme === theme}
                    onClick={() => handleThemeChange(theme as ThemeName)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Police */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Police</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'inter', label: 'Inter', className: 'font-sans' },
                  { value: 'dm-sans', label: 'DM Sans', className: 'font-sans' },
                  { value: 'atkinson', label: 'Atkinson', className: 'font-mono' },
                  { value: 'serif', label: 'Serif', className: 'font-serif' }
                ].map((font) => (
                  <Button 
                    key={font.value}
                    variant={selectedFont === font.value ? "default" : "outline"} 
                    className={`h-24 text-lg ${font.className}`}
                    onClick={() => handleFontChange(font.value as FontFamily)}
                  >
                    {font.label}
                    <br />
                    <span className="text-sm opacity-70">AaBbCc123</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Taille de police */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Taille de police</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'small', label: 'Petite', className: 'text-sm' },
                  { value: 'medium', label: 'Moyenne', className: 'text-base' },
                  { value: 'large', label: 'Grande', className: 'text-lg' }
                ].map((size) => (
                  <Button 
                    key={size.value}
                    variant={selectedFontSize === size.value ? "default" : "outline"} 
                    className={`h-16 ${size.className}`}
                    onClick={() => handleFontSizeChange(size.value as FontSize)}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Thème dynamique */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Thème dynamique</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'none', label: 'Désactivé', description: 'Utiliser le thème sélectionné' },
                  { value: 'time', label: 'Selon l\'heure', description: 'Change en fonction du moment de la journée' },
                  { value: 'emotion', label: 'Selon l\'émotion', description: 'S\'adapte à votre état émotionnel' },
                  { value: 'weather', label: 'Selon la météo', description: 'Reflète les conditions météorologiques' }
                ].map((mode) => (
                  <Button 
                    key={mode.value}
                    variant={dynamicThemeMode === mode.value ? "default" : "outline"} 
                    className="h-24 flex flex-col items-start justify-center p-4"
                    onClick={() => handleDynamicThemeModeChange(mode.value as 'none' | 'time' | 'emotion' | 'weather')}
                  >
                    <span className="font-medium">{mode.label}</span>
                    <span className="text-xs mt-1 opacity-70">{mode.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accessibility" className="space-y-8">
          {/* Options d'accessibilité */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Options d'accessibilité</h2>
              <div className="space-y-4">
                {[
                  { id: 'high-contrast', label: 'Contraste élevé', description: 'Augmente le contraste pour une meilleure lisibilité', value: highContrast, onChange: handleHighContrastChange },
                  { id: 'reduced-animations', label: 'Réduire les animations', description: 'Désactive ou réduit les animations de l\'interface', value: reducedAnimations, onChange: handleReducedAnimationsChange },
                  { id: 'screen-reader', label: 'Lecteur d\'écran', description: 'Optimise l\'interface pour les lecteurs d\'écran', value: screenReader, onChange: handleScreenReaderChange },
                  { id: 'keyboard-navigation', label: 'Navigation au clavier', description: 'Améliore la navigation avec le clavier', value: keyboardNavigation, onChange: handleKeyboardNavigationChange },
                  { id: 'audio-guidance', label: 'Guidage audio', description: 'Fournit des indications audio pour naviguer dans l\'application', value: audioGuidance, onChange: handleAudioGuidanceChange }
                ].map((option) => (
                  <div key={option.id} className="flex items-start space-x-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <Button
                      variant={option.value ? "default" : "outline"}
                      onClick={() => option.onChange(!option.value)}
                    >
                      {option.value ? "Activé" : "Désactivé"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-8">
          {/* Paramètres de notifications */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Paramètres de notifications</h2>
              <div className="space-y-6">
                {/* Activer/désactiver les notifications */}
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Activer ou désactiver toutes les notifications</p>
                  </div>
                  <Button
                    variant={notificationsEnabled ? "default" : "outline"}
                    onClick={() => handleNotificationsEnabledChange(!notificationsEnabled)}
                  >
                    {notificationsEnabled ? "Activées" : "Désactivées"}
                  </Button>
                </div>
                
                {/* Fréquence des notifications */}
                <div className="space-y-2">
                  <h3 className="font-medium">Fréquence des notifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'daily', label: 'Quotidienne' },
                      { value: 'weekly', label: 'Hebdomadaire' },
                      { value: 'flexible', label: 'Flexible' },
                      { value: 'none', label: 'Aucune' }
                    ].map((freq) => (
                      <Button 
                        key={freq.value}
                        variant={notificationFrequency === freq.value ? "default" : "outline"} 
                        onClick={() => handleNotificationFrequencyChange(freq.value)}
                      >
                        {freq.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Ton des notifications */}
                <div className="space-y-2">
                  <h3 className="font-medium">Ton des notifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'minimalist', label: 'Minimaliste' },
                      { value: 'poetic', label: 'Poétique' },
                      { value: 'directive', label: 'Directif' },
                      { value: 'silent', label: 'Silencieux' }
                    ].map((tone) => (
                      <Button 
                        key={tone.value}
                        variant={notificationTone === tone.value ? "default" : "outline"} 
                        onClick={() => handleNotificationToneChange(tone.value)}
                      >
                        {tone.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Heure de rappel */}
                <div className="space-y-2">
                  <h3 className="font-medium">Heure de rappel</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: '09:00', label: '9:00' },
                      { value: '12:00', label: '12:00' },
                      { value: '15:00', label: '15:00' },
                      { value: '18:00', label: '18:00' },
                      { value: '21:00', label: '21:00' },
                      { value: 'custom', label: 'Personnalisé' }
                    ].map((time) => (
                      <Button 
                        key={time.value}
                        variant={reminderTime === time.value ? "default" : "outline"} 
                        onClick={() => handleReminderTimeChange(time.value)}
                      >
                        {time.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImmersiveSettingsPage;
