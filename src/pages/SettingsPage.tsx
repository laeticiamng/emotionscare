
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Palette, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience EmotionsCare
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="language">Langue</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom</label>
                  <input type="text" defaultValue="John" className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <input type="text" defaultValue="Doe" className="w-full p-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" defaultValue="john.doe@example.com" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea 
                  className="w-full p-2 border rounded-md h-24 resize-none"
                  placeholder="Parlez-nous de vous..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Objectifs de bien-être</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Réduire le stress
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Améliorer le sommeil
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Augmenter la concentration
                  </label>
                </div>
              </div>
              <Button>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Rappels de méditation</h4>
                    <p className="text-sm text-muted-foreground">Recevoir des rappels quotidiens</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications de communauté</h4>
                    <p className="text-sm text-muted-foreground">Nouveaux messages et interactions</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Conseils personnalisés</h4>
                    <p className="text-sm text-muted-foreground">Recommandations basées sur votre activité</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Résumés hebdomadaires</h4>
                    <p className="text-sm text-muted-foreground">Rapport de vos progrès</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Horaires de notification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de début</label>
                    <input type="time" defaultValue="08:00" className="w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de fin</label>
                    <input type="time" defaultValue="22:00" className="w-full p-2 border rounded-md" />
                  </div>
                </div>
              </div>
              <Button>Sauvegarder les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité et Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Profil public</h4>
                    <p className="text-sm text-muted-foreground">Permettre aux autres de voir votre profil</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Partager les progrès</h4>
                    <p className="text-sm text-muted-foreground">Afficher vos statistiques dans la communauté</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytiques anonymes</h4>
                    <p className="text-sm text-muted-foreground">Aider à améliorer l'application</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
              <div className="pt-4 border-t space-y-3">
                <h4 className="font-medium">Gestion des données</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Télécharger mes données
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Supprimer l'historique
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Supprimer le compte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Thème</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg text-center cursor-pointer hover:bg-muted">
                    <div className="w-full h-12 bg-white border rounded mb-2"></div>
                    <span className="text-sm">Clair</span>
                  </div>
                  <div className="p-3 border rounded-lg text-center cursor-pointer hover:bg-muted border-primary">
                    <div className="w-full h-12 bg-gray-800 rounded mb-2"></div>
                    <span className="text-sm">Sombre</span>
                  </div>
                  <div className="p-3 border rounded-lg text-center cursor-pointer hover:bg-muted">
                    <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                    <span className="text-sm">Auto</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Couleur d'accent</h4>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer border-2 border-blue-500"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer"></div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full cursor-pointer"></div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full cursor-pointer"></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Taille de police</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Petite</option>
                  <option selected>Normale</option>
                  <option>Grande</option>
                  <option>Très grande</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Langue et Région
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Langue de l'interface</label>
                <select className="w-full p-2 border rounded-md">
                  <option selected>Français</option>
                  <option>English</option>
                  <option>Español</option>
                  <option>Deutsch</option>
                  <option>Italiano</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Région</label>
                <select className="w-full p-2 border rounded-md">
                  <option selected>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Canada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
                <select className="w-full p-2 border rounded-md">
                  <option selected>Europe/Paris</option>
                  <option>Europe/Brussels</option>
                  <option>Europe/Zurich</option>
                  <option>America/Toronto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Format de date</label>
                <select className="w-full p-2 border rounded-md">
                  <option selected>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <Button>Appliquer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
