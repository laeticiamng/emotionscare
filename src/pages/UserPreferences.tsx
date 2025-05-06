
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
    <div className="container max-w-4xl py-10 animate-fade-in">
      <Card className="card-premium shadow-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl heading-elegant">Mes préférences</CardTitle>
          <CardDescription className="text-base">
            Personnalisez votre expérience EmotionsCare selon vos goûts et besoins
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10 pt-6">
          <p className="text-muted-foreground text-balance">
            Adaptez l'interface à votre style en choisissant parmi nos thèmes professionnels 
            et en personnalisant l'affichage selon vos préférences.
          </p>
          <PreferencesForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
