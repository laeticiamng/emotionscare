
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdminSettingsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Gestion des rôles</CardTitle>
          <CardDescription>Administrer les utilisateurs et leurs accès</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Marie Dupont</h4>
                <p className="text-sm text-muted-foreground">RH - marie.dupont@example.com</p>
              </div>
              <Button variant="outline" size="sm">Modifier rôle</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Pierre Martin</h4>
                <p className="text-sm text-muted-foreground">Direction - pierre.martin@example.com</p>
              </div>
              <Button variant="outline" size="sm">Modifier rôle</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Sophie Bernard</h4>
                <p className="text-sm text-muted-foreground">Utilisateur - sophie.bernard@example.com</p>
              </div>
              <Button variant="outline" size="sm">Modifier rôle</Button>
            </div>
          </div>
          
          <div className="mt-6">
            <Button className="w-full">
              Gérer tous les utilisateurs
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Configuration des seuils d'alerte</CardTitle>
          <CardDescription>Paramétrer les notifications et alertes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Seuil d'alerte score émotionnel</Label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="65" 
                  className="w-full"
                />
                <span className="ml-2 font-medium">65/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Une alerte sera générée si un score descend en dessous de cette valeur</p>
            </div>
            
            <div>
              <Label className="mb-2 block">Seuil d'alerte absentéisme</Label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  defaultValue="7" 
                  className="w-full"
                />
                <span className="ml-2 font-medium">7%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Une alerte sera générée si l'absentéisme dépasse ce taux</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="alert-email" />
              <Label htmlFor="alert-email">Recevoir les alertes par email</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="alert-notification" defaultChecked />
              <Label htmlFor="alert-notification">Recevoir les alertes dans l'application</Label>
            </div>
            
            <Button className="w-full">
              Enregistrer les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Workflows automatisés</CardTitle>
          <CardDescription>Configurer des actions automatiques basées sur des déclencheurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Check-in hebdomadaire</h3>
                  <p className="text-sm text-muted-foreground">Envoie automatiquement une demande de check-in tous les lundis</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Déclencheur</Label>
                  <div className="bg-gray-50 p-2 rounded mt-1">Chaque lundi à 9h</div>
                </div>
                <div>
                  <Label className="text-xs">Action</Label>
                  <div className="bg-gray-50 p-2 rounded mt-1">Email + notification app</div>
                </div>
                <div>
                  <Label className="text-xs">Cible</Label>
                  <div className="bg-gray-50 p-2 rounded mt-1">Tous les utilisateurs</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Alerte score émotionnel critique</h3>
                  <p className="text-sm text-muted-foreground">Notifie les managers si le score moyen descend sous le seuil</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Déclencheur</Label>
                  <div className="bg-gray-50 p-2 rounded mt-1">Score &lt; 65 pendant 3 jours</div>
                </div>
                <div>
                  <Label className="text-xs">Action</Label>
                  <div className="bg-gray-50 p-2 rounded mt-1">Alerte RH + suggestion</div>
                </div>
                <div>
                  <Label className="text-xs">Cible</Label>
                  <div className="bg-gray-50 p-2 rounded mt-1">Managers concernés</div>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4">
              Créer un nouveau workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
