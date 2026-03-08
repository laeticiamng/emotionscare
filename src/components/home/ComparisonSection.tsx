/**
 * ComparisonSection - Comparaison EmotionsCare vs alternatives
 * Pattern "Comparison" inspiré 21st.dev
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonRow {
  feature: string;
  emotionscare: 'yes' | 'no' | 'partial';
  traditional: 'yes' | 'no' | 'partial';
  apps: 'yes' | 'no' | 'partial';
}

const rows: ComparisonRow[] = [
  { feature: 'Protocoles en 3 minutes', emotionscare: 'yes', traditional: 'no', apps: 'partial' },
  { feature: 'Validé par les neurosciences', emotionscare: 'yes', traditional: 'yes', apps: 'no' },
  { feature: 'Conçu pour les soignants', emotionscare: 'yes', traditional: 'no', apps: 'no' },
  { feature: 'Disponible 24/7', emotionscare: 'yes', traditional: 'no', apps: 'yes' },
  { feature: 'Coach IA personnalisé', emotionscare: 'yes', traditional: 'no', apps: 'partial' },
  { feature: 'Musicothérapie intégrée', emotionscare: 'yes', traditional: 'no', apps: 'no' },
  { feature: 'Confidentiel & RGPD', emotionscare: 'yes', traditional: 'yes', apps: 'partial' },
  { feature: 'Gratuit pour débuter', emotionscare: 'yes', traditional: 'no', apps: 'yes' },
];

const StatusIcon: React.FC<{ status: 'yes' | 'no' | 'partial' }> = ({ status }) => {
  if (status === 'yes') return <Check className="h-5 w-5 text-primary" aria-label="Oui" />;
  if (status === 'no') return <X className="h-5 w-5 text-destructive/60" aria-label="Non" />;
  return <Minus className="h-5 w-5 text-muted-foreground" aria-label="Partiel" />;
};

const ComparisonSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/20" aria-labelledby="comparison-title">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 id="comparison-title" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pourquoi choisir{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EmotionsCare ?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Comparez notre approche aux alternatives existantes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 md:p-5 text-muted-foreground font-medium">Fonctionnalité</th>
                  <th className="p-4 md:p-5 text-center">
                    <span className="font-bold text-foreground text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      EmotionsCare
                    </span>
                  </th>
                  <th className="p-4 md:p-5 text-center text-muted-foreground font-medium">Suivi psy classique</th>
                  <th className="p-4 md:p-5 text-center text-muted-foreground font-medium">Apps bien-être</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-border/30 last:border-0",
                      "hover:bg-muted/30 transition-colors"
                    )}
                  >
                    <td className="p-4 md:p-5 text-foreground font-medium">{row.feature}</td>
                    <td className="p-4 md:p-5">
                      <div className="flex justify-center"><StatusIcon status={row.emotionscare} /></div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex justify-center"><StatusIcon status={row.traditional} /></div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex justify-center"><StatusIcon status={row.apps} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ComparisonSection);
