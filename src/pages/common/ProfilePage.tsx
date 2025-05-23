
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Settings } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom</label>
              <p className="text-lg">Utilisateur Demo</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg flex items-center gap-2">
                <Mail className="h-4 w-4" />
                demo@example.com
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Membre depuis</label>
              <p className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Janvier 2024
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Votre activité sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Sessions complétées</span>
              <span className="font-bold">24</span>
            </div>
            <div className="flex justify-between">
              <span>Jours consécutifs</span>
              <span className="font-bold">7</span>
            </div>
            <div className="flex justify-between">
              <span>Score de bien-être</span>
              <span className="font-bold text-green-600">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
