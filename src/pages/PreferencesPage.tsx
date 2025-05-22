
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { ThemePreview } from '@/components/preferences/ThemePreview';

const PreferencesPage: React.FC = () => {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const [activeTab, setActiveTab] = React.useState('appearance');

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Préférences</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Thème</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <div 
                        key={theme}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                          preferences.theme === theme ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''
                        }`}
                        onClick={() => updatePreferences({ theme: theme as any })}
                      >
                        <p className="font-medium mb-2 capitalize">{theme}</p>
                        <div className="h-24 w-full">
                          <ThemePreview theme={theme as any} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Personnalisez vos préférences de notifications pour rester informé de ce qui compte pour vous.
                </p>
                <p>Options de notifications à compléter</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Confidentialité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Gérez la façon dont vos données sont utilisées et partagées.
                </p>
                <p>Options de confidentialité à compléter</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Personnalisez l'interface pour améliorer votre expérience d'utilisation.
                </p>
                <p>Options d'accessibilité à compléter</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default PreferencesPage;
