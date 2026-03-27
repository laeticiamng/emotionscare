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
    question: "C'est pour quel genre de moment ?",
    answer:
      "Quand ton cerveau ne veut pas s'arrêter. Quand tu sens une montée d'anxiété. Quand tu es épuisé mais que tu n'arrives pas à dormir. Quand tu dois continuer ta journée mais que tu es au bord de l'effondrement. Ce ne sont pas des exercices de relaxation. Ce sont des interventions pour des moments précis.",
    icon: '🎯',
  },
  {
    id: 2,
    category: 'Quand utiliser',
    question: 'Combien de temps ça prend ?',
    answer:
      "Entre 2 et 5 minutes. On ne te demande pas de méditer 30 minutes. Une session Stop prend 2 minutes. Un Reset en prend 3. L'objectif n'est pas de t'occuper, c'est de produire un effet. Rapidement.",
    icon: '⏱️',
  },
  {
    id: 3,
    category: 'Quand utiliser',
    question: 'Est-ce que ça marche vraiment ?',
    answer:
      "Tu le sentiras. Pas besoin de croire à quoi que ce soit. Le protocole agit sur ton système nerveux, pas sur tes croyances. Si après 2 minutes tu ne sens rien de différent, c'est que ce n'était pas le bon protocole pour ce moment-là. On t'en proposera un autre.",
    icon: '✨',
  },
  {
    id: 4,
    category: 'Comment ça marche',
    question: "C'est quoi exactement ?",
    answer:
      "Des protocoles audio-visuels qui agissent sur ton système nerveux. On n'explique pas comment pendant que tu les utilises. Tu lances, tu laisses faire, tu observes ce qui change. L'explication viendra après si tu la veux.",
    icon: '🧠',
  },
  {
    id: 5,
    category: 'Comment ça marche',
    question: 'Et la musique là-dedans ?',
    answer:
      "La musique n'est pas le produit. C'est le véhicule. Tu n'écoutes pas de la musique pour te détendre. Tu reçois un signal qui recalibre ton état. La différence : une playlist te distrait, un protocole te transforme.",
    icon: '🎵',
  },
  {
    id: 6,
    category: 'Sécurité',
    question: 'Mes données sont protégées ?',
    answer:
      "Oui. Chiffrement niveau bancaire, conformité RGPD totale. Mais surtout : on ne stocke rien d'inutile. Ton historique t'appartient. Tu peux tout supprimer à tout moment. On n'a pas besoin de tes données pour que ça fonctionne.",
    icon: '🔒',
  },
  {
    id: 7,
    category: 'Accès',
    question: "C'est gratuit ?",
    answer:
      "30 jours d'essai sans carte bancaire. Ensuite c'est un abonnement. Mais réfléchis : combien te coûtent tes nuits blanches ? Tes crises d'anxiété ? Tes journées où tu n'arrives pas à fonctionner ? Le vrai coût, c'est de ne rien faire.",
    icon: '💳',
  },
  {
    id: 8,
    category: 'Accès',
    question: 'Je peux annuler quand je veux ?',
    answer:
      "Oui. Sans justification. Sans frais cachés. On préfère que tu reviennes parce que ça te manque, pas parce que tu es coincé.",
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
              Ce que tu te demandes probablement
            </h2>
            <p className="text-lg text-muted-foreground">
              Pas de jargon. Des réponses directes.
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
                  Aucune question trouvée. Essaie autre chose.
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
              <Link to="/app/scan">
                Lancer une session maintenant
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
