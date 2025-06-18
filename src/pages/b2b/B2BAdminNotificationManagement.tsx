import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Send, Users, Settings } from 'lucide-react';

const B2BAdminNotificationManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Notifications</h1>
        <p className="text-muted-foreground">
          Configuration et envoi de notifications pour votre organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyées aujourd'hui</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+18% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'ouverture</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs abonnés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications actives</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Campagnes en cours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Types de notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="wellness" defaultChecked />
                  <label htmlFor="wellness" className="text-sm">Rappels bien-être</label>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="emergency" defaultChecked />
                  <label htmlFor="emergency" className="text-sm">Alertes d'urgence</label>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="achievements" defaultChecked />
                  <label htmlFor="achievements" className="text-sm">Réussites et badges</label>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="team" />
                  <label htmlFor="team" className="text-sm">Actualités équipe</label>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
            </div>
            <Button className="w-full">Créer nouvelle campagne</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications programmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Rappel pause déjeuner</p>
                    <p className="text-xs text-muted-foreground">Tous les jours à 12h00</p>
                    <p className="text-xs text-muted-foreground">125 destinataires</p>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Exercice de respiration</p>
                    <p className="text-xs text-muted-foreground">Lun/Mer/Ven à 15h00</p>
                    <p className="text-xs text-muted-foreground">89 destinataires</p>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Bilan hebdomadaire</p>
                    <p className="text-xs text-muted-foreground">Vendredi à 17h00</p>
                    <p className="text-xs text-muted-foreground">120 destinataires</p>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminNotificationManagement;