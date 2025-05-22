
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Book, MessageSquare, FileText, PhoneCall } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-muted-foreground">
            Obtenez de l'aide et consultez notre documentation
          </p>
        </div>
      </div>

      <Tabs defaultValue="contact">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Contact
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> FAQ
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <Book className="h-4 w-4" /> Documentation
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Mes tickets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contactez notre équipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom complet</label>
                <Input id="name" placeholder="Votre nom" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="votre.email@example.com" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">Sujet</label>
                <Input id="topic" placeholder="Résumez votre problème" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  rows={5}
                  placeholder="Décrivez votre problème en détail"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Envoyer le message</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Autres moyens de contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PhoneCall className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Support téléphonique</h3>
                    <p className="text-sm text-muted-foreground">+33 (0)1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Chat en direct</h3>
                    <p className="text-sm text-muted-foreground">Disponible 9h-18h en semaine</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  question: "Comment réinitialiser mon mot de passe ?",
                  answer: "Vous pouvez réinitialiser votre mot de passe en cliquant sur 'Mot de passe oublié' sur la page de connexion. Un email vous sera envoyé avec les instructions."
                },
                {
                  question: "Comment modifier mes préférences de notifications ?",
                  answer: "Vous pouvez modifier vos préférences de notification dans la section 'Paramètres' de votre profil."
                },
                {
                  question: "Les données de mon profil sont-elles sécurisées ?",
                  answer: "Oui, nous utilisons un chiffrement de bout en bout pour protéger vos données personnelles et respectons strictement le RGPD."
                },
                {
                  question: "Comment accéder aux fonctionnalités premium ?",
                  answer: "Vous pouvez accéder aux fonctionnalités premium en souscrivant à l'un de nos plans depuis la section 'Abonnement' de votre compte."
                }
              ].map((item, i) => (
                <details key={i} className="group">
                  <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                    {item.question}
                    <span className="transition group-open:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-2 pl-1">{item.answer}</p>
                </details>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">Voir toutes les FAQ</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Guide de démarrage",
                    description: "Apprenez les bases de l'application"
                  },
                  {
                    title: "Exercices de relaxation",
                    description: "Techniques pour réduire le stress"
                  },
                  {
                    title: "Analyse émotionnelle",
                    description: "Comprendre vos résultats d'analyse"
                  },
                  {
                    title: "Musicothérapie",
                    description: "Utiliser la musique pour le bien-être"
                  }
                ].map((doc, i) => (
                  <div key={i} className="bg-muted/20 p-4 rounded-lg hover:bg-muted/40 transition cursor-pointer">
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes tickets de support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore de tickets de support.
              </p>
              <div className="flex justify-center">
                <Button>Créer un nouveau ticket</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
