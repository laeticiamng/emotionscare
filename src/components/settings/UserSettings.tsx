
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettingsTab from '@/components/admin/settings/ThemeSettingsTab';
import { Card } from '@/components/ui/card';

const UserSettings: React.FC = () => {
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
          
          <TabsContent value="appearance" className="p-4">
            <ThemeSettingsTab />
          </TabsContent>
          
          <TabsContent value="account" className="p-4">
            <div className="text-center p-6">
              <h3 className="text-xl mb-2">Paramètres du compte</h3>
              <p className="text-muted-foreground">
                Modifier votre profil, votre mot de passe et vos informations personnelles
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-4">
            <div className="text-center p-6">
              <h3 className="text-xl mb-2">Préférences de notification</h3>
              <p className="text-muted-foreground">
                Gérer les types de notifications que vous recevez et leur fréquence
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="p-4">
            <div className="text-center p-6">
              <h3 className="text-xl mb-2">Confidentialité et données</h3>
              <p className="text-muted-foreground">
                Gérer vos données personnelles et les paramètres de confidentialité
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserSettings;
