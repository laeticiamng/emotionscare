/**
 * AppleHeroSection - Hero révolutionnaire style Apple
 * Design minimaliste, typographie impactante, animations fluides
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const AppleHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const ySpring = useSpring(y, springConfig);
  const opacitySpring = useSpring(opacity, springConfig);
  const scaleSpring = useSpring(scale, springConfig);

  // Text reveal animation
  const words = ["Révolutionnez", "votre", "bien-être", "émotionnel."];
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-background"
      style={{ minHeight: '100dvh' }}
    >
      {/* Gradient orbs - subtle and premium, responsive sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-gradient-radial from-accent/15 via-accent/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear",
            delay: 2 
          }}
        />
      </div>

      <motion.div 
        ref={heroRef}
        style={{ y: ySpring, opacity: opacitySpring, scale: scaleSpring }}
        className="container relative z-10 px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow - subtle intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Pour ceux qui prennent soin des autres
            </span>
          </motion.div>

          {/* Main headline - word by word reveal */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] mb-6 sm:mb-8 px-2 sm:px-0">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={cn(
                  "inline-block mr-[0.25em]",
                  i === 0 && "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift"
                )}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light leading-relaxed"
          >
            La première plateforme de régulation émotionnelle
            <span className="text-foreground font-medium"> conçue par et pour les soignants.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <Button 
                size="lg" 
                className="group relative overflow-hidden px-8 py-7 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-2xl shadow-foreground/20 transition-all duration-500 hover:scale-105 hover:shadow-foreground/30"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commencer gratuitement
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => navigate('/features')}
              className="group px-8 py-7 text-lg font-medium text-muted-foreground hover:text-foreground rounded-full"
            >
              <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Découvrir
            </Button>
          </motion.div>

          {/* Social proof - minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-16 pt-16 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Conçue avec des soignants, pour les soignants
            </p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground tracking-wide px-4 py-2 rounded-full bg-muted/50">
                Approche scientifique
              </span>
              <span className="text-sm font-medium text-muted-foreground tracking-wide px-4 py-2 rounded-full bg-muted/50">
                Données protégées
              </span>
              <span className="text-sm font-medium text-muted-foreground tracking-wide px-4 py-2 rounded-full bg-muted/50">
                Made in France
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-muted-foreground/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(AppleHeroSection);
