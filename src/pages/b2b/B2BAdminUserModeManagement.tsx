import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, ToggleLeft, Shield } from 'lucide-react';

const B2BAdminUserModeManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Modes Utilisateur</h1>
        <p className="text-muted-foreground">
          Configuration des modes d'accès et des permissions utilisateur
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modes disponibles</CardTitle>
            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">B2C, B2B User, Admin, Super Admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs B2B</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Accès administrateur</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions actives</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Règles configurées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Modes utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Mode B2C</p>
                  <p className="text-xs text-muted-foreground">Accès individuel complet</p>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs text-green-600">Actif</span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Mode B2B Utilisateur</p>
                  <p className="text-xs text-muted-foreground">Accès entreprise standard</p>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs text-green-600">Actif</span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Mode B2B Admin</p>
                  <p className="text-xs text-muted-foreground">Gestion équipe et rapports</p>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs text-green-600">Actif</span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Mode Super Admin</p>
                  <p className="text-xs text-muted-foreground">Accès complet système</p>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs text-yellow-600">Restreint</span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
            </div>
            <Button className="w-full">Créer mode personnalisé</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions par mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">B2B Utilisateur</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="scan_user" defaultChecked />
                    <label htmlFor="scan_user" className="text-sm">Scans émotionnels</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="journal_user" defaultChecked />
                    <label htmlFor="journal_user" className="text-sm">Journal personnel</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="community_user" defaultChecked />
                    <label htmlFor="community_user" className="text-sm">Participation communauté</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reports_user" />
                    <label htmlFor="reports_user" className="text-sm">Rapports personnels</label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">B2B Admin</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="user_mgmt" defaultChecked />
                    <label htmlFor="user_mgmt" className="text-sm">Gestion utilisateurs</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="analytics" defaultChecked />
                    <label htmlFor="analytics" className="text-sm">Analytics équipe</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reports_admin" defaultChecked />
                    <label htmlFor="reports_admin" className="text-sm">Rapports globaux</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="config" />
                    <label htmlFor="config" className="text-sm">Configuration système</label>
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

export default B2BAdminUserModeManagement;