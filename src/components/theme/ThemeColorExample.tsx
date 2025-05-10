
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeName } from '@/types';
import { Moon, Sun, Palette } from 'lucide-react';

interface ThemeColorExampleProps {
  theme?: ThemeName;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme = 'light' }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const themeClasses = {
    light: 'bg-white text-black border',
    dark: 'bg-slate-950 text-white',
    pastel: 'bg-blue-50 text-blue-900',
    system: 'bg-gray-100 text-gray-900',
  };

  const themeNames = {
    light: 'Clair',
    dark: 'Sombre',
    pastel: 'Pastel',
    system: 'Système',
  };

  const ThemeIcon = () => {
    switch (currentTheme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'pastel':
        return <Palette className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const handleThemeChange = (newTheme: ThemeName) => {
    setCurrentTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant={currentTheme === 'light' ? 'default' : 'outline'} 
          onClick={() => handleThemeChange('light')}
        >
          <Sun className="mr-1 h-4 w-4" /> Clair
        </Button>
        <Button 
          size="sm" 
          variant={currentTheme === 'dark' ? 'default' : 'outline'} 
          onClick={() => handleThemeChange('dark')}
        >
          <Moon className="mr-1 h-4 w-4" /> Sombre
        </Button>
        <Button 
          size="sm" 
          variant={currentTheme === 'pastel' ? 'default' : 'outline'} 
          onClick={() => handleThemeChange('pastel')}
        >
          <Palette className="mr-1 h-4 w-4" /> Pastel
        </Button>
      </div>

      <Card className={`${themeClasses[currentTheme]} transition-all duration-300`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exemple de thème {themeNames[currentTheme]}</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <ThemeIcon /> {themeNames[currentTheme]}
            </Badge>
          </div>
          <CardDescription>
            Ceci montre l'apparence des composants avec le thème {themeNames[currentTheme]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Bouton primaire</Button>
            <Button variant="secondary">Bouton secondaire</Button>
            <Button variant="outline">Bouton contour</Button>
            <Button variant="ghost">Bouton fantôme</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>Badge standard</Badge>
            <Badge variant="secondary">Badge secondaire</Badge>
            <Badge variant="outline">Badge contour</Badge>
            <Badge variant="destructive">Badge d'erreur</Badge>
          </div>
          
          <div className="p-4 rounded-md bg-card border text-card-foreground">
            <p className="text-sm">Carte imbriquée avec le thème {themeNames[currentTheme]}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeColorExample;
