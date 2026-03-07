/**
 * SocialProofSection - Crédibilité fondatrice
 */

import React from 'react';
import { motion } from 'framer-motion';

const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30" aria-labelledby="social-proof-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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
