import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Users, Eye, Upload } from 'lucide-react';

const B2BAdminThemeManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Thèmes</h1>
        <p className="text-muted-foreground">
          Personnalisation de l'apparence de l'application pour votre organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thèmes disponibles</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Incluant personnalisés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">Appliqué à tous</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thème actif</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Corp</div>
            <p className="text-xs text-muted-foreground">Thème personnalisé</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnalisations</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Éléments modifiés</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thèmes prédéfinis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded border"></div>
                  <div>
                    <p className="font-medium text-sm">Professionnel Bleu</p>
                    <p className="text-xs text-muted-foreground">Thème corporate standard</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Appliquer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded border"></div>
                  <div>
                    <p className="font-medium text-sm">Bien-être Vert</p>
                    <p className="text-xs text-muted-foreground">Thème axé nature</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Appliquer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded border"></div>
                  <div>
                    <p className="font-medium text-sm">Innovation Violet</p>
                    <p className="text-xs text-muted-foreground">Thème créatif moderne</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Appliquer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded border"></div>
                  <div>
                    <p className="font-medium text-sm">Corp Personnalisé</p>
                    <p className="text-xs text-muted-foreground">Couleurs de l'entreprise</p>
                  </div>
                </div>
                <Button variant="default" size="sm">Actuel</Button>
              </div>
            </div>
            <Button className="w-full">Créer thème personnalisé</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personnalisation avancée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo de l'entreprise</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Télécharger</Button>
                  <Button variant="outline" size="sm">Prévisualiser</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleurs principales</label>
                <div className="flex space-x-2">
                  <input type="color" value="#3b82f6" className="w-10 h-8 rounded border" />
                  <input type="color" value="#8b5cf6" className="w-10 h-8 rounded border" />
                  <input type="color" value="#10b981" className="w-10 h-8 rounded border" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Police personnalisée</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Inter</Button>
                  <Button variant="default" size="sm">Roboto</Button>
                  <Button variant="outline" size="sm">Open Sans</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Éléments personnalisés</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="header" defaultChecked />
                    <label htmlFor="header" className="text-sm">En-tête personnalisé</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sidebar" defaultChecked />
                    <label htmlFor="sidebar" className="text-sm">Barre latérale</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="footer" />
                    <label htmlFor="footer" className="text-sm">Pied de page</label>
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

export default B2BAdminThemeManagement;