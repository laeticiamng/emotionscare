/**
 * SocialProofSection - Témoignages et crédibilité fondatrice
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Médecin urgentiste, CHU Amiens',
    quote: 'Entre deux gardes, les protocoles de 3 minutes me permettent de décompresser sans perdre de temps. Le scanner émotionnel m\'aide à prendre conscience de mon état avant de reprendre.',
    rating: 5,
  },
  {
    name: 'Julie L.',
    role: 'Infirmière en EHPAD',
    quote: 'La musicothérapie et la respiration guidée sont devenus mes indispensables après les journées difficiles. Je recommande à toute mon équipe.',
    rating: 5,
  },
  {
    name: 'Thomas R.',
    role: 'Étudiant en 4ème année de médecine',
    quote: 'Pendant les révisions et les stages, le coach Nyvée m\'a aidé à gérer l\'anxiété. C\'est comme avoir un soutien disponible 24h/24.',
    rating: 5,
  },
];

const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30" aria-labelledby="social-proof-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Témoignages
          </span>
          <h2 id="social-proof-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Ils prennent soin d&apos;eux
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Retours de professionnels et étudiants en santé qui utilisent EmotionsCare au quotidien.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-6 right-6" aria-hidden="true" />
              <div className="flex gap-1 mb-4" aria-label={`${t.rating} étoiles sur 5`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <p className="text-muted-foreground text-sm mb-2">Créée par</p>
          <p className="text-xl font-semibold text-foreground">Laeticia Motongane</p>
          <p className="text-muted-foreground">
            Médecin · Fondatrice d&apos;EmotionsCare · Engagée pour le bien-être des soignants
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
