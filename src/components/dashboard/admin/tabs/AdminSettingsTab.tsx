// @ts-nocheck

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
                <label htmlFor="company-name" className="text-lg font-medium mb-2 block">Nom de l'entreprise</label>
                <input id="company-name" type="text" className="w-full p-2 border rounded" defaultValue="EmotionsCare SAS" aria-label="Nom de l'entreprise" />
              </div>
              
              <div>
                <label htmlFor="default-language" className="text-lg font-medium mb-2 block">Langue par défaut</label>
                <select id="default-language" className="w-full p-2 border rounded" aria-label="Langue par défaut">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timezone" className="text-lg font-medium mb-2 block">Fuseau horaire</label>
                <select id="timezone" className="w-full p-2 border rounded" aria-label="Fuseau horaire">
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
                    <label htmlFor="daily-notifs" className="text-sm">Notifications quotidiennes</label>
                    <input id="daily-notifs" type="checkbox" defaultChecked aria-label="Notifications quotidiennes" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="wellness-alerts" className="text-sm">Alertes de bien-être</label>
                    <input id="wellness-alerts" type="checkbox" defaultChecked aria-label="Alertes de bien-être" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="system-announcements" className="text-sm">Annonces système</label>
                    <input id="system-announcements" type="checkbox" defaultChecked aria-label="Annonces système" />
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
                    <label htmlFor="two-factor" className="text-sm">Authentification à deux facteurs</label>
                    <input id="two-factor" type="checkbox" aria-label="Authentification à deux facteurs" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password-expiry" className="text-sm">Expiration du mot de passe (90 jours)</label>
                    <input id="password-expiry" type="checkbox" defaultChecked aria-label="Expiration du mot de passe" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Politique de mot de passe</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="min-length" className="text-sm">Longueur minimale (8 caractères)</label>
                    <input id="min-length" type="checkbox" defaultChecked aria-label="Longueur minimale" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="special-chars" className="text-sm">Exiger des caractères spéciaux</label>
                    <input id="special-chars" type="checkbox" defaultChecked aria-label="Exiger des caractères spéciaux" />
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
