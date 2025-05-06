
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import PreferencesForm from '@/components/preferences/PreferencesForm';

const UserPreferences = () => {
  return (
    <div className="container max-w-4xl py-10">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-2xl heading-elegant">Mes préférences</CardTitle>
          <CardDescription>Personnalisez votre expérience EmotionsCare</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <PreferencesForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
