
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Monitor, PenTool, Type, TextCursorInput } from 'lucide-react';
import { useTheme } from '@/contexts/theme';
import { FontFamily, FontSize } from '@/types/theme';

interface PersonalizationSectionProps {
  onComplete: () => void;
  onBack: () => void;
}

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({ 
  onComplete,
  onBack
}) => {
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Personnalisation</h2>
        <p className="text-muted-foreground">
          Adaptez EmotionsCare à vos préférences visuelles
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Thème visuel</CardTitle>
          <CardDescription>Choisissez le thème qui vous convient le mieux</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system' | 'pastel')}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`h-24 w-full rounded-md border-2 ${theme === 'light' ? 'border-primary' : 'border-muted'} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white">
                  <div className="h-6 w-full bg-gray-100"></div>
                  <div className="p-2">
                    <div className="h-3 w-3/4 rounded bg-gray-200 mb-2"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm">
                  <Sun className="h-4 w-4 text-amber-500" />
                </div>
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
              </div>
              <Label htmlFor="theme-light">Clair</Label>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`h-24 w-full rounded-md border-2 ${theme === 'dark' ? 'border-primary' : 'border-muted'} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gray-900">
                  <div className="h-6 w-full bg-gray-800"></div>
                  <div className="p-2">
                    <div className="h-3 w-3/4 rounded bg-gray-700 mb-2"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-gray-800 rounded-full p-1 shadow-sm">
                  <Moon className="h-4 w-4 text-blue-400" />
                </div>
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
              </div>
              <Label htmlFor="theme-dark">Sombre</Label>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`h-24 w-full rounded-md border-2 ${theme === 'system' ? 'border-primary' : 'border-muted'} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-900">
                  <div className="h-6 w-full bg-gradient-to-r from-gray-100 to-gray-800"></div>
                  <div className="p-2">
                    <div className="h-3 w-3/4 rounded bg-gradient-to-r from-gray-200 to-gray-700 mb-2"></div>
                    <div className="h-3 w-1/2 rounded bg-gradient-to-r from-gray-200 to-gray-700"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-gradient-to-br from-white to-gray-800 rounded-full p-1 shadow-sm">
                  <Monitor className="h-4 w-4 text-blue-500" />
                </div>
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
              </div>
              <Label htmlFor="theme-system">Système</Label>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`h-24 w-full rounded-md border-2 ${theme === 'pastel' ? 'border-primary' : 'border-muted'} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-blue-50">
                  <div className="h-6 w-full bg-blue-100"></div>
                  <div className="p-2">
                    <div className="h-3 w-3/4 rounded bg-blue-100 mb-2"></div>
                    <div className="h-3 w-1/2 rounded bg-blue-100"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-blue-50 rounded-full p-1 shadow-sm">
                  <PenTool className="h-4 w-4 text-blue-500" />
                </div>
                <RadioGroupItem value="pastel" id="theme-pastel" className="sr-only" />
              </div>
              <Label htmlFor="theme-pastel">Pastel</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" /> Police
          </CardTitle>
          <CardDescription>Choisissez votre style de police préféré</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={fontFamily || "sans"}
            onValueChange={(value) => setFontFamily(value as FontFamily)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
              <div>
                <div className="font-sans text-lg mb-1">Sans-Serif</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Une police propre et moderne
                </div>
              </div>
              <RadioGroupItem value="sans" id="font-sans" />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
              <div>
                <div className="font-serif text-lg mb-1">Serif</div>
                <div className="text-sm text-muted-foreground font-serif">
                  Une police plus traditionnelle
                </div>
              </div>
              <RadioGroupItem value="serif" id="font-serif" />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
              <div>
                <div className="font-mono text-lg mb-1">Monospace</div>
                <div className="text-sm text-muted-foreground font-mono">
                  Caractères de largeur égale
                </div>
              </div>
              <RadioGroupItem value="mono" id="font-mono" />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
              <div>
                <div className="text-lg mb-1" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: '500'}}>Arrondie</div>
                <div className="text-sm text-muted-foreground" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'}}>
                  Police arrondie et accessible
                </div>
              </div>
              <RadioGroupItem value="rounded" id="font-rounded" />
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextCursorInput className="h-5 w-5" /> Taille du texte
          </CardTitle>
          <CardDescription>Ajustez la taille globale du texte</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={fontSize || "md"} 
            onValueChange={(value) => setFontSize(value as FontSize)}
            className="grid grid-cols-4 gap-3"
          >
            <div className="flex flex-col items-center space-y-1">
              <div className={`w-full h-16 flex items-center justify-center border rounded-md ${fontSize === 'sm' ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                <span className="text-sm">Aa</span>
              </div>
              <RadioGroupItem value="sm" id="size-sm" className="sr-only" />
              <Label htmlFor="size-sm" className="text-xs">Petite</Label>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <div className={`w-full h-16 flex items-center justify-center border rounded-md ${fontSize === 'md' ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                <span className="text-base">Aa</span>
              </div>
              <RadioGroupItem value="md" id="size-md" className="sr-only" />
              <Label htmlFor="size-md" className="text-xs">Moyenne</Label>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <div className={`w-full h-16 flex items-center justify-center border rounded-md ${fontSize === 'lg' ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                <span className="text-lg">Aa</span>
              </div>
              <RadioGroupItem value="lg" id="size-lg" className="sr-only" />
              <Label htmlFor="size-lg" className="text-xs">Grande</Label>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <div className={`w-full h-16 flex items-center justify-center border rounded-md ${fontSize === 'xl' ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                <span className="text-xl">Aa</span>
              </div>
              <RadioGroupItem value="xl" id="size-xl" className="sr-only" />
              <Label htmlFor="size-xl" className="text-xs">Très grande</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Retour
        </Button>
        <Button onClick={onComplete}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationSection;
