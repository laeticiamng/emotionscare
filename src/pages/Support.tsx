
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LifeBuoy, MessageCircle, FileQuestion, HelpCircle, ExternalLink, Search } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Support & Assistance</h1>
        <p className="text-muted-foreground mt-1">
          Besoin d'aide ? Notre équipe est là pour vous guider
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input className="pl-10" placeholder="Rechercher dans l'aide..." />
      </div>

      <Tabs defaultValue="contact">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Contact
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" /> FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4" /> Tickets
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>
              <CardDescription>
                Envoyez-nous un message et nous vous répondrons dans les meilleurs délais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nom
                    </label>
                    <Input id="name" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Sujet
                  </label>
                  <Input id="subject" placeholder="Comment pouvons-nous vous aider ?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre problème ou votre demande en détail..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                Retrouvez les réponses aux questions les plus posées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  question: "Comment modifier mon profil ?",
                  answer: "Rendez-vous dans les paramètres de votre compte pour modifier vos informations personnelles."
                },
                {
                  question: "Comment récupérer mon mot de passe ?",
                  answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion et suivez les instructions."
                },
                {
                  question: "Les données sont-elles sécurisées ?",
                  answer: "Oui, toutes les données sont chiffrées et nous respectons strictement les normes RGPD."
                },
                {
                  question: "Comment annuler une session ?",
                  answer: "Accédez à la page Sessions, sélectionnez la session concernée et cliquez sur 'Annuler'."
                }
              ].map((item, i) => (
                <details key={i} className="group border-b pb-2">
                  <summary className="flex justify-between items-center cursor-pointer py-2 font-medium">
                    {item.question}
                    <span className="transition group-open:rotate-180">
                      <svg width="14" height="14" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6"/>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground pt-2 pb-4">
                    {item.answer}
                  </p>
                </details>
              ))}
              <div className="pt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  Voir toutes les FAQ <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes tickets</CardTitle>
              <CardDescription>
                Suivez l'état de vos demandes d'assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <LifeBuoy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun ticket en cours</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Vous n'avez pas encore ouvert de ticket d'assistance
                </p>
                <Button>Créer un nouveau ticket</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Guides & Tutoriels</CardTitle>
              <CardDescription>
                Apprenez à utiliser toutes les fonctionnalités de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-accent/5">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-1">Guide du débutant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Familiarisez-vous avec les fonctionnalités de base
                    </p>
                    <Button variant="outline" size="sm">Consulter le guide</Button>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-1">Utiliser le Journal</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apprenez à tenir votre journal émotionnel
                    </p>
                    <Button variant="outline" size="sm">Consulter le guide</Button>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-1">Sessions de relaxation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comment tirer le meilleur des sessions VR
                    </p>
                    <Button variant="outline" size="sm">Consulter le guide</Button>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-1">Musique thérapeutique</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Exploration des playlists selon vos émotions
                    </p>
                    <Button variant="outline" size="sm">Consulter le guide</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
