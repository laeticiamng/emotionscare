// @ts-nocheck
/**
 * FAQSection - FAQ avec framing interventionnel
 * Vision: Répondre aux vraies questions sur le moment où utiliser EmotionsCare
 * Inclut Schema.org FAQPage pour SEO
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
    category: 'Quand utiliser',
    question: "Pour quel type de moment est-ce conçu ?",
    answer:
      "Pour les moments où votre cerveau ne s'arrête plus : fin de garde, montée d'anxiété, épuisement qui empêche de dormir, journée à terminer alors que vous êtes au bord. Ce ne sont pas des exercices de relaxation génériques, mais des protocoles courts pour des moments précis du quotidien soignant.",
    icon: '🎯',
  },
  {
    id: 2,
    category: 'Quand utiliser',
    question: 'Combien de temps faut-il prévoir ?',
    answer:
      "Entre 2 et 5 minutes par session. Aucune méditation longue n'est requise : l'objectif est de produire un effet rapidement, entre deux consultations ou avant de reprendre la route.",
    icon: '⏱️',
  },
  {
    id: 3,
    category: 'Quand utiliser',
    question: 'Est-ce que cela fonctionne réellement ?',
    answer:
      "Les exercices reposent sur des techniques validées : respiration contrôlée (cohérence cardiaque), relaxation guidée, pleine conscience. Si après une session vous ne ressentez pas d'effet, un autre protocole vous est proposé. Aucune croyance n'est requise pour que cela agisse sur votre système nerveux.",
    icon: '✨',
  },
  {
    id: 4,
    category: 'Comment ça marche',
    question: "Concrètement, c'est quoi ?",
    answer:
      "Des protocoles audio et visuels guidés (respiration, relaxation, ambiances sonores) à lancer en autonomie. Vous suivez la consigne à l'écran, sans préparation ni installation matérielle.",
    icon: '🧠',
  },
  {
    id: 5,
    category: 'Comment ça marche',
    question: 'Quel est le rôle de la musique ?',
    answer:
      "La musique sert de support sensoriel pendant les exercices : tempo, ambiance et progression sont calibrés pour accompagner la respiration ou la relaxation. Elle n'est pas une simple playlist d'écoute.",
    icon: '🎵',
  },
  {
    id: 6,
    category: 'Sécurité',
    question: 'Mes données sont-elles protégées ?',
    answer:
      "Oui. Chiffrement des données en transit (TLS) et au repos, hébergement dans l'Union européenne, conformité RGPD. Vous pouvez exporter ou supprimer votre contenu à tout moment depuis votre espace personnel.",
    icon: '🔒',
  },
  {
    id: 7,
    category: 'Accès',
    question: "Est-ce gratuit ?",
    answer:
      "Oui, un plan Gratuit est disponible (exercices de base, journal émotionnel, communauté), sans carte bancaire requise. Un abonnement Pro à 14,90€/mois débloque les fonctionnalités complètes. Un droit de rétractation de 14 jours s'applique sur le plan Pro.",
    icon: '💳',
  },
  {
    id: 8,
    category: 'Accès',
    question: 'Puis-je annuler à tout moment ?',
    answer:
      "Oui, sans justification ni frais cachés. L'annulation se fait depuis votre espace personnel. Vous conservez l'accès à votre abonnement jusqu'à la fin de la période en cours.",
    icon: '🚪',
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

  // Générer le Schema.org FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

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
    <section className="py-20 bg-gradient-to-b from-background to-muted/20" id="faq" aria-labelledby="faq-title">
      {/* Schema.org FAQPage pour SEO */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

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
              <HelpCircle className="h-3 w-3 mr-2" aria-hidden="true" />
              Questions légitimes
            </Badge>
            <h2 id="faq-title" className="text-3xl lg:text-4xl font-bold">
              Questions fréquentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Réponses directes, sans jargon.
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
                placeholder="Chercher une question..."
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
                Tout
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
                  Aucune question trouvée. Essayez un autre terme.
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
              La meilleure façon de comprendre, c'est d'essayer.
            </p>
            <Button asChild>
              <Link to="/signup">
                Créer un compte gratuit
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
