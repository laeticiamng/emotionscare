
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Star } from 'lucide-react';

const AmbitionArcadePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ambition Arcade</h1>
          <p className="text-muted-foreground">Transformez vos objectifs en jeux captivants</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Quête Active
              </CardTitle>
              <CardDescription>Objectif professionnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Présentation Client</span>
                <Badge variant="secondary">En cours</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP gagnés</span>
                  <span>750/1000</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <Button size="sm" className="w-full">Continuer la quête</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Trophées
              </CardTitle>
              <CardDescription>Vos réussites débloquées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium">Premier Sprint</p>
                    <p className="text-xs text-muted-foreground">Objectif complété en 3 jours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-silver" />
                  <div>
                    <p className="font-medium">Persévérant</p>
                    <p className="text-xs text-muted-foreground">7 jours consécutifs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Boss Final</CardTitle>
              <CardDescription>Votre grand défi</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-medium">Promotion Annuelle</p>
                <p className="text-sm text-muted-foreground">Défi ultime de carrière</p>
              </div>
              <Button size="sm" variant="destructive">Affronter le Boss</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AmbitionArcadePage;
