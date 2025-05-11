
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettingsTab from '@/components/admin/settings/ThemeSettingsTab';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import FontSettings from '@/components/settings/FontSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const UserSettings: React.FC = () => {
  const { toast } = useToast();
  const { theme, fontFamily, fontSize, setFontFamily, setFontSize } = useTheme() || {};

  const handleAccountSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos paramètres de compte ont été mis à jour avec succès.",
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos préférences de notification ont été enregistrées.",
    });
  };

  const handlePrivacySave = () => {
    toast({
      title: "Paramètres de confidentialité mis à jour",
      description: "Vos paramètres de confidentialité ont été enregistrés.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres utilisateur</h1>
      
      <Card className="p-1">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="p-4 space-y-6">
            <ThemeSettingsTab />
            {setFontFamily && setFontSize && (
              <FontSettings 
                currentFontFamily={fontFamily || 'inter'} 
                onChangeFontFamily={setFontFamily}
                currentFontSize={fontSize || 'medium'}
                onChangeFontSize={setFontSize}
              />
            )}
          </TabsContent>
          
          <TabsContent value="account" className="p-4">
            <div className="space-y-6">
              <h3 className="text-xl mb-4">Paramètres du compte</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <Input id="displayName" defaultValue="Utilisateur" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input id="email" type="email" defaultValue="utilisateur@exemple.com" />
                </div>
                
                <div className="space-y-2">
                  <Button onClick={handleAccountSave}>Enregistrer les modifications</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-4">
            <div className="space-y-6">
              <h3 className="text-xl mb-4">Préférences de notification</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par e-mail</p>
                    <p className="text-sm text-muted-foreground">Recevoir des mises à jour par e-mail</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications push</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mises à jour hebdomadaires</p>
                    <p className="text-sm text-muted-foreground">Recevoir un résumé hebdomadaire</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Button onClick={handleNotificationSave}>Enregistrer les préférences</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="p-4">
            <div className="space-y-6">
              <h3 className="text-xl mb-4">Confidentialité et données</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profil public</p>
                    <p className="text-sm text-muted-foreground">Rendre votre profil visible par les autres utilisateurs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collecte de données d'analyse</p>
                    <p className="text-sm text-muted-foreground">Nous aider à améliorer l'application avec des données anonymes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Historique des émotions</p>
                    <p className="text-sm text-muted-foreground">Conserver l'historique de vos analyses émotionnelles</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Button onClick={handlePrivacySave}>Enregistrer les paramètres</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserSettings;
