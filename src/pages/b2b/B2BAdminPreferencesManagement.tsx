import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Palette, Shield } from 'lucide-react';

const B2BAdminPreferencesManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Préférences</h1>
        <p className="text-muted-foreground">
          Configuration des préférences globales de l'organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paramètres configurés</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Sur 25 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs impactés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">Tous les employés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thèmes personnalisés</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Thèmes actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sécurité</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AAA</div>
            <p className="text-xs text-muted-foreground">Niveau sécurité</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Préférences d'interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Thème par défaut</label>
                <div className="flex space-x-2">
                  <Button variant="default" size="sm">Clair</Button>
                  <Button variant="outline" size="sm">Sombre</Button>
                  <Button variant="outline" size="sm">Auto</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Langue</label>
                <div className="flex space-x-2">
                  <Button variant="default" size="sm">Français</Button>
                  <Button variant="outline" size="sm">Anglais</Button>
                  <Button variant="outline" size="sm">Espagnol</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Options d'accessibilité</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="contrast" defaultChecked />
                    <label htmlFor="contrast" className="text-sm">Contraste élevé</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="fontsize" />
                    <label htmlFor="fontsize" className="text-sm">Police agrandie</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="screenreader" />
                    <label htmlFor="screenreader" className="text-sm">Support lecteur d'écran</label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences de confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Collecte de données</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="analytics" defaultChecked />
                    <label htmlFor="analytics" className="text-sm">Analytiques d'usage</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="performance" defaultChecked />
                    <label htmlFor="performance" className="text-sm">Données de performance</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="personalization" />
                    <label htmlFor="personalization" className="text-sm">Personnalisation</label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rétention des données</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">30 jours</Button>
                  <Button variant="default" size="sm">90 jours</Button>
                  <Button variant="outline" size="sm">1 an</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Partage anonymisé</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="research" />
                    <label htmlFor="research" className="text-sm">Recherche scientifique</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="benchmarking" />
                    <label htmlFor="benchmarking" className="text-sm">Benchmarking sectoriel</label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminPreferencesManagement;