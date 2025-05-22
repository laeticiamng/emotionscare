
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageCircle, Phone } from 'lucide-react';

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const faqs = [
    {
      question: "Comment fonctionne la musicothérapie ?",
      answer: "Notre système de musicothérapie utilise une technologie d'IA pour analyser votre état émotionnel et générer des séquences musicales personnalisées pour améliorer votre bien-être. Les sessions peuvent être programmées ou lancées à la demande."
    },
    {
      question: "Comment modifier mes préférences de notifications ?",
      answer: "Vous pouvez modifier vos préférences de notifications dans la section Paramètres de votre compte. Vous pourrez y choisir quels types de notifications vous souhaitez recevoir et par quels canaux."
    },
    {
      question: "Je n'arrive pas à accéder à mon compte, que faire ?",
      answer: "Si vous rencontrez des difficultés pour accéder à votre compte, essayez de réinitialiser votre mot de passe. Si le problème persiste, contactez notre support via le formulaire de contact ou par téléphone."
    },
    {
      question: "Comment exporter mes données ?",
      answer: "Vous pouvez exporter vos données depuis la section Paramètres > Confidentialité. Plusieurs formats sont disponibles et l'exportation inclut votre historique d'utilisation et vos préférences."
    },
    {
      question: "Quelles sont les fonctionnalités disponibles pour les entreprises ?",
      answer: "Les entreprises bénéficient de fonctionnalités dédiées comme la gestion d'équipe, les campagnes de bien-être, les rapports analytiques et les tableaux de bord administratifs pour suivre le bien-être des collaborateurs."
    }
  ];
  
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Support & FAQ</h1>
        
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="faq">Questions fréquentes</TabsTrigger>
            <TabsTrigger value="contact">Nous contacter</TabsTrigger>
            <TabsTrigger value="chat">Chat support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>Trouvez des réponses aux questions les plus courantes</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Rechercher dans la FAQ..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun résultat pour "{searchTerm}"
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
                <CardDescription>Envoyez-nous un message et nous vous répondrons dans les plus brefs délais</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Nom complet</label>
                      <Input id="name" placeholder="Entrez votre nom" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                    <Input id="subject" placeholder="Sujet de votre message" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea id="message" placeholder="Détaillez votre demande..." rows={6} />
                  </div>
                  <Button type="submit" className="w-full">Envoyer</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" /> Chat avec le support
                </CardTitle>
                <CardDescription>Notre équipe de support est disponible pour vous aider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] border rounded-md bg-muted/30 flex flex-col items-center justify-center p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Discussion instantanée</h3>
                  <p className="text-muted-foreground mb-6">Lancez une conversation avec un de nos conseillers</p>
                  <Button>Démarrer le chat</Button>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Support téléphonique</p>
                        <p className="text-sm text-muted-foreground">Lun-Ven, 9h-18h</p>
                      </div>
                    </div>
                    <Button variant="outline">+33 1 23 45 67 89</Button>
                  </div>
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
