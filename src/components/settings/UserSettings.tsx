
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Shield, User, Palette, Smartphone } from 'lucide-react';
import NotificationPreferences from './NotificationPreferences';
import PersonalProfile from './PersonalProfile';
import DisplayPreferences from './DisplayPreferences';
import MobilePreferences from './MobilePreferences';
import PrivacySettings from './PrivacySettings';

const UserSettings: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences personnelles</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Options avancées
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-3">
            <User className="h-5 w-5" />
            <span className="text-xs">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-3">
            <Bell className="h-5 w-5" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex flex-col items-center gap-1 py-3">
            <Palette className="h-5 w-5" />
            <span className="text-xs">Affichage</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex flex-col items-center gap-1 py-3">
            <Smartphone className="h-5 w-5" />
            <span className="text-xs">Mobile</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-3">
            <Shield className="h-5 w-5" />
            <span className="text-xs">Confidentialité</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <PersonalProfile />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>
        
        <TabsContent value="display">
          <DisplayPreferences />
        </TabsContent>
        
        <TabsContent value="mobile">
          <MobilePreferences />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 flex items-center justify-between bg-muted/20 p-6 rounded-lg">
        <div>
          <h3 className="text-lg font-medium mb-1">Certifications et conformité</h3>
          <p className="text-sm text-muted-foreground max-w-lg">
            EmotionsCare respecte les normes les plus strictes en matière de protection des données et de sécurité.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="py-1.5 px-3">
            RGPD
          </Badge>
          <Badge variant="outline" className="py-1.5 px-3">
            HIPAA
          </Badge>
          <Badge variant="outline" className="py-1.5 px-3">
            ISO 27001
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
