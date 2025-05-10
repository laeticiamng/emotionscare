
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge"; // Added this import
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Lock, 
  FileWarning, 
  HeartHandshake,
  Database,
  FileDigit,
  UserX,
  RefreshCw,
  BarChart
} from 'lucide-react';

const PrivacySettings: React.FC = () => {
  const { toast } = useToast();
  const [dataCollection, setDataCollection] = useState(true);
  const [anonymizeData, setAnonymizeData] = useState(true);
  const [emotionalCamouflage, setEmotionalCamouflage] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [journalLock, setJournalLock] = useState(false);
  const [usageAnalytics, setUsageAnalytics] = useState(true);
  const [differentialPrivacy, setDifferentialPrivacy] = useState(true);
  const [autoDelete, setAutoDelete] = useState(false);
  const [dataPortability, setDataPortability] = useState(false);
  const [dataPurgeInterval, setDataPurgeInterval] = useState('never');

  const handleSave = () => {
    toast({
      title: "Paramètres de confidentialité enregistrés",
      description: "Vos préférences de confidentialité ont été mises à jour."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Confidentialité et sécurité
        </CardTitle>
        <CardDescription>
          Contrôlez comment vos données sont utilisées et protégées.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/20 p-4 rounded-lg flex items-start gap-3">
          <HeartHandshake className="h-10 w-10 text-primary/80 mt-1" />
          <div>
            <h3 className="font-medium mb-1">Notre engagement</h3>
            <p className="text-sm text-muted-foreground">
              EmotionsCare s'engage à protéger vos données émotionnelles avec les plus hauts standards 
              de sécurité et de confidentialité. Vos données vous appartiennent et vous en gardez 
              le contrôle total.
            </p>
          </div>
        </div>

        {/* Collecte de données */}
        <div className="space-y-4">
          <h3 className="font-medium">Collecte de données</h3>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="data-collection" className="flex-1">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>Collecte de données émotionnelles</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Permet d'améliorer les recommandations personnalisées
              </div>
            </Label>
            <Switch
              id="data-collection"
              checked={dataCollection}
              onCheckedChange={setDataCollection}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="anonymize-data" className="flex-1">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>Anonymisation des données</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Toutes les données partagées sont anonymisées
              </div>
            </Label>
            <Switch
              id="anonymize-data"
              checked={anonymizeData}
              onCheckedChange={setAnonymizeData}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="differential-privacy" className="flex-1">
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span>Confidentialité différentielle</span>
                <Badge className="bg-primary/20 text-primary text-xs">Premium</Badge>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Protection avancée avec ajout de bruit statistique aux données agrégées
              </div>
            </Label>
            <Switch
              id="differential-privacy"
              checked={differentialPrivacy}
              onCheckedChange={setDifferentialPrivacy}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="usage-analytics" className="flex-1">
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-muted-foreground" />
                <span>Statistiques d'utilisation</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Aide à améliorer l'application sans collecter de données personnelles
              </div>
            </Label>
            <Switch
              id="usage-analytics"
              checked={usageAnalytics}
              onCheckedChange={setUsageAnalytics}
            />
          </div>
        </div>

        {/* Niveau de confidentialité */}
        <div className="space-y-3">
          <h3 className="font-medium">Niveau de confidentialité global</h3>
          <RadioGroup 
            value={privacyLevel} 
            onValueChange={(val) => setPrivacyLevel(val as 'low' | 'medium' | 'high')}
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="low" id="privacy-low" />
              <Label htmlFor="privacy-low" className="cursor-pointer">Basique</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="medium" id="privacy-medium" />
              <Label htmlFor="privacy-medium" className="cursor-pointer">Équilibré</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="high" id="privacy-high" />
              <Label htmlFor="privacy-high" className="cursor-pointer">Maximum</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            Le niveau "Maximum" peut limiter certaines fonctionnalités de personnalisation.
          </p>
        </div>

        {/* Fonctionnalités avancées */}
        <div className="space-y-4">
          <h3 className="font-medium">Protection avancée</h3>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="emotional-camouflage" className="flex-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Camouflage émotionnel</span>
                <Badge className="bg-primary/20 text-primary text-xs">Premium</Badge>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Masque intelligemment certains détails émotionnels sensibles
              </div>
            </Label>
            <Switch
              id="emotional-camouflage"
              checked={emotionalCamouflage}
              onCheckedChange={setEmotionalCamouflage}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="journal-lock" className="flex-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Verrouillage du journal</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Protection supplémentaire pour vos journaux émotionnels sensibles
              </div>
            </Label>
            <Switch
              id="journal-lock"
              checked={journalLock}
              onCheckedChange={setJournalLock}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="data-portability" className="flex-1">
              <div className="flex items-center gap-2">
                <FileDigit className="h-4 w-4 text-muted-foreground" />
                <span>Portabilité des données (RGPD)</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Génération de rapports structurés pour transfert vers d'autres services
              </div>
            </Label>
            <Switch
              id="data-portability"
              checked={dataPortability}
              onCheckedChange={setDataPortability}
            />
          </div>
        </div>

        {/* Suppression automatique des données */}
        <div className="space-y-4">
          <h3 className="font-medium">Cycle de vie des données</h3>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="auto-delete" className="flex-1">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span>Suppression automatique</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Suppression périodique des données selon l'intervalle choisi
              </div>
            </Label>
            <Switch
              id="auto-delete"
              checked={autoDelete}
              onCheckedChange={setAutoDelete}
            />
          </div>

          {autoDelete && (
            <div className="pl-6">
              <Select 
                value={dataPurgeInterval} 
                onValueChange={setDataPurgeInterval}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Intervalle de suppression" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Après 30 jours</SelectItem>
                  <SelectItem value="90days">Après 90 jours</SelectItem>
                  <SelectItem value="1year">Après 1 an</SelectItem>
                  <SelectItem value="never">Jamais (conserver)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Les données plus anciennes que cette période seront automatiquement effacées
              </p>
            </div>
          )}
        </div>

        {/* Options d'exportation et de suppression */}
        <div className="space-y-4 pt-2">
          <h3 className="font-medium">Exportation et suppression</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter mes données
            </Button>
            <Button variant="destructive" className="w-full flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimer mes données
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            La suppression des données est irréversible et entraînera la perte de tout l'historique émotionnel.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
