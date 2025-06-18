import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Users, Trophy, Star } from 'lucide-react';

const B2BAdminBadgeManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Badges</h1>
        <p className="text-muted-foreground">
          Configuration et attribution des badges de réussite
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges distribués</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs récompensés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges disponibles</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Types de badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32%</div>
            <p className="text-xs text-muted-foreground">Augmentation motivation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Badges populaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Premier scan</p>
                    <p className="text-xs text-muted-foreground">89 débloqués</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Série de 7 jours</p>
                    <p className="text-xs text-muted-foreground">45 débloqués</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Maître de la respiration</p>
                    <p className="text-xs text-muted-foreground">23 débloqués</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
            </div>
            <Button className="w-full">Créer nouveau badge</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critères d'attribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau de difficulté</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Facile</Button>
                  <Button variant="default" size="sm">Moyen</Button>
                  <Button variant="outline" size="sm">Difficile</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégories</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="participation" defaultChecked />
                    <label htmlFor="participation" className="text-sm">Participation</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="consistency" defaultChecked />
                    <label htmlFor="consistency" className="text-sm">Régularité</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="improvement" />
                    <label htmlFor="improvement" className="text-sm">Amélioration</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="milestone" />
                    <label htmlFor="milestone" className="text-sm">Étapes clés</label>
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

export default B2BAdminBadgeManagement;