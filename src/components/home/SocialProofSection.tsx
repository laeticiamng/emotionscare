/**
 * SocialProofSection - Crédibilité, testimonials et trust badges
 * Design premium inspiré 21st.dev avec logo marquee et citation cards
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Shield, Award, Heart, GraduationCap, Building2, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "EmotionsCare m'aide à gérer les moments de tension aux urgences. 3 minutes suffisent pour retrouver ma lucidité.",
    author: "Dr. Sophie M.",
    role: "Urgentiste, CHU",
    rating: 5,
  },
  {
    quote: "En tant qu'étudiante en médecine, les examens me paralysaient. Les exercices de respiration ont tout changé.",
    author: "Amira K.",
    role: "Étudiante en 4ème année",
    rating: 5,
  },
  {
    quote: "J'ai intégré EmotionsCare dans mes recommandations pour les soignants en situation d'épuisement. Résultats remarquables.",
    author: "Pr. Laurent D.",
    role: "Psychiatre, AP-HP",
    rating: 5,
  },
];

const trustBadges = [
  { icon: Shield, label: 'RGPD Conforme' },
  { icon: Award, label: 'HDS Compatible' },
  { icon: GraduationCap, label: 'Validé Neurosciences' },
  { icon: Heart, label: 'Made in France' },
];

const partnerLogos = [
  { name: 'CHU Paris', icon: Building2 },
  { name: 'AP-HP', icon: Stethoscope },
  { name: 'Université de Médecine', icon: GraduationCap },
  { name: 'IFSI Formation', icon: Award },
  { name: 'Ordre des Médecins', icon: Shield },
  { name: 'CHU Paris', icon: Building2 },
  { name: 'AP-HP', icon: Stethoscope },
  { name: 'Université de Médecine', icon: GraduationCap },
];

const TestimonialCard: React.FC<{ testimonial: typeof testimonials[0]; index: number }> = ({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    className="relative bg-card border border-border/50 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 group"
  >
    {/* Quote icon */}
    <div className="absolute -top-3 left-6">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Quote className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
    </div>

    {/* Rating */}
    <div className="flex gap-0.5 mb-4 mt-2" aria-label={`${testimonial.rating} étoiles sur 5`}>
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
      ))}
    </div>

    {/* Quote text */}
    <blockquote className="text-foreground leading-relaxed mb-6 text-sm md:text-base">
      "{testimonial.quote}"
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
        {testimonial.author.charAt(0)}{testimonial.author.split(' ').pop()?.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
  </motion.div>
);

const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/20 overflow-hidden" aria-labelledby="social-proof-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            Témoignages
          </span>
          <h2 id="social-proof-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Ils prennent soin d'eux{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              avec nous
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Des soignants et étudiants en santé utilisent EmotionsCare au quotidien.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16"
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border/50 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Logo marquee - "Ils nous font confiance" */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8"
          >
            Environnements de confiance
          </motion.p>

          {/* Marquee container */}
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-12 items-center"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {partnerLogos.map(({ name, icon: Icon }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 shrink-0 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm font-medium whitespace-nowrap">{name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Founder card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <p className="text-muted-foreground text-sm mb-2">Créée par</p>
          <p className="text-xl font-display font-semibold text-foreground">Laeticia Motongane</p>
          <p className="text-muted-foreground">
            Médecin · Fondatrice d&apos;EmotionsCare · Engagée pour le bien-être des soignants
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SocialProofSection);
