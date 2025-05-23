
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, MessageCircle, Phone, Book, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HelpPage: React.FC = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "Comment fonctionne l'analyse émotionnelle par IA ?",
      answer: "Notre IA analyse vos émotions en utilisant des techniques de traitement du langage naturel, d'analyse vocale et de reconnaissance d'expressions faciales. L'algorithme identifie des patterns émotionnels et vous fournit des insights personnalisés."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles sans votre consentement explicite."
    },
    {
      question: "Comment puis-je améliorer la précision des analyses ?",
      answer: "Plus vous utilisez EmotionsCare régulièrement, plus l'IA apprend à vous connaître. Soyez authentique dans vos réponses et utilisez différentes méthodes d'analyse (texte, voix, facial) pour des résultats optimaux."
    },
    {
      question: "Que faire si je reçois des résultats préoccupants ?",
      answer: "EmotionsCare est un outil de bien-être, pas un diagnostic médical. Si vous ressentez des difficultés importantes, nous vous encourageons à consulter un professionnel de la santé mentale."
    },
    {
      question: "Comment fonctionne le coach IA ?",
      answer: "Le coach IA utilise des techniques de coaching validées scientifiquement et s'adapte à votre profil émotionnel. Il propose des exercices, des conseils et un accompagnement personnalisé 24h/24."
    },
    {
      question: "Puis-je supprimer mes données ?",
      answer: "Oui, vous avez un contrôle total sur vos données. Vous pouvez les exporter ou les supprimer à tout moment depuis vos paramètres de compte."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais",
      variant: "default"
    });
    
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Centre d'Aide</h1>
          <p className="text-xl text-muted-foreground">
            Trouvez des réponses à vos questions ou contactez notre équipe
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Book className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Guides complets pour utiliser EmotionsCare
              </p>
              <Button variant="outline" size="sm">
                Consulter les guides
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Chat en direct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Discutez avec notre équipe support
              </p>
              <Button variant="outline" size="sm">
                Commencer le chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Support téléphonique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Appelez-nous du lundi au vendredi
              </p>
              <Button variant="outline" size="sm">
                01 23 45 67 89
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Questions Fréquemment Posées
            </CardTitle>
            <CardDescription>
              Les réponses aux questions les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Nous Contacter
            </CardTitle>
            <CardDescription>
              Envoyez-nous votre question et nous vous répondrons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full flex items-center gap-2">
                <Send className="h-4 w-4" />
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Urgence ou Crise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              Si vous traversez une crise ou avez des pensées suicidaires, contactez immédiatement :
            </p>
            <div className="space-y-2">
              <p className="font-medium text-red-800">• SOS Amitié : 09 72 39 40 50</p>
              <p className="font-medium text-red-800">• Suicide Écoute : 01 45 39 40 00</p>
              <p className="font-medium text-red-800">• SAMU : 15</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
