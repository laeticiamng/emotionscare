
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      category: "Général",
      questions: [
        {
          question: "Qu'est-ce qu'EmotionsCare ?",
          answer: "EmotionsCare est une plateforme de bien-être émotionnel qui utilise l'intelligence artificielle pour vous aider à mieux comprendre et gérer vos émotions au quotidien."
        },
        {
          question: "Comment fonctionne l'analyse émotionnelle ?",
          answer: "Notre IA analyse vos expressions, votre voix et vos textes pour identifier vos émotions et vous proposer des recommandations personnalisées de bien-être."
        }
      ]
    },
    {
      category: "Tarifs et Abonnements",
      questions: [
        {
          question: "EmotionsCare est-il gratuit ?",
          answer: "Nous proposons une version gratuite avec des fonctionnalités de base, ainsi que des abonnements premium pour un accès complet à toutes nos fonctionnalités."
        },
        {
          question: "Puis-je annuler mon abonnement à tout moment ?",
          answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace utilisateur, sans frais supplémentaires."
        }
      ]
    },
    {
      category: "Confidentialité et Sécurité",
      questions: [
        {
          question: "Mes données sont-elles protégées ?",
          answer: "Absolument. Nous respectons le RGPD et utilisons un chiffrement de bout en bout pour protéger toutes vos données personnelles et émotionnelles."
        },
        {
          question: "Qui peut accéder à mes informations ?",
          answer: "Seul vous avez accès à vos données personnelles. Nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Trouvez rapidement les réponses à vos questions sur EmotionsCare
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {filteredFaq.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const globalIndex = categoryIndex * 10 + questionIndex;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <Card key={questionIndex} className="overflow-hidden">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        {isOpen && (
                          <CardContent className="pt-0 pb-6">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFaq.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Aucune question trouvée pour "{searchTerm}"
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-center">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Vous ne trouvez pas votre réponse ?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Notre équipe support est là pour vous aider
                </p>
                <Button onClick={() => navigate('/contact')}>
                  Nous contacter
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;
