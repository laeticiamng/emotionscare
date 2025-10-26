// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Général',
      questions: [
        { q: 'Comment créer un compte ?', a: 'Cliquez sur "S\'inscrire" en haut à droite et suivez les étapes.' },
        { q: 'L\'application est-elle gratuite ?', a: 'Oui, nous proposons un plan gratuit avec des fonctionnalités de base. Des plans premium sont disponibles pour plus de fonctionnalités.' },
      ],
    },
    {
      category: 'Fonctionnalités',
      questions: [
        { q: 'Comment fonctionne le scan émotionnel ?', a: 'Le scan utilise l\'IA pour analyser vos expressions faciales et votre voix afin d\'identifier votre état émotionnel.' },
        { q: 'Puis-je utiliser l\'app sans VR ?', a: 'Absolument ! La VR est optionnelle. Toutes les fonctionnalités principales sont accessibles sans casque VR.' },
      ],
    },
    {
      category: 'Compte & Facturation',
      questions: [
        { q: 'Comment changer mon plan ?', a: 'Allez dans Paramètres > Abonnement pour changer votre plan à tout moment.' },
        { q: 'Puis-je annuler mon abonnement ?', a: 'Oui, vous pouvez annuler à tout moment sans frais. Votre accès Premium restera actif jusqu\'à la fin de la période payée.' },
      ],
    },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">Questions Fréquentes</h1>
          </div>
          <p className="text-muted-foreground">Trouvez rapidement des réponses à vos questions</p>
        </header>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
        </Card>

        {filteredFaqs.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, qIdx) => (
                  <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {filteredFaqs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Aucune question trouvée. Essayez un autre terme de recherche.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
