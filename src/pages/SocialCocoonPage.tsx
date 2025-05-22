
import React from 'react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const SocialCocoonPage: React.FC = () => {
  const { toast } = useToast();
  
  const showComingSoon = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Cette section est en cours de développement",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Social Cocoon</h1>
        <p className="text-muted-foreground">Échangez anonymement avec vos collègues dans un espace bienveillant</p>
      </header>
      
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fil d'actualité</CardTitle>
            </CardHeader>
            <CardContent>
              <button className="text-primary" onClick={showComingSoon}>
                Fonctionnalité à venir
              </button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Groupes d'entraide</CardTitle>
            </CardHeader>
            <CardContent>
              <button className="text-primary" onClick={showComingSoon}>
                Fonctionnalité à venir
              </button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages privés</CardTitle>
            </CardHeader>
            <CardContent>
              <button className="text-primary" onClick={showComingSoon}>
                Fonctionnalité à venir
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialCocoonPage;
