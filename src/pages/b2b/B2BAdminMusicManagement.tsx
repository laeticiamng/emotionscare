import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Users, Play, Headphones } from 'lucide-react';

const B2BAdminMusicManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion Musicothérapie</h1>
        <p className="text-muted-foreground">
          Configuration et suivi des sessions de musicothérapie
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions aujourd'hui</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+22% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12min</div>
            <p className="text-xs text-muted-foreground">Par session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playlists</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Playlists disponibles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Playlists thérapeutiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Relaxation profonde</p>
                  <p className="text-xs text-muted-foreground">12 pistes • 45min</p>
                </div>
                <Button variant="outline" size="sm">Écouter</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Concentration</p>
                  <p className="text-xs text-muted-foreground">18 pistes • 60min</p>
                </div>
                <Button variant="outline" size="sm">Écouter</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Motivation</p>
                  <p className="text-xs text-muted-foreground">15 pistes • 50min</p>
                </div>
                <Button variant="outline" size="sm">Écouter</Button>
              </div>
            </div>
            <Button className="w-full">Créer nouvelle playlist</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques d'usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Relaxation</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Concentration</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Motivation</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-purple-500 h-2 rounded" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminMusicManagement;