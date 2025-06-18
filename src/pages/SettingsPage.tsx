
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Shield, Palette, Globe, Download, Trash2, Key, Mail, Phone, Calendar } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    coaching: false,
    community: true,
    reminders: true
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: <User className="h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'privacy', name: 'Confidentialité', icon: <Shield className="h-4 w-4" /> },
    { id: 'appearance', name: 'Apparence', icon: <Palette className="h-4 w-4" /> },
    { id: 'language', name: 'Langue', icon: <Globe className="h-4 w-4" /> }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience EmotionsCare
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.name}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Changer la photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, max 2MB</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom</label>
                      <Input defaultValue="Marie" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom</label>
                      <Input defaultValue="Dupont" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input defaultValue="marie.dupont@example.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de naissance</label>
                    <Input type="date" defaultValue="1990-05-15" />
                  </div>
                  
                  <Button>Sauvegarder les modifications</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du Compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mot de passe</h4>
                      <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
                    </div>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Authentification à deux facteurs</h4>
                      <p className="text-sm text-muted-foreground">Sécurisez davantage votre compte</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Préférences de Notifications</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez être informé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Notifications par email</h4>
                      <p className="text-sm text-muted-foreground">Recevez des mises à jour par email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">Notifications sur votre appareil</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Conseils du coach</h4>
                      <p className="text-sm text-muted-foreground">Recommandations personnalisées</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.coaching}
                    onCheckedChange={(checked) => setNotifications({...notifications, coaching: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Rappels</h4>
                      <p className="text-sm text-muted-foreground">Rappels pour vos sessions</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.reminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, reminders: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Confidentialité des Données</CardTitle>
                  <CardDescription>
                    Contrôlez vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Partage de données anonymes</h4>
                      <p className="text-sm text-muted-foreground">Aidez-nous à améliorer nos services</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profil public</h4>
                      <p className="text-sm text-muted-foreground">Rendez votre profil visible dans la communauté</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Données</CardTitle>
                  <CardDescription>
                    Exportez ou supprimez vos données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Exporter mes données</h4>
                      <p className="text-sm text-muted-foreground">Téléchargez toutes vos données</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Supprimer mon compte</h4>
                      <p className="text-sm text-muted-foreground">Action irréversible</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Thème</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <div className="w-6 h-6 bg-white border rounded mb-2"></div>
                      Clair
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <div className="w-6 h-6 bg-gray-800 rounded mb-2"></div>
                      Sombre
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                      Auto
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Couleur d'accent</h4>
                  <div className="flex gap-3">
                    {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'].map((color) => (
                      <div key={color} className={`w-8 h-8 ${color} rounded-full cursor-pointer border-2 border-transparent hover:border-gray-300`}></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'language' && (
            <Card>
              <CardHeader>
                <CardTitle>Langue et Région</CardTitle>
                <CardDescription>
                  Configurez votre langue et format de date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Langue</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="America/New_York">America/New_York (GMT-5)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Format de date</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                    <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <Button>Sauvegarder</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
