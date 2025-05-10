
import React, { useState } from 'react';
import Shell from '@/components/Shell';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PremiumSupportAssistant from '@/components/support/PremiumSupportAssistant';
import HelpCenter from '@/components/support/HelpCenter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Volume2, Headphones, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('assistant');
  const { toast } = useToast();

  const handleContactClick = (method: string) => {
    toast({
      title: `Demande de contact par ${method}`,
      description: 'Un spécialiste va vous contacter très prochainement',
      duration: 5000,
    });
  };

  return (
    <Shell>
      <div className="container py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold heading-premium mb-3">Assistance Premium</h1>
          <p className="text-xl text-muted-foreground">
            Notre équipe d'experts est là pour vous accompagner 24/7 avec un service personnalisé de qualité exceptionnelle
          </p>
        </header>

        <Tabs
          defaultValue="assistant"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="assistant" className="flex flex-col items-center gap-1 py-3">
              <MessageCircle className="h-5 w-5" />
              <span>Assistant Premium</span>
            </TabsTrigger>
            <TabsTrigger value="help-center" className="flex flex-col items-center gap-1 py-3">
              <Headphones className="h-5 w-5" />
              <span>Centre d'Aide</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col items-center gap-1 py-3">
              <Phone className="h-5 w-5" />
              <span>Contact Direct</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistant" className="mt-0">
            <div className="h-[70vh]">
              <PremiumSupportAssistant />
            </div>
          </TabsContent>

          <TabsContent value="help-center" className="mt-0">
            <HelpCenter />
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover-lift premium-card cursor-pointer" onClick={() => handleContactClick('téléphone')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Ligne Premium Dédiée
                  </CardTitle>
                  <CardDescription>
                    Accès exclusif à notre ligne directe avec priorité immédiate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Demander un appel
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Temps d'attente estimé: &lt;2 minutes
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift premium-card cursor-pointer" onClick={() => handleContactClick('email')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Support Email Prioritaire
                  </CardTitle>
                  <CardDescription>
                    Réponse garantie en moins de 12 heures avec suivi personnalisé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Envoyer un email
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Réponse sous 12h garantie
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift premium-card cursor-pointer" onClick={() => handleContactClick('audio')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Support Audio/Visio
                  </CardTitle>
                  <CardDescription>
                    Session immersive avec un expert en bien-être émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="secondary">
                    Planifier une session
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Prochaine disponibilité: Aujourd'hui
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default SupportPage;
