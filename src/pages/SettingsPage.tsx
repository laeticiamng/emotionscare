import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Bell,
  Shield,
  Palette,
  Download
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const settingsSections = [
    {
      title: 'Profil utilisateur',
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Prénom" defaultValue="John" />
            <Input placeholder="Nom" defaultValue="Doe" />
          </div>
          <Input placeholder="Email" defaultValue="john@example.com" />
          <Button>Sauvegarder</Button>
        </div>
      )
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Rappels quotidiens</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications de communauté</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Conseils du coach IA</span>
            <Switch />
          </div>
        </div>
      )
    },
    {
      title: 'Confidentialité',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Profil public</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Partage des données d'humeur</span>
            <Switch defaultChecked />
          </div>
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exporter mes données
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Paramètres
        </h1>
        <p className="text-lg text-muted-foreground">
          Personnalisez votre expérience EmotionsCare
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {section.icon}
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { SettingsPage };
export default SettingsPage;