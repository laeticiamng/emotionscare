// @ts-nocheck
/**
 * AppleHeroSection - Hero révolutionnaire style Apple
 * Design minimaliste, typographie impactante, animations fluides
 */

import React, { memo, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const HeroScene3D = lazy(() => import('@/components/3d/HeroScene3D'));

const AppleHeroSection: React.FC = () => {
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

  // Text reveal animation — grouped for reading flow
  const words = ["Reprenez votre souffle,", "même au cœur du soin."];
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background noise-texture"
    >
      {/* Immersive 3D background — replaces flat gradient orbs */}
      <Suspense fallback={
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-gradient-radial from-accent/15 via-accent/5 to-transparent rounded-full blur-3xl" />
        </div>
      }>
        <HeroScene3D />
      </Suspense>

      <motion.div 
        ref={heroRef}
        style={{ y: ySpring, opacity: opacitySpring, scale: scaleSpring }}
        className="container relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow - subtle intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Pour ceux qui prennent soin des autres
            </span>
          </motion.div>

          {/* Main headline - word by word reveal */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6 px-2 sm:px-0">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + i * 0.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={cn(
                  "inline-block mr-[0.25em]",
                  i === 0 && "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift",
                  i === words.length - 1 && "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block mt-2"
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
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-4 font-light leading-relaxed"
          >
            Respiration guidée, coaching IA et exercices anti-stress
            <span className="text-foreground font-medium"> pensés pour vous, soignants.</span>
          </motion.p>

          {/* Concrete value prop */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="text-base sm:text-lg text-muted-foreground/80 max-w-xl mx-auto mb-8"
          >
            Des exercices courts entre deux consultations. Sans rendez-vous, sans jugement. <span className="text-primary font-medium">Plan gratuit, sans carte bancaire.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={isAuthenticated ? '/app/home' : '/signup'}>
              <Button
                size="lg"
                className="group relative overflow-hidden px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-2xl shadow-foreground/20 transition-all duration-500 hover:scale-105 hover:shadow-foreground/30 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAuthenticated ? 'Accéder à mon espace' : 'Commencer gratuitement'}
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
              onClick={() => {
                const el = document.getElementById('how-it-works-heading');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-medium text-muted-foreground hover:text-foreground rounded-full w-full sm:w-auto"
            >
              <ChevronDown className="h-5 w-5 mr-2 group-hover:translate-y-1 transition-transform" />
              Comment ça marche
            </Button>
          </motion.div>

          {/* Social proof - minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 sm:mt-16 pt-8 sm:pt-16 border-t border-border/50"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 items-center">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/50">
                Exercices de 2 à 5 minutes
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/50">
                Compte créé en 30 secondes
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/50">
                Créé par une médecin 🇫🇷
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
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
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
