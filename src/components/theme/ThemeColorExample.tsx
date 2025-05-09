
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeColorExample: React.FC = () => {
  const { setThemePreference } = useTheme();
  const { colors } = useThemeColors();
  const [activeTab, setActiveTab] = useState<string>('colors');

  // Theme color palettes
  const themePalettes = [
    {
      id: 'light',
      name: 'Light Theme',
      description: 'Fond blanc avec accents bleus',
      primary: '#3B82F6',
      background: '#FFFFFF',
      card: '#FFFFFF',
      muted: '#F3F4F6',
      border: '#E5E7EB'
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      description: 'Fond sombre avec accents cyan',
      primary: '#06B6D4',
      background: '#111827',
      card: '#1F2937',
      muted: '#374151',
      border: '#4B5563'
    },
    {
      id: 'pastel',
      name: 'Pastel-bleu',
      description: 'Fond doux avec composants bleus',
      primary: '#93C5FD',
      background: '#F0F9FF',
      card: '#F8FAFC',
      muted: '#BFDBFE',
      border: '#DBEAFE'
    }
  ];

  // Special feature colors
  const featureColors = [
    { name: 'Scan Button', color: '#10B981', label: 'vert menthe', feature: 'Scan' },
    { name: 'Coach Utilisateur', color: '#BFDBFE', label: 'bleu clair', feature: 'Chat IA' },
    { name: 'Coach IA', color: '#E5E7EB', label: 'gris perle', feature: 'Chat IA' },
    { name: 'Musique Générer', color: '#6366F1', label: 'violet', feature: 'Musique' }
  ];

  const handleThemeChange = (themeId: string) => {
    setThemePreference(themeId as 'light' | 'dark' | 'pastel');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Thèmes EmotionsCare</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themePalettes.map((theme) => (
              <Card key={theme.id} className="overflow-hidden">
                <div 
                  className="h-20" 
                  style={{ backgroundColor: theme.primary }}
                />
                <CardHeader className="pb-2">
                  <CardTitle>{theme.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                  <div className="grid grid-cols-5 gap-2">
                    <ColorSwatch color={theme.primary} name="Primary" />
                    <ColorSwatch color={theme.background} name="Background" border />
                    <ColorSwatch color={theme.card} name="Card" border />
                    <ColorSwatch color={theme.muted} name="Muted" />
                    <ColorSwatch color={theme.border} name="Border" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleThemeChange(theme.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    Appliquer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Couleurs par fonctionnalité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featureColors.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div 
                      className="h-16 rounded-md flex items-center justify-center text-white" 
                      style={{ backgroundColor: item.color }}
                    >
                      {item.feature}
                    </div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.color} ({item.label})</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du thème actuel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Éléments d'interface</h3>
                  <div className="space-y-2">
                    <Button variant="default">Bouton primaire</Button>
                    <Button variant="secondary" className="ml-2">Secondaire</Button>
                    <Button variant="outline" className="ml-2">Outline</Button>
                  </div>
                  <div className="p-4 rounded-md bg-muted">
                    Zone avec fond neutre
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Couleurs actuelles</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <ColorSwatch color={colors.background} name="Background" border />
                    <ColorSwatch color={colors.foreground} name="Text" />
                    <ColorSwatch color={colors.primary} name="Primary" />
                    <ColorSwatch color={colors.secondary} name="Secondary" />
                    <ColorSwatch color={colors.card} name="Card" border />
                    <ColorSwatch color={colors.border} name="Border" />
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

// Helper component for color swatches
const ColorSwatch = ({ color, name, border = false }: { color: string; name: string; border?: boolean }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`h-8 w-8 rounded-full ${border ? 'border border-gray-200' : ''}`}
        style={{ backgroundColor: color }}
      />
      <span className="text-xs mt-1">{name}</span>
    </div>
  );
};

export default ThemeColorExample;
