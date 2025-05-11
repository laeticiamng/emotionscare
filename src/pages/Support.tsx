
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PremiumSupportAssistant from '@/components/support/PremiumSupportAssistant';
import Shell from '@/Shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, PhoneCall, FileText, Headphones } from 'lucide-react';

const SupportPage: React.FC = () => {
  return (
    <Shell>
      <div className="py-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Centre d'assistance</h1>
          <p className="text-muted-foreground mt-2">
            Notre équipe est disponible pour vous aider à tout moment
          </p>
        </div>
        
        <Tabs defaultValue="chat" className="space-y-8">
          <TabsList className="grid grid-cols-4 max-w-xl mx-auto">
            <TabsTrigger value="chat" className="flex flex-col items-center gap-2 py-3">
              <MessageCircle className="h-5 w-5" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex flex-col items-center gap-2 py-3">
              <PhoneCall className="h-5 w-5" />
              <span>Téléphone</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex flex-col items-center gap-2 py-3">
              <FileText className="h-5 w-5" />
              <span>Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col items-center gap-2 py-3">
              <Headphones className="h-5 w-5" />
              <span>FAQ</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Comment pouvons-nous vous aider ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Notre assistant premium est à votre disposition pour répondre à vos questions et résoudre vos problèmes.
                    </p>
                    <div className="space-y-4">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Temps de réponse moyen : &lt; 1 minute
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Experts disponibles : 8/8
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-1">
                <PremiumSupportAssistant />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle>Assistance téléphonique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Notre équipe d'assistance est disponible par téléphone 24h/24 et 7j/7.</p>
                <div className="p-4 bg-muted rounded-lg text-center font-medium text-xl">
                  +33 01 23 45 67 89
                </div>
                <Button className="w-full">Demander un rappel</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Mes tickets d'assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Vous n'avez pas encore de tickets d'assistance.
                </p>
                <Button className="w-full">Créer un nouveau ticket</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquemment posées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Consultez notre base de connaissances pour trouver rapidement des réponses à vos questions.
                </p>
                <div className="space-y-4">
                  {["Comment configurer mon compte ?", "Comment réinitialiser mon mot de passe ?", 
                    "Comment accéder à mes données ?", "Comment contacter le support technique ?"].map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      {question}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default SupportPage;
