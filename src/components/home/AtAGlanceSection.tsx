// @ts-nocheck
/**
 * AtAGlanceSection — "En bref" + "À qui s’adresse la plateforme ?" + "Comment ça marche ?"
 *
 * Copy strictement issue du brief produit (aucune donnée inventée).
 * Pas de chiffres, pas de prix, pas d'avis, pas de certifications non confirmées.
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, LineChart, Wrench } from 'lucide-react';

const STEPS = [
  {
    icon: Eye,
    title: 'Observer son état émotionnel',
    description:
      'Prenez un instant pour identifier ce que vous ressentez, sans jugement, à l’aide d’outils d’auto-évaluation simples.',
  },
  {
    icon: LineChart,
    title: 'Suivre son évolution dans le temps',
    description:
      'Visualisez l’évolution de votre état émotionnel sur la durée pour mieux comprendre vos déclencheurs et vos progrès.',
  },
  {
    icon: Wrench,
    title: 'Utiliser des outils adaptés selon ses besoins',
    description:
      'Accédez à un ensemble d’exercices et de ressources que vous pouvez mobiliser au quotidien selon votre situation.',
  },
];

const AtAGlanceSection: React.FC = () => {
  return (
    <section
      id="en-bref"
      aria-labelledby="at-a-glance-title"
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En bref */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            En bref
          </p>
          <h2
            id="at-a-glance-title"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            EmotionsCare en quelques mots
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            EmotionsCare est une plateforme numérique de suivi émotionnel et
            d’accompagnement personnel. Elle aide l’utilisateur à mieux
            comprendre son état émotionnel, à suivre son évolution et à accéder
            à des outils adaptés au quotidien.
          </p>
        </div>

        {/* À qui s'adresse la plateforme */}
        <div
          id="pour-qui"
          aria-labelledby="audience-title"
          className="mt-20 max-w-4xl mx-auto text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            À qui s’adresse la plateforme ?
          </p>
          <h2
            id="audience-title"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Pour qui ?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Pour les personnes qui veulent mieux suivre leur état émotionnel,
            structurer leur réflexion et accéder à des outils d’accompagnement
            simples au quotidien.
          </p>
        </div>

        {/* Comment ça marche */}
        <div
          id="comment-ca-marche"
          aria-labelledby="how-it-works-title"
          className="mt-20"
        >
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Comment ça marche ?
            </p>
            <h2
              id="how-it-works-title"
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Trois étapes simples
            </h2>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 list-none">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <li key={title}>
                <Card className="p-6 h-full bg-card border-border hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold"
                    >
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default AtAGlanceSection;
