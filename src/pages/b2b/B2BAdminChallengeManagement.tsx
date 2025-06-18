import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Users, Calendar, Zap } from 'lucide-react';

const B2BAdminChallengeManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Défis</h1>
        <p className="text-muted-foreground">
          Création et suivi des défis de bien-être pour votre organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Défis actifs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">Sur 120 employés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">Défis terminés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+45%</div>
            <p className="text-xs text-muted-foreground">Augmentation activité</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Défis en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">21 jours de méditation</p>
                  <p className="text-xs text-muted-foreground">35 participants • 12 jours restants</p>
                  <div className="w-full bg-muted h-2 rounded mt-2">
                    <div className="bg-green-500 h-2 rounded" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Défi 10 000 pas</p>
                  <p className="text-xs text-muted-foreground">22 participants • 5 jours restants</p>
                  <div className="w-full bg-muted h-2 rounded mt-2">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Semaine sans stress</p>
                  <p className="text-xs text-muted-foreground">28 participants • 3 jours restants</p>
                  <div className="w-full bg-muted h-2 rounded mt-2">
                    <div className="bg-purple-500 h-2 rounded" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
            </div>
            <Button className="w-full">Créer nouveau défi</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types de défis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégories populaires</label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Exercice physique</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Méditation</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Nutrition</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sommeil</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Durée recommandée</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">7 jours</Button>
                  <Button variant="default" size="sm">14 jours</Button>
                  <Button variant="outline" size="sm">21 jours</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminChallengeManagement;