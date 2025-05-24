
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Edit } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Profil - EmotionsCare</title>
        <meta name="description" content="Gérez votre profil EmotionsCare" />
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <p className="text-gray-600">Non défini</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-gray-600">Non défini</p>
              </div>
              <Button className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifier le profil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
