
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import PreferencesForm from '@/components/preferences/PreferencesForm';
import { useTheme } from '@/contexts/ThemeContext';

const UserPreferences = () => {
  const { theme } = useTheme();
  
  return (
    <div className="container max-w-4xl py-10 animate-fade-in">
      <Card className="card-premium shadow-premium overflow-hidden">
        <div className={`h-2 w-full ${
          theme === 'dark' ? 'bg-primary/20' :
          theme === 'pastel' ? 'bg-blue-200' :
          'bg-primary/10'
        }`}></div>
        
        <CardHeader className="pt-8 pb-2">
          <CardTitle className="text-3xl heading-elegant flex items-center">
            <span>Mes préférences</span>
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Personnalisez votre expérience EmotionsCare selon vos goûts et besoins
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10 pt-6">
          <p className="text-muted-foreground text-balance text-lg">
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
