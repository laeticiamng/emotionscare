/**
 * AppleCTASection - Section CTA finale style Apple
 * Grande typographie, minimaliste, impactante
 */

import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Download } from 'lucide-react';

const AppleCTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 md:py-48 lg:py-64 overflow-hidden bg-background"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8 leading-[0.9]"
          >
            Prêt à prendre soin
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
              de vous ?
            </span>
          </motion.h2>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            30 jours d'essai gratuit. Aucune carte bancaire requise.
            <br className="hidden sm:block" />
            Annulez quand vous voulez.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button 
                size="lg" 
                className="group relative overflow-hidden px-12 py-8 text-xl font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-2xl shadow-foreground/20 transition-all duration-500 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Commencer maintenant
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
            
            {/* Lien installation PWA */}
            <Link to="/install">
              <Button 
                variant="outline"
                size="lg" 
                className="group px-8 py-6 text-lg font-medium rounded-full border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Installer l'app
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-16 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              100% confidentiel
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Conforme RGPD
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              Support 24/7
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AppleCTASection);
