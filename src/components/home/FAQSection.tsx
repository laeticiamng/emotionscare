/**
 * FAQSection - Questions fréquemment posées avec animations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  icon: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: 'Général',
    question: 'Qu\'est-ce qu\'EmotionsCare ?',
    answer:
      'EmotionsCare est une plateforme d\'intelligence émotionnelle pilotée par l\'IA. Elle combine l\'analyse émotionnelle, la musicothérapie, le coaching personnalisé et des expériences immersives pour améliorer votre bien-être émotionnel et votre qualité de vie.',
    icon: '💭',
  },
  {
    id: 2,
    category: 'Général',
    question: 'Comment fonctionne l\'analyse émotionnelle ?',
    answer:
      'Notre système utilise la technologie de reconnaissance faciale avancée avec 99% de précision. En 30 secondes, il analyse vos micro-expressions pour identifier vos émotions actuelles et vous proposer des recommandations adaptées.',
    icon: '👁️',
  },
  {
    id: 3,
    category: 'Sécurité',
    question: 'Mes données sont-elles sécurisées ?',
    answer:
      'Absolument. Toutes vos données sont chiffrées avec un protocole de niveau bancaire (AES-256). Nous respectons intégralement le RGPD et somos certifiés ISO 27001 pour la sécurité de l\'information.',
    icon: '🔒',
  },
  {
    id: 4,
    category: 'Sécurité',
    question: 'Que faites-vous avec mes données personnelles ?',
    answer:
      'Vos données vous appartiennent. Nous ne les vendons jamais à des tiers. Elles sont utilisées uniquement pour vous proposer une expérience personnalisée et améliorer nos algorithmes avec votre consentement.',
    icon: '📋',
  },
  {
    id: 5,
    category: 'Compte',
    question: 'Comment puis-je annuler mon abonnement ?',
    answer:
      'Vous pouvez annuler votre abonnement à tout moment en accédant à vos paramètres de compte. Aucun frais caché, aucun engagement à long terme. Vous aurez accès à vos données personnelles même après annulation.',
    icon: '⚙️',
  },
  {
    id: 6,
    category: 'Compte',
    question: 'Y a-t-il une période d\'essai gratuit ?',
    answer:
      'Oui ! Vous disposez de 30 jours d\'essai gratuit sans avoir besoin de renseigner une carte bancaire. Accès complet à toutes les fonctionnalités premium pendant cette période.',
    icon: '🎁',
  },
  {
    id: 7,
    category: 'Fonctionnalités',
    question: 'Puis-je utiliser EmotionsCare sur mobile ?',
    answer:
      'Oui, EmotionsCare fonctionne sur tous les appareils : smartphones, tablettes et ordinateurs. Notre application web est progressive (PWA) et fonctionne même hors ligne.',
    icon: '📱',
  },
  {
    id: 8,
    category: 'Fonctionnalités',
    question: 'Comment fonctionne le coach Nyvée ?',
    answer:
      'Nyvée est notre coach IA personnel. Elle apprend de vos interactions pour vous proposer un soutien émotionnel adapté. Elle combine les techniques de psychologie positive avec les dernières avancées en IA.',
    icon: '🧠',
  },
];

const FAQSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-2">
              <Sparkles className="h-3 w-3 mr-2" />
              Questions fréquentes
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Tout ce que vous devez savoir
            </h2>
            <p className="text-lg text-muted-foreground">
              Trouvez des réponses à vos questions les plus courantes
            </p>
          </div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Rechercher une question..."
                className="pl-12 py-3 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Tous
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {filteredFaqs.map((faq) => (
              <motion.div key={faq.id} variants={itemVariants}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-all border-0 bg-card hover:bg-card/80"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <button className="w-full text-left p-6 flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{faq.icon}</span>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {faq.category}
                      </Badge>
                    </div>

                    <motion.div
                      animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-border/50">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}

            {filteredFaqs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg">
                  Aucune question trouvée. Essayez une autre recherche.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-8 bg-muted/50 rounded-xl border border-border/50"
          >
            <p className="text-muted-foreground mb-4">
              Vous n\'avez pas trouvé votre réponse ?
            </p>
            <Button variant="outline">
              Nous contacter
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
