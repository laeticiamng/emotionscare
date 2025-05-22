
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Paramètres</h1>
          <p className="text-muted-foreground mb-6">
            Personnalisez votre expérience et gérez vos préférences
          </p>
          
          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="votre.email@exemple.fr" type="email" />
                  </div>
                  <div className="pt-4">
                    <Button>Enregistrer les modifications</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Thème</Label>
                    <div className="flex space-x-4">
                      <Button 
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                      >
                        Clair
                      </Button>
                      <Button 
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                      >
                        Sombre
                      </Button>
                      <Button 
                        variant={theme === 'system' ? 'default' : 'outline'}
                        onClick={() => setTheme('system')}
                      >
                        Système
                      </Button>
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
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifs">Notifications par email</Label>
                    <Switch id="email-notifs" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifs">Notifications push</Label>
                    <Switch id="push-notifs" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder-notifs">Rappels journaliers</Label>
                    <Switch id="reminder-notifs" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Confidentialité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-sharing">Partage de données anonymisées</Label>
                    <Switch id="data-sharing" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-visibility">Visibilité du profil</Label>
                    <Switch id="profile-visibility" />
                  </div>
                  <div className="pt-4">
                    <Button variant="destructive">Supprimer mon compte</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Shell>
  );
};

export default SettingsPage;
