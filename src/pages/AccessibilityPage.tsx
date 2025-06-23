
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Eye, EyeOff, Volume2, VolumeX, Keyboard, MousePointer, Palette, Type, Settings, Shield, Heart } from 'lucide-react';

const AccessibilityPage: React.FC = () => {
  const { settings, updateSettings, isAccessibilityEnabled, toggleAccessibility, announceToScreenReader } = useAccessibility();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    announceToScreenReader(`Paramètre ${key} modifié`);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accessibilité & Inclusion</h1>
          <p className="text-muted-foreground mt-2">
            Personnalisez votre expérience pour une meilleure accessibilité
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isAccessibilityEnabled ? "default" : "secondary"}>
            {isAccessibilityEnabled ? "Activé" : "Désactivé"}
          </Badge>
          <Button onClick={toggleAccessibility} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {isAccessibilityEnabled ? "Désactiver" : "Activer"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visual" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Visuel</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Audio</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center space-x-2">
            <Keyboard className="h-4 w-4" />
            <span>Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="cognitive" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Cognitif</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Paramètres Visuels</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Contraste élevé</label>
                  <p className="text-sm text-muted-foreground">
                    Améliore la lisibilité avec des couleurs contrastées
                  </p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Taille de police</label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) => handleSettingChange('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Normale</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                    <SelectItem value="extra-large">Très grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="font-medium">Support daltonisme</label>
                <Select
                  value={settings.colorBlindness}
                  onValueChange={(value) => handleSettingChange('colorBlindness', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="protanopia">Protanopie (rouge)</SelectItem>
                    <SelectItem value="deuteranopia">Deutéranopie (vert)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopie (bleu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Focus visible</label>
                  <p className="text-sm text-muted-foreground">
                    Met en évidence l'élément sélectionné
                  </p>
                </div>
                <Switch
                  checked={settings.focusVisible}
                  onCheckedChange={(checked) => handleSettingChange('focusVisible', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5" />
                <span>Paramètres Audio</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Lecteur d'écran</label>
                  <p className="text-sm text-muted-foreground">
                    Active les annonces vocales pour la navigation
                  </p>
                </div>
                <Switch
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Descriptions audio</label>
                  <p className="text-sm text-muted-foreground">
                    Descriptions vocales des éléments visuels
                  </p>
                </div>
                <Switch
                  checked={settings.audioDescriptions}
                  onCheckedChange={(checked) => handleSettingChange('audioDescriptions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Sous-titres</label>
                  <p className="text-sm text-muted-foreground">
                    Active les sous-titres pour le contenu multimédia
                  </p>
                </div>
                <Switch
                  checked={settings.captionsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('captionsEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Keyboard className="h-5 w-5" />
                <span>Paramètres de Navigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Navigation clavier</label>
                  <p className="text-sm text-muted-foreground">
                    Permet la navigation complète au clavier
                  </p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Mouvement réduit</label>
                  <p className="text-sm text-muted-foreground">
                    Réduit les animations et transitions
                  </p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Raccourcis clavier</h4>
                <div className="space-y-1 text-sm">
                  <div><kbd className="px-2 py-1 bg-background rounded">Tab</kbd> Navigation vers l'avant</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Shift + Tab</kbd> Navigation vers l'arrière</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Enter</kbd> Activer un élément</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Espace</kbd> Cocher/décocher</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Esc</kbd> Fermer/annuler</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Support Cognitif</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Interface simplifiée
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Réduit la complexité visuelle pour faciliter la compréhension
                </p>
                <Button variant="outline" size="sm">
                  Activer le mode simplifié
                </Button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-medium mb-2">Assistance contextuelle</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Aide et conseils personnalisés selon le contexte
                </p>
                <Button variant="outline" size="sm">
                  Configurer l'assistance
                </Button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h4 className="font-medium mb-2">Temps de lecture adapté</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajuste automatiquement les timeouts et notifications
                </p>
                <Button variant="outline" size="sm">
                  Personnaliser les délais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Certification Accessibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Cette interface respecte les standards WCAG 2.1 niveau AA pour garantir 
                une accessibilité optimale à tous les utilisateurs.
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              WCAG 2.1 AA
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPage;
