
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Mail, MessageCircle, Book, ChevronDown, ChevronRight } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment fonctionne l'analyse émotionnelle ?",
      answer: "Notre système utilise l'intelligence artificielle pour analyser vos expressions faciales, votre voix et vos réponses textuelles afin d'évaluer votre état émotionnel actuel."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons strictement le RGPD et ne partageons jamais vos données personnelles."
    },
    {
      question: "Comment inviter des collègues ?",
      answer: "Dans l'espace B2B, vous pouvez inviter des collègues via la section 'Gestion d'équipe' en envoyant des invitations par email."
    },
    {
      question: "Puis-je exporter mes données ?",
      answer: "Oui, vous pouvez télécharger toutes vos données à tout moment depuis la page Paramètres."
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Centre d'aide</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Questions fréquentes
              </CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 pt-0 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Nous contacter
              </CardTitle>
              <CardDescription>
                Besoin d'aide supplémentaire ? Notre équipe est là pour vous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <Button className="w-full" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat en direct
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>Heures d'ouverture :</p>
                <p>Lun - Ven : 9h - 18h</p>
                <p>Réponse sous 24h</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Envoyer un message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Décrivez votre problème ou votre question..."
                className="min-h-[100px]"
              />
              <Button className="w-full">
                Envoyer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
