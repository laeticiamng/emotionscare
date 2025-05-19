
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { Theme } from '@/types/theme';
import { motion } from 'framer-motion';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onChange }) => {
  const themes = [
    { 
      id: 'light', 
      name: 'Clair', 
      description: 'Mode clair, idéal pour la journée',
      icon: Sun,
      bg: 'bg-white dark:bg-gray-100',
      text: 'text-gray-900 dark:text-gray-900'
    },
    { 
      id: 'dark', 
      name: 'Sombre', 
      description: 'Mode sombre, confortable pour la nuit',
      icon: Moon,
      bg: 'bg-gray-900',
      text: 'text-white'
    },
    { 
      id: 'system', 
      name: 'Système', 
      description: 'Suit les préférences de votre appareil',
      icon: Monitor,
      bg: 'bg-gradient-to-r from-blue-100 to-white dark:from-gray-800 dark:to-gray-900',
      text: 'text-gray-900 dark:text-white'
    },
    { 
      id: 'pastel', 
      name: 'Pastel', 
      description: 'Couleurs douces et relaxantes',
      icon: Palette,
      bg: 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30',
      text: 'text-gray-900 dark:text-white'
    }
  ];
  
  const handleThemeChange = (themeId: string) => {
    onChange(themeId as Theme);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Thème</span>
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = currentTheme === theme.id;
            
            return (
              <motion.div
                key={theme.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`w-full h-auto p-0 overflow-hidden border-2 ${
                    isActive ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <div className="flex flex-col w-full">
                    <div className={`w-full py-6 flex items-center justify-center ${theme.bg} ${theme.text}`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <div className="w-full p-3 text-left bg-background">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {theme.name}
                        {isActive && (
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
