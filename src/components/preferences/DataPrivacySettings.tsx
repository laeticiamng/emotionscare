
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, FileLock, RotateCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const DataPrivacySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    incognitoMode: false,
    lockJournals: false,
    exportFormat: 'pdf',
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "Paramètres de confidentialité mis à jour",
      description: "Vos préférences de données ont été enregistrées."
    });
  };

  const handleDataExport = (format: string) => {
    toast({
      title: "Export des données initié",
      description: `Vos données sont en cours d'export au format ${format.toUpperCase()}.`
    });
    
    // Simulation d'un délai d'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `Vos données ont été exportées avec succès au format ${format.toUpperCase()}.`
      });
    }, 2000);
  };

  const handleResetData = () => {
    toast({
      title: "Réinitialisation des données",
      description: "Toutes vos données IA ont été réinitialisées."
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 bg-muted/50">
        <h3 className="font-medium mb-1">Résumé de vos données</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <div className="text-center p-3 bg-background rounded shadow-sm">
            <p className="text-2xl font-bold">16</p>
            <p className="text-xs text-muted-foreground">Entrées journal</p>
          </div>
          <div className="text-center p-3 bg-background rounded shadow-sm">
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">Émotions scannées</p>
          </div>
          <div className="text-center p-3 bg-background rounded shadow-sm">
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Sessions coach</p>
          </div>
          <div className="text-center p-3 bg-background rounded shadow-sm">
            <p className="text-2xl font-bold">3h</p>
            <p className="text-xs text-muted-foreground">Temps d'écoute</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium">Exporter mes données</h3>
        <p className="text-sm text-muted-foreground">
          Téléchargez toutes vos données dans le format de votre choix
        </p>
        <RadioGroup 
          value={settings.exportFormat}
          onValueChange={(value) => handleChange('exportFormat', value)}
          className="flex gap-2"
        >
          <div className="relative">
            <RadioGroupItem 
              value="pdf" 
              id="format-pdf" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="format-pdf" 
              className="px-3 py-1.5 border rounded-full peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer flex items-center justify-center"
            >
              PDF
            </Label>
          </div>
          <div className="relative">
            <RadioGroupItem 
              value="json" 
              id="format-json" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="format-json" 
              className="px-3 py-1.5 border rounded-full peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer flex items-center justify-center"
            >
              JSON
            </Label>
          </div>
        </RadioGroup>
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={() => handleDataExport(settings.exportFormat)}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter mes données
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <h3 className="font-medium">Mode incognito</h3>
            </div>
            <p className="text-xs text-muted-foreground">Aucune donnée stockée pendant la session</p>
          </div>
          <Switch 
            checked={settings.incognitoMode}
            onCheckedChange={(checked) => handleChange('incognitoMode', checked)}
          />
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <FileLock className="h-4 w-4" />
              <h3 className="font-medium">Verrouiller mes journaux</h3>
            </div>
            <p className="text-xs text-muted-foreground">Protection par code ou biométrie</p>
          </div>
          <Switch 
            checked={settings.lockJournals}
            onCheckedChange={(checked) => handleChange('lockJournals', checked)}
          />
        </div>
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <h3 className="font-medium">Réinitialiser mes données IA</h3>
        <p className="text-xs text-muted-foreground">
          Effacer toutes les données d'apprentissage de l'IA et repartir de zéro
        </p>
        <Button 
          variant="outline" 
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={handleResetData}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Réinitialiser l'IA
        </Button>
      </div>
      
      <Button onClick={saveSettings} className="w-full">
        Enregistrer les préférences
      </Button>
    </div>
  );
};

export default DataPrivacySettings;
