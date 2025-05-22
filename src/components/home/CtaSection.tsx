
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Brain, Shield } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Prenez soin de votre bien-être émotionnel</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Créez un compte gratuit et commencez votre parcours vers l'équilibre émotionnel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 shadow-sm border"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${feature.iconBg} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <Link to={feature.link} className="text-primary flex items-center hover:underline">
                {feature.linkText} <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg">
            <Link to="/register">
              Créer un compte gratuit
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Aucune carte de crédit requise. Commencez gratuitement dès aujourd'hui.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  {
    title: "Suivi émotionnel",
    description: "Suivez et analysez vos émotions quotidiennes pour mieux comprendre vos schémas émotionnels.",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    iconBg: "bg-red-100 dark:bg-red-900/20",
    link: "/scan",
    linkText: "Découvrir le scan émotionnel"
  },
  {
    title: "Intelligence émotionnelle",
    description: "Développez votre intelligence émotionnelle grâce à nos outils personnalisés.",
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    link: "/journal",
    linkText: "Explorer le journal"
  },
  {
    title: "Confidentialité garantie",
    description: "Vos données émotionnelles sont cryptées et protégées. Votre confidentialité est notre priorité.",
    icon: <Shield className="h-6 w-6 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/20",
    link: "/privacy",
    linkText: "Notre politique de confidentialité"
  }
];

export default CtaSection;
