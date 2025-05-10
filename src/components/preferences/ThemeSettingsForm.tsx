
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThemeName } from '@/types';
import { Sun, Moon, Palette, Clock, CloudRain, Heart } from 'lucide-react';
import ThemePreview from './ThemePreview';
import { motion } from 'framer-motion';

const backgroundOptions = [
  { name: 'Stars', url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920' },
  { name: 'Forest', url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1920' },
  { name: 'Mountains', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920' },
  { name: 'Ocean', url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920' },
];

const ThemeSettingsForm = () => {
  const { theme, setThemePreference, dynamicThemeMode, setDynamicThemeMode } = useTheme();
  const { toast } = useToast();
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  // Update theme
  const handleThemeChange = (newTheme: ThemeName) => {
    setThemePreference(newTheme);
    
    toast({
      title: "Thème mis à jour",
      description: `Le thème a été changé pour "${newTheme}".`
    });
  };

  // Change dynamic theme mode
  const handleDynamicTheme = (mode: 'none' | 'time' | 'emotion' | 'weather') => {
    setDynamicThemeMode(mode);
    
    toast({
      title: "Mode dynamique mis à jour",
      description: mode === 'none' 
        ? "Le mode dynamique a été désactivé." 
        : `Le thème s'adaptera désormais selon: ${
            mode === 'time' ? "l'heure de la journée" : 
            mode === 'emotion' ? "votre état émotionnel" : "la météo"
          }.`
    });
  };

  // Change background
  const changeBackground = (url: string) => {
    setCustomBackground(url);
    
    // In a real app, you would save this to user preferences
    toast({
      title: "Arrière-plan mis à jour",
      description: "Votre arrière-plan personnalisé a été appliqué."
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thème de l'interface</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ThemePreview 
            theme="light"
            isSelected={theme === 'light'} 
            onClick={() => handleThemeChange('light')}
          />
          
          <ThemePreview 
            theme="dark"
            isSelected={theme === 'dark'} 
            onClick={() => handleThemeChange('dark')}
          />
          
          <ThemePreview 
            theme="pastel"
            isSelected={theme === 'pastel'} 
            onClick={() => handleThemeChange('pastel')}
          />
          
          <ThemePreview 
            theme="nature"
            isSelected={theme === 'nature'} 
            onClick={() => handleThemeChange('nature')}
          />
          
          <ThemePreview 
            theme="misty"
            isSelected={theme === 'misty'} 
            onClick={() => handleThemeChange('misty')}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thème dynamique</h3>
        <p className="text-sm text-muted-foreground">
          Le thème peut s'adapter automatiquement selon différents critères.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            variant={dynamicThemeMode === 'time' ? "default" : "outline"} 
            onClick={() => handleDynamicTheme(dynamicThemeMode === 'time' ? 'none' : 'time')}
            className="flex items-center gap-2 justify-start"
          >
            <Clock className="h-4 w-4" />
            <span>Heure de la journée</span>
          </Button>
          
          <Button 
            variant={dynamicThemeMode === 'emotion' ? "default" : "outline"}
            onClick={() => handleDynamicTheme(dynamicThemeMode === 'emotion' ? 'none' : 'emotion')}
            className="flex items-center gap-2 justify-start"
          >
            <Heart className="h-4 w-4" />
            <span>État émotionnel</span>
          </Button>
          
          <Button 
            variant={dynamicThemeMode === 'weather' ? "default" : "outline"}
            onClick={() => handleDynamicTheme(dynamicThemeMode === 'weather' ? 'none' : 'weather')}
            className="flex items-center gap-2 justify-start"
          >
            <CloudRain className="h-4 w-4" />
            <span>Météo locale</span>
          </Button>
        </div>
        
        {dynamicThemeMode !== 'none' && (
          <p className="text-sm p-3 border border-blue-200 bg-blue-50 rounded-md dark:bg-blue-900/30 dark:border-blue-900/50">
            {dynamicThemeMode === 'time' && 
              "Le thème changera automatiquement : clair le matin, doux l'après-midi, et sombre la nuit."
            }
            {dynamicThemeMode === 'emotion' && 
              "Le thème s'ajustera en fonction de votre état émotionnel détecté dans vos activités récentes."
            }
            {dynamicThemeMode === 'weather' && 
              "Le thème reflètera la météo locale avec des tons adaptés (ensoleillé, nuageux, pluvieux)."
            }
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Arrière-plan personnalisé</h3>
        <p className="text-sm text-muted-foreground">
          Choisissez un arrière-plan qui correspond à votre état d'esprit.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {backgroundOptions.map((bg) => (
            <motion.div 
              key={bg.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`h-24 rounded-lg cursor-pointer overflow-hidden transition-all ${customBackground === bg.url ? 'ring-4 ring-primary' : 'opacity-80 hover:opacity-100'}`}
              onClick={() => changeBackground(bg.url)}
            >
              <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Paramètres sauvegardés", description: "Vos préférences d'apparence ont été mises à jour." })}>
          Enregistrer les préférences
        </Button>
      </div>
    </motion.div>
  );
};

export default ThemeSettingsForm;
