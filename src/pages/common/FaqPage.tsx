
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Qu'est-ce qu'EmotionsCare ?",
      answer: "EmotionsCare est une plateforme de bien-être émotionnel qui utilise l'intelligence artificielle pour vous aider à comprendre, gérer et améliorer votre santé émotionnelle."
    },
    {
      question: "Comment fonctionne le scanner émotionnel ?",
      answer: "Notre scanner utilise des algorithmes avancés pour analyser vos expressions et votre voix afin de détecter votre état émotionnel actuel et vous proposer des recommandations personnalisées."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons strictement les réglementations RGPD. Vos données émotionnelles sont privées et ne sont jamais partagées."
    },
    {
      question: "Quelle est la différence entre B2C et B2B ?",
      answer: "L'accès B2C est destiné aux particuliers pour leur bien-être personnel, tandis que l'accès B2B est conçu pour les entreprises souhaitant améliorer le bien-être de leurs équipes."
    },
    {
      question: "Le coach IA peut-il remplacer un thérapeute ?",
      answer: "Non, notre coach IA est un outil de soutien complémentaire. Pour des problèmes de santé mentale sérieux, nous recommandons toujours de consulter un professionnel qualifié."
    },
    {
      question: "Comment la musicothérapie fonctionne-t-elle ?",
      answer: "Notre système analyse votre état émotionnel et sélectionne des musiques spécifiquement adaptées pour améliorer votre humeur ou vous aider à atteindre l'état désiré."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trouvez des réponses aux questions les plus courantes sur EmotionsCare
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full p-6 text-left justify-between h-auto"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0" />
                    )}
                  </Button>
                  {openFaq === index && (
                    <CardContent className="pt-0 pb-6">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Vous ne trouvez pas la réponse à votre question ?
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
