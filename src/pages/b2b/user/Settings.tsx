
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings as SettingsIcon, Shield, Bell, Accessibility, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const NotImplemented = () => (
  <div className="flex flex-col items-center justify-center p-4 min-h-[300px]">
    <p className="text-muted-foreground">Cette section sera disponible prochainement.</p>
  </div>
);

const B2BUserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Paramètres B2B
            </h1>
            <p className="text-muted-foreground mt-1">
              Personnalisez votre espace professionnel
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" /> Général
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Sécurité
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" /> Accessibilité
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" /> Apparence
              </TabsTrigger>
            </TabsList>
            
            <Card>
              <CardContent className="pt-6">
                <TabsContent value="general">
                  {/* This will be implemented with the requested components */}
                  <NotImplemented />
                </TabsContent>
                
                <TabsContent value="security">
                  {/* This will be implemented with the requested components */}
                  <NotImplemented />
                </TabsContent>
                
                <TabsContent value="notifications">
                  {/* This will be implemented with the requested components */}
                  <NotImplemented />
                </TabsContent>
                
                <TabsContent value="accessibility">
                  {/* This will be implemented with the requested components */}
                  <NotImplemented />
                </TabsContent>
                
                <TabsContent value="appearance">
                  {/* This will be implemented with the requested components */}
                  <NotImplemented />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default B2BUserSettings;
