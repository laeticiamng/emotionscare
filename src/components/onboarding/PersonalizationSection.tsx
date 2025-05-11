
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  const [theme, setTheme] = useState<string>('system');
  const [fontSize, setFontSize] = useState<string>('medium');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [audioCues, setAudioCues] = useState<boolean>(true);
  
  const handleContinue = () => {
    onResponse('personalization_preferences', {
      theme,
      fontSize,
      notifications,
      emailNotifications,
      musicEnabled,
      audioCues
    });
    onContinue();
  };
  
  // Adjust recommendations based on emotional profile
  const getMusicRecommendation = () => {
    switch (emotion) {
      case 'joy':
      case 'energetic':
        return "Musique énergisante pour maintenir votre élan positif";
      case 'calm':
      case 'focus':
        return "Ambiances sonores douces pour maintenir votre concentration";
      case 'sad':
      case 'anxiety':
      case 'stress':
        return "Mélodies apaisantes pour vous accompagner et vous réconforter";
      default:
        return "Musique adaptative qui s'ajuste à votre humeur du moment";
    }
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Personnalisation avancée
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Configurez EmotionsCare selon vos préférences pour une expérience optimale.
        </p>
      </motion.div>

      <Tabs defaultValue="interface" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audio">Audio & Musique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Thème d'affichage</Label>
                <RadioGroup 
                  defaultValue={theme}
                  onValueChange={(value) => {
                    setTheme(value);
                    onResponse('theme_preference', value);
                  }}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Clair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Sombre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">Système (adapté à vos préférences)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-4 block">Taille de texte</Label>
                <RadioGroup 
                  defaultValue={fontSize}
                  onValueChange={(value) => {
                    setFontSize(value);
                    onResponse('font_size_preference', value);
                  }}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Petite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Moyenne</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Grande</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">
                    Notifications dans l'application
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recevez des alertes et des rappels dans l'application.
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications}
                  onCheckedChange={(checked) => {
                    setNotifications(checked);
                    onResponse('notifications_enabled', checked);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    Notifications par email
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recevez des résumés et des informations importantes par email.
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked);
                    onResponse('email_notifications_enabled', checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="music-enabled" className="text-base font-medium">
                    Musique adaptative
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getMusicRecommendation()}
                  </p>
                </div>
                <Switch 
                  id="music-enabled" 
                  checked={musicEnabled}
                  onCheckedChange={(checked) => {
                    setMusicEnabled(checked);
                    onResponse('music_enabled', checked);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audio-cues" className="text-base font-medium">
                    Indices sonores
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Activez les retours sonores pour les actions importantes.
                  </p>
                </div>
                <Switch 
                  id="audio-cues" 
                  checked={audioCues}
                  onCheckedChange={(checked) => {
                    setAudioCues(checked);
                    onResponse('audio_cues_enabled', checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleContinue}>
          Terminer la personnalisation
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationSection;
