
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Theme, ThemeContextType, FontFamily, FontSize } from "@/types/theme";

const AVAILABLE_THEMES: Theme[] = [
  { id: "light", name: "Light", value: "light", preview: "/themes/light.png" },
  { id: "dark", name: "Dark", value: "dark", preview: "/themes/dark.png" },
  { id: "pastel", name: "Pastel", value: "pastel", preview: "/themes/pastel.png" },
  { id: "system", name: "System", value: "system", preview: "/themes/system.png" }
];

const ThemeSettingsTab: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme, isDarkMode, toggleTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system");
  const [selectedFont, setSelectedFont] = useState<FontFamily>(fontFamily || "system");
  const [selectedFontSize, setSelectedFontSize] = useState<FontSize>(fontSize || "medium");

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    setTheme(value);
    
    toast({
      title: "Thème modifié",
      description: `Le thème a été changé en ${value}.`,
    });
  };

  const handleFontChange = (value: FontFamily) => {
    setSelectedFont(value);
    if (setFontFamily) {
      setFontFamily(value);
    }
    
    toast({
      title: "Police modifiée",
      description: `La police a été changée en ${value}.`,
    });
  };

  const handleFontSizeChange = (value: FontSize) => {
    setSelectedFontSize(value);
    if (setFontSize) {
      setFontSize(value);
    }
    
    toast({
      title: "Taille de police modifiée",
      description: `La taille de police a été changée en ${value}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="theme">
        <TabsList>
          <TabsTrigger value="theme">Thème</TabsTrigger>
          <TabsTrigger value="typography">Typographie</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choisissez votre thème</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AVAILABLE_THEMES.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`border rounded-lg p-2 cursor-pointer transition-all ${
                    selectedTheme === themeOption.value
                      ? "border-primary ring-2 ring-primary ring-opacity-50"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleThemeChange(themeOption.value)}
                >
                  <div 
                    className="rounded-md bg-card aspect-video mb-2"
                    style={{ 
                      backgroundImage: themeOption.preview ? `url(${themeOption.preview})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                  <p className="text-center text-sm font-medium">{themeOption.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mode sombre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p>Activer le mode sombre</p>
                <Button variant={isDarkMode ? "default" : "outline"} onClick={toggleTheme}>
                  {isDarkMode ? "Activé" : "Désactivé"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Police</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedFont} 
                onValueChange={(value) => handleFontChange(value as FontFamily)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="font-system" />
                  <Label htmlFor="font-system" className="font-system text-lg">System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serif" id="font-serif" />
                  <Label htmlFor="font-serif" className="font-serif text-lg">Serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sans-serif" id="font-sans-serif" />
                  <Label htmlFor="font-sans-serif" className="font-sans-serif text-lg">Sans Serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monospace" id="font-monospace" />
                  <Label htmlFor="font-monospace" className="font-mono text-lg">Monospace</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Taille de police</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedFontSize} 
                onValueChange={(value) => handleFontSizeChange(value as FontSize)}
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="font-size-small" />
                    <Label htmlFor="font-size-small" className="text-sm">Petite</Label>
                  </div>
                  <span className="text-sm">Aa</span>
                </div>
                <div className="flex items-center justify-between border-b py-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="font-size-medium" />
                    <Label htmlFor="font-size-medium">Moyenne</Label>
                  </div>
                  <span>Aa</span>
                </div>
                <div className="flex items-center justify-between border-b py-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="font-size-large" />
                    <Label htmlFor="font-size-large" className="text-lg">Grande</Label>
                  </div>
                  <span className="text-lg">Aa</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="x-large" id="font-size-x-large" />
                    <Label htmlFor="font-size-x-large" className="text-xl">Très grande</Label>
                  </div>
                  <span className="text-xl">Aa</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Couleurs du thème</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Cette section sera disponible prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeSettingsTab;
