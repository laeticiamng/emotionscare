
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const FaqPage: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Qu'est-ce qu'EmotionsCare ?",
      answer: "EmotionsCare est une plateforme de bien-être émotionnel qui utilise l'intelligence artificielle pour vous aider à comprendre, analyser et gérer vos émotions de manière personnalisée."
    },
    {
      question: "Comment fonctionne le scanner émotionnel ?",
      answer: "Notre scanner émotionnel analyse vos expressions, votre voix et vos textes grâce à l'IA pour identifier vos émotions en temps réel et vous proposer des recommandations adaptées."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et respectons les normes les plus strictes en matière de protection des données personnelles (RGPD)."
    },
    {
      question: "Quelle est la différence entre les accès B2C et B2B ?",
      answer: "L'accès B2C est destiné aux particuliers pour un usage personnel, tandis que l'accès B2B permet aux entreprises de gérer le bien-être émotionnel de leurs équipes avec des outils d'administration."
    },
    {
      question: "Comment fonctionne le coach IA ?",
      answer: "Notre coach IA vous accompagne personnellement en analysant vos patterns émotionnels et en vous proposant des exercices, conseils et techniques adaptés à votre profil."
    },
    {
      question: "Puis-je utiliser l'application hors ligne ?",
      answer: "Certaines fonctionnalités sont disponibles hors ligne, comme la consultation de votre journal et l'écoute de musiques téléchargées, mais l'IA nécessite une connexion internet."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. L'annulation prend effet à la fin de votre période de facturation actuelle."
    },
    {
      question: "L'application est-elle accessible aux personnes en situation de handicap ?",
      answer: "Oui, nous nous engageons à rendre notre plateforme accessible à tous, avec des options de navigation clavier, lecteurs d'écran compatibles et interface adaptable."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <HelpCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trouvez des réponses aux questions les plus courantes sur EmotionsCare.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">FAQ</CardTitle>
              <CardDescription className="text-center">
                Si vous ne trouvez pas votre réponse, n'hésitez pas à nous contacter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Vous avez d'autres questions ?
            </p>
            <Button onClick={() => navigate('/contact')}>
              Contactez-nous
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;
