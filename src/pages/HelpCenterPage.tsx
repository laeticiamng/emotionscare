
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Search, MessageCircle, Book, Phone, Mail, ArrowLeft } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    {
      question: "Comment commencer avec EmotionsCare ?",
      answer: "Pour commencer, créez un compte en choisissant entre l'espace particulier (B2C) ou entreprise (B2B). Ensuite, réalisez votre premier scan émotionnel pour personnaliser votre expérience."
    },
    {
      question: "Comment fonctionne le scan émotionnel ?",
      answer: "Notre scan émotionnel utilise une technologie avancée d'analyse des émotions. Il analyse vos réponses à un questionnaire adaptatif pour déterminer votre état émotionnel actuel et vous proposer des recommandations personnalisées."
    },
    {
      question: "La musicothérapie est-elle adaptée à tous ?",
      answer: "Oui, notre système de musicothérapie s'adapte à chaque utilisateur. Basé sur vos préférences et votre état émotionnel, il vous propose une sélection musicale personnalisée pour améliorer votre bien-être."
    },
    {
      question: "Comment utiliser le Coach IA ?",
      answer: "Le Coach IA est disponible 24h/24 pour vous accompagner. Vous pouvez lui poser des questions, partager vos préoccupations ou demander des conseils. Il s'adapte à votre profil et à vos besoins spécifiques."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire pour protéger vos données. Toutes les informations sont stockées de manière sécurisée et ne sont jamais partagées sans votre consentement explicite."
    },
    {
      question: "Comment fonctionne la réalité virtuelle ?",
      answer: "Nos expériences VR vous transportent dans des environnements apaisants et thérapeutiques. Elles sont conçues pour réduire le stress, améliorer la relaxation et favoriser un état de bien-être mental."
    },
    {
      question: "Puis-je utiliser EmotionsCare sur mobile ?",
      answer: "Oui, EmotionsCare est entièrement responsive et fonctionne parfaitement sur tous les appareils : ordinateurs, tablettes et smartphones."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel, dans la section 'Paramètres de compte'. L'annulation prend effet à la fin de votre période de facturation actuelle."
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Centre d'Aide</h1>
          <p className="text-xl opacity-90 mb-8">
            Trouvez rapidement les réponses à vos questions
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Book className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Guide de démarrage</CardTitle>
              <CardDescription>
                Apprenez les bases d'EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Consulter le guide
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Chat en direct</CardTitle>
              <CardDescription>
                Discutez avec notre équipe support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Démarrer le chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Phone className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Support téléphonique</CardTitle>
              <CardDescription>
                Appelez-nous du lundi au vendredi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Voir les horaires
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
          
          {filteredFAQ.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQ.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border">
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucun résultat trouvé pour "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                Effacer la recherche
              </Button>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center mb-8">Besoin d'aide supplémentaire ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className="text-gray-600 mb-4">Nous répondons sous 24h</p>
              <Button variant="outline">
                support@emotionscare.com
              </Button>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Chat en Direct</h4>
              <p className="text-gray-600 mb-4">Disponible 9h-18h</p>
              <Button variant="outline">
                Démarrer une conversation
              </Button>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
