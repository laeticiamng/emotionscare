
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Theme, FontFamily, FontSize } from '@/types/theme';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon, Laptop, Paintbrush } from 'lucide-react';

interface ThemeSettingsTabProps {
  onSave?: () => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({ onSave }) => {
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  const [primaryColor, setPrimaryColor] = useState<string>('#3651ff');
  const [secondaryColor, setSecondaryColor] = useState<string>('#7B61FF');
  const [activePreview, setActivePreview] = useState<'light' | 'dark' | 'pastel'>('light');
  
  const handleThemeChange = (value: Theme) => {
    if (setTheme) {
      setTheme(value);
    }
  };
  
  const handleFontFamilyChange = (value: FontFamily) => {
    if (setFontFamily) {
      setFontFamily(value);
    }
  };
  
  const handleFontSizeChange = (value: FontSize) => {
    if (setFontSize) {
      setFontSize(value);
    }
  };
  
  const handleSaveChanges = () => {
    // Save changes to localStorage or API
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres d'apparence</h2>
        <p className="text-muted-foreground">
          Personnalisez l'apparence visuelle de votre interface EmotionsCare.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Mode d'affichage</h3>
            <p className="text-sm text-muted-foreground">
              Choisissez le thème que vous souhaitez utiliser.
            </p>
            
            <RadioGroup 
              defaultValue={theme} 
              className="grid grid-cols-4 gap-4 pt-2"
              onValueChange={(value) => handleThemeChange(value as Theme)}
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="theme-light" 
                  className="sr-only" 
                  checked={theme === 'light'}
                />
                <Label
                  htmlFor="theme-light"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                    ${theme === 'light' ? 'border-primary' : ''}
                  `}
                >
                  <Sun className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Clair</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="theme-dark" 
                  className="sr-only" 
                  checked={theme === 'dark'}
                />
                <Label
                  htmlFor="theme-dark"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                    ${theme === 'dark' ? 'border-primary' : ''}
                  `}
                >
                  <Moon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Sombre</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="system" 
                  id="theme-system" 
                  className="sr-only" 
                  checked={theme === 'system'}
                />
                <Label
                  htmlFor="theme-system"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                    ${theme === 'system' ? 'border-primary' : ''}
                  `}
                >
                  <Laptop className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Système</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="pastel" 
                  id="theme-pastel" 
                  className="sr-only" 
                  checked={theme === 'pastel'}
                />
                <Label
                  htmlFor="theme-pastel"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                    ${theme === 'pastel' ? 'border-primary' : ''}
                  `}
                >
                  <Paintbrush className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Bleu pastel</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Typographie</h3>
            <p className="text-sm text-muted-foreground">
              Choisissez la police et la taille de texte qui vous conviennent.
            </p>
            
            <div className="grid gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="font-family">Police de caractères</Label>
                <Select 
                  value={fontFamily || 'sans'} 
                  onValueChange={(value) => handleFontFamilyChange(value as FontFamily)}
                >
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Sélectionner une police" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans">Sans serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                    <SelectItem value="rounded">Arrondie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Taille de texte</Label>
                <Select 
                  value={fontSize || 'medium'} 
                  onValueChange={(value) => handleFontSizeChange(value as FontSize)}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Sélectionner une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                    <SelectItem value="xl">Très grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Couleurs personnalisées</h3>
            <p className="text-sm text-muted-foreground">
              Personnalisez les couleurs principales de l'application.
            </p>
            
            <div className="grid gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 p-0.5 rounded-md cursor-pointer"
                  />
                  <Input 
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent-color">Couleur secondaire</Label>
                <div className="flex gap-2">
                  <Input 
                    id="accent-color"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 p-0.5 rounded-md cursor-pointer"
                  />
                  <Input 
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Aperçu</h3>
          <Tabs value={activePreview} onValueChange={(v) => setActivePreview(v as 'light' | 'dark' | 'pastel')}>
            <TabsList className="mb-4">
              <TabsTrigger value="light">Clair</TabsTrigger>
              <TabsTrigger value="dark">Sombre</TabsTrigger>
              <TabsTrigger value="pastel">Bleu pastel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="light">
              <Card className={`border shadow-lg ${fontSize === 'small' || fontSize === 'sm' ? 'text-sm' : fontSize === 'large' || fontSize === 'lg' || fontSize === 'xl' ? 'text-lg' : 'text-base'}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">Aperçu du thème clair</h4>
                    <p>Voici à quoi ressemble votre interface en mode clair. Les textes et boutons s'adaptent à vos préférences.</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      style={{backgroundColor: primaryColor}}
                    >
                      Bouton principal
                    </Button>
                    <Button variant="outline">Bouton secondaire</Button>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-100">
                    <div className="font-bold mb-2">Carte exemple</div>
                    <p className="text-gray-600">Le contenu s'adapte aux préférences de police et de taille.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dark">
              <Card className={`border bg-gray-900 text-white shadow-lg ${fontSize === 'small' || fontSize === 'sm' ? 'text-sm' : fontSize === 'large' || fontSize === 'lg' || fontSize === 'xl' ? 'text-lg' : 'text-base'}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">Aperçu du thème sombre</h4>
                    <p className="text-gray-300">Voici à quoi ressemble votre interface en mode sombre. Les textes et boutons s'adaptent à vos préférences.</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      style={{backgroundColor: primaryColor}}
                    >
                      Bouton principal
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-white">Bouton secondaire</Button>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-800">
                    <div className="font-bold mb-2">Carte exemple</div>
                    <p className="text-gray-400">Le contenu s'adapte aux préférences de police et de taille.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pastel">
              <Card className={`border bg-blue-50 shadow-lg ${fontSize === 'small' || fontSize === 'sm' ? 'text-sm' : fontSize === 'large' || fontSize === 'lg' || fontSize === 'xl' ? 'text-lg' : 'text-base'}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-blue-800">Aperçu du thème bleu pastel</h4>
                    <p className="text-blue-700">Voici à quoi ressemble votre interface en mode bleu pastel. Les textes et boutons s'adaptent à vos préférences.</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      style={{backgroundColor: primaryColor}}
                    >
                      Bouton principal
                    </Button>
                    <Button variant="outline" className="border-blue-300 text-blue-700">Bouton secondaire</Button>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/70 backdrop-blur-sm">
                    <div className="font-bold mb-2 text-blue-800">Carte exemple</div>
                    <p className="text-blue-600">Le contenu s'adapte aux préférences de police et de taille.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button 
            className="w-full mt-4"
            onClick={handleSaveChanges}
          >
            Enregistrer les changements
          </Button>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Note: Certains changements peuvent nécessiter un rafraîchissement de la page pour être complètement appliqués.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsTab;
