
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import type { Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface PersonalizationSectionProps {
  onContinue: () => void;
  onBack: () => void;
  emotion: string;
  onResponse: (key: string, value: any) => void;
}

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({
  onContinue,
  onBack,
  emotion,
  onResponse
}) => {
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState('standard');
  
  const handleContinue = () => {
    onResponse('personalization_preferences', {
      theme,
      font_family: fontFamily,
      font_size: fontSize,
      notifications,
      sound_enabled: soundEnabled,
      privacy_level: privacyLevel
    });
    
    onContinue();
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Personnalisez votre expérience
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Adaptez EmotionsCare à vos préférences pour une expérience sur mesure.
        </p>
      </motion.div>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-base font-medium">Thème</Label>
                  <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Choisir un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fontFamily" className="text-base font-medium">Police de caractères</Label>
                  <Select value={fontFamily} onValueChange={(value) => setFontFamily(value as FontFamily)}>
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Choisir une police" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (défaut)</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fontSize" className="text-base font-medium">Taille de police</Label>
                  <Select value={fontSize} onValueChange={(value) => setFontSize(value as FontSize)}>
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Choisir une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Normale (défaut)</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="text-base font-medium">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Recevez des rappels et alertes personnalisées</p>
                </div>
                <Switch 
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sound" className="text-base font-medium">Sons et musique</Label>
                  <p className="text-sm text-muted-foreground">Activez le son pour les exercices et méditations</p>
                </div>
                <Switch 
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="privacyLevel" className="text-base font-medium">Niveau de confidentialité</Label>
                <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
                  <SelectTrigger id="privacyLevel">
                    <SelectValue placeholder="Choisir un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enhanced">Renforcé</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Détermine comment vos données sont traitées et stockées dans l'application
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={handleContinue}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationSection;
