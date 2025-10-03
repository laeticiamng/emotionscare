
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

interface AdminSettingsTabProps {
  isLoading?: boolean;
}

const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres Administrateur</CardTitle>
        <CardDescription>Configurez les paramètres de l'application pour tous les utilisateurs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="display">Affichage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Nom de l'entreprise</h3>
                <input type="text" className="w-full p-2 border rounded" defaultValue="EmotionsCare SAS" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Langue par défaut</h3>
                <select className="w-full p-2 border rounded">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Fuseau horaire</h3>
                <select className="w-full p-2 border rounded">
                  <option value="europe-paris">Europe/Paris (UTC+1)</option>
                  <option value="europe-london">Europe/London (UTC+0)</option>
                  <option value="america-new_york">America/New_York (UTC-5)</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Notifications par défaut</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Notifications quotidiennes</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Alertes de bien-être</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Annonces système</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Sécurité du compte</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Authentification à deux facteurs</label>
                    <input type="checkbox" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Expiration du mot de passe (90 jours)</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Politique de mot de passe</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Longueur minimale (8 caractères)</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Exiger des caractères spéciaux</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="display">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Thème par défaut</h3>
                <select className="w-full p-2 border rounded">
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Couleur d'accentuation</h3>
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-blue-500 rounded cursor-pointer"></div>
                  <div className="w-10 h-10 bg-green-500 rounded cursor-pointer"></div>
                  <div className="w-10 h-10 bg-purple-500 rounded cursor-pointer"></div>
                  <div className="w-10 h-10 bg-amber-500 rounded cursor-pointer"></div>
                  <div className="w-10 h-10 bg-pink-500 rounded cursor-pointer"></div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSettingsTab;
