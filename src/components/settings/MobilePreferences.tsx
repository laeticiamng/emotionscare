// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Smartphone, 
  QrCode, 
  FileDown, 
  RefreshCw, 
  Wifi, 
  BatteryMedium,
  CloudOff 
} from 'lucide-react';

const MobilePreferences: React.FC = () => {
  const { toast } = useToast();
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [batteryOptimization, setBatteryOptimization] = useState(true);
  const [dataUsage, setDataUsage] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSave = () => {
    toast({
      title: "Préférences mobiles enregistrées",
      description: "Vos paramètres mobiles ont été mis à jour."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Optimisation Mobile
        </CardTitle>
        <CardDescription>
          Configurez l'application pour une utilisation optimale sur appareils mobiles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/5 rounded-lg p-4 flex items-start">
          <QrCode className="h-10 w-10 text-primary mr-4" />
          <div>
            <h3 className="font-medium mb-2">Application mobile EmotionsCare</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Téléchargez notre application mobile pour accéder à toutes les fonctionnalités en déplacement.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2">
                <FileDown className="h-4 w-4" />
                App Store
              </Button>
              <Button className="gap-2">
                <FileDown className="h-4 w-4" />
                Google Play
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Synchronisation et données</h3>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="auto-sync" className="flex-1">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span>Synchronisation automatique</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Synchronise automatiquement vos données entre les appareils
              </div>
            </Label>
            <Switch
              id="auto-sync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="wifi-only" className="flex-1">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span>Synchroniser uniquement en Wi-Fi</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Économisez vos données cellulaires
              </div>
            </Label>
            <Switch
              id="wifi-only"
              checked={wifiOnly}
              onCheckedChange={setWifiOnly}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="offline-mode" className="flex-1">
              <div className="flex items-center gap-2">
                <CloudOff className="h-4 w-4 text-muted-foreground" />
                <span>Mode hors ligne</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Accédez à certaines fonctionnalités sans connexion internet
              </div>
            </Label>
            <Switch
              id="offline-mode"
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Performance</h3>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="battery-optimization" className="flex-1">
              <div className="flex items-center gap-2">
                <BatteryMedium className="h-4 w-4 text-muted-foreground" />
                <span>Optimisation de la batterie</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Réduit la consommation énergétique sur mobile
              </div>
            </Label>
            <Switch
              id="battery-optimization"
              checked={batteryOptimization}
              onCheckedChange={setBatteryOptimization}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="data-usage">Utilisation des données</Label>
            <Select 
              value={dataUsage} 
              onValueChange={(val) => setDataUsage(val as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger id="data-usage">
                <SelectValue placeholder="Sélectionner une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible - Économise les données</SelectItem>
                <SelectItem value="medium">Moyenne - Équilibré</SelectItem>
                <SelectItem value="high">Élevée - Meilleure qualité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Notification push</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notification-sound" className="text-sm">Son de notification</Label>
              <Select defaultValue="bell">
                <SelectTrigger id="notification-sound" className="mt-1.5">
                  <SelectValue placeholder="Choisir un son" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">Cloche douce</SelectItem>
                  <SelectItem value="chime">Carillon</SelectItem>
                  <SelectItem value="gentle">Notification discrète</SelectItem>
                  <SelectItem value="none">Aucun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vibration" className="text-sm">Vibration</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="vibration" className="mt-1.5">
                  <SelectValue placeholder="Intensité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Forte</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Légère</SelectItem>
                  <SelectItem value="none">Aucune</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobilePreferences;
