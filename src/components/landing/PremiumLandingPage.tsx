/**
 * PremiumLandingPage - Landing page premium EmotionsCare
 * Design Apple-like: minimaliste, doux, premium
 * Ton: bienveillant, rassurant, humain
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Music, 
  Wind, 
  Sun,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Play
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

// Hero Section
const HeroSection = memo(() => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-landing-cream via-landing-cream/50 to-background">
    {/* Ambient background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-landing-sage/20 blur-[100px]"
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-landing-sky/20 blur-[100px]"
        animate={{ 
          x: [0, -20, 0], 
          y: [0, 30, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-landing-beige/30 blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    <div className="container relative z-10 px-6 py-24 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-sage/10 text-landing-sage-dark text-sm font-medium border border-landing-sage/20">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Votre espace de calme intérieur
          </span>
        </motion.div>

        {/* Main headline - émotionnel, pas descriptif */}
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-landing-text mb-6 leading-[1.1]"
        >
          Quand tout devient{' '}
          <span className="font-medium bg-gradient-to-r from-landing-sage-dark via-landing-sky-dark to-landing-sage-dark bg-clip-text text-transparent">
            trop lourd
          </span>
          ,<br />
          <span className="text-landing-sage-dark font-normal">respire.</span>
        </motion.h1>

        {/* Sous-titre pédagogique */}
        <motion.p 
          variants={fadeInUp}
          className="text-lg sm:text-xl md:text-2xl text-landing-text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          EmotionsCare t'aide à retrouver un apaisement émotionnel en quelques minutes 
          grâce à une expérience personnalisée mêlant musique générée par IA, 
          relaxation guidée et ambiance sensorielle.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/onboarding">
            <Button 
              size="xl" 
              className="bg-landing-sage hover:bg-landing-sage-dark text-white shadow-lg shadow-landing-sage/25 hover:shadow-xl hover:shadow-landing-sage/30 transition-all duration-300 rounded-full px-8 group"
            >
              Commencer mon expérience
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button 
              variant="ghost" 
              size="lg"
              className="text-landing-text-muted hover:text-landing-text hover:bg-landing-beige/50 rounded-full gap-2"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Voir une démo
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          variants={fadeInUp}
          className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-landing-text-muted"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-landing-sage" aria-hidden="true" />
            <span>100% confidentiel</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-landing-sage" aria-hidden="true" />
            <span>Résultats en 3 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-landing-sage" aria-hidden="true" />
            <span>50 000+ utilisateurs apaisés</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
));
HeroSection.displayName = 'HeroSection';

// État émotionnel cards
const emotionalStates = [
  { 
    id: 'stress',
    label: 'Stress',
    description: 'Je me sens submergé(e)',
    icon: Brain,
    color: 'bg-orange-50 text-orange-600 border-orange-100'
  },
  { 
    id: 'anxiety',
    label: 'Anxiété',
    description: 'Mon cœur s\'emballe',
    icon: Heart,
    color: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  { 
    id: 'fatigue',
    label: 'Fatigue mentale',
    description: 'Je n\'arrive plus à penser',
    icon: Wind,
    color: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  { 
    id: 'overload',
    label: 'Surcharge',
    description: 'Trop de choses en tête',
    icon: Sparkles,
    color: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  { 
    id: 'focus',
    label: 'Besoin de focus',
    description: 'Je veux me recentrer',
    icon: Sun,
    color: 'bg-amber-50 text-amber-600 border-amber-100'
  },
];

const EmotionalStateSection = memo(() => (
  <section className="py-24 bg-background">
    <div className="container px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center mb-16"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-landing-text mb-4"
        >
          Comment te sens-tu ?
        </motion.h2>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-landing-text-muted max-w-xl mx-auto"
        >
          Choisis ton état actuel, on s'occupe du reste.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
      >
        {emotionalStates.map((state) => (
          <motion.div key={state.id} variants={scaleIn}>
            <Link to={`/onboarding?state=${state.id}`}>
              <div className={`group p-6 rounded-2xl border-2 ${state.color} hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer text-center`}>
                <state.icon className="w-8 h-8 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium mb-1">{state.label}</h3>
                <p className="text-xs opacity-70">{state.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));
EmotionalStateSection.displayName = 'EmotionalStateSection';

// How it works
const steps = [
  {
    number: '01',
    title: 'Exprime ton état',
    description: 'Dis-nous comment tu te sens. Notre IA comprend tes émotions et adapte l\'expérience.',
    icon: Heart
  },
  {
    number: '02',
    title: 'Laisse-toi guider',
    description: 'Une musique générée par IA, une ambiance lumineuse et des exercices de respiration personnalisés.',
    icon: Music
  },
  {
    number: '03',
    title: 'Retrouve le calme',
    description: 'En quelques minutes, ressens l\'apaisement. Ton corps et ton esprit se synchronisent.',
    icon: Sun
  }
];

const HowItWorksSection = memo(() => (
  <section className="py-24 bg-gradient-to-b from-background to-landing-beige/30">
    <div className="container px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center mb-16"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-landing-text mb-4"
        >
          Comment ça marche ?
        </motion.h2>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-landing-text-muted max-w-xl mx-auto"
        >
          Trois étapes simples vers ton apaisement.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {steps.map((step, index) => (
          <motion.div 
            key={step.number} 
            variants={fadeInUp}
            className="relative"
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-landing-sage/30 to-transparent" />
            )}
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-landing-beige shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-landing-sage/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-landing-sage-dark" aria-hidden="true" />
                </div>
                <span className="text-4xl font-light text-landing-sage/30">{step.number}</span>
              </div>
              <h3 className="text-xl font-medium text-landing-text mb-3">{step.title}</h3>
              <p className="text-landing-text-muted leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));
HowItWorksSection.displayName = 'HowItWorksSection';

// Benefits section
const benefits = [
  {
    title: 'Moins de stress',
    stat: '78%',
    description: 'des utilisateurs ressentent une baisse du stress dès la première session'
  },
  {
    title: 'Meilleur sommeil',
    stat: '65%',
    description: "retrouvent un sommeil réparateur après une semaine d'utilisation"
  },
  {
    title: 'Plus de sérénité',
    stat: '3 min',
    description: 'suffisent pour retrouver un état de calme intérieur'
  },
  {
    title: 'Confiance retrouvée',
    stat: '92%',
    description: 'recommandent EmotionsCare à leurs proches'
  }
];

const BenefitsSection = memo(() => (
  <section className="py-24 bg-landing-sage-dark text-white">
    <div className="container px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center mb-16"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-light mb-4"
        >
          Des résultats concrets
        </motion.h2>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-white/70 max-w-xl mx-auto"
        >
          Ce que nos utilisateurs ressentent vraiment.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
      >
        {benefits.map((benefit) => (
          <motion.div 
            key={benefit.title}
            variants={scaleIn}
            className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="text-4xl md:text-5xl font-light text-landing-sky mb-2">{benefit.stat}</div>
            <h3 className="font-medium mb-2">{benefit.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));
BenefitsSection.displayName = 'BenefitsSection';

// Credibility section
const CredibilitySection = memo(() => (
  <section className="py-24 bg-gradient-to-b from-landing-beige/30 to-background">
    <div className="container px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-landing-text mb-4">
            Une approche fondée sur la science
          </h2>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-landing-beige text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-landing-sage/10 flex items-center justify-center">
              <Music className="w-6 h-6 text-landing-sage-dark" aria-hidden="true" />
            </div>
            <h3 className="font-medium text-landing-text mb-2">Musicothérapie</h3>
            <p className="text-sm text-landing-text-muted">
              Inspirée des protocoles de musicothérapie validés cliniquement
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-landing-beige text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-landing-sky/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-landing-sky-dark" aria-hidden="true" />
            </div>
            <h3 className="font-medium text-landing-text mb-2">Neurosciences</h3>
            <p className="text-sm text-landing-text-muted">
              Basée sur les recherches en neurosciences affectives
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-landing-beige text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-landing-beige flex items-center justify-center">
              <Heart className="w-6 h-6 text-landing-text" aria-hidden="true" />
            </div>
            <h3 className="font-medium text-landing-text mb-2">Cohérence cardiaque</h3>
            <p className="text-sm text-landing-text-muted">
              Techniques de respiration pour réguler le système nerveux
            </p>
          </div>
        </motion.div>

        <motion.p 
          variants={fadeInUp}
          className="text-center text-sm text-landing-text-muted mt-8 max-w-2xl mx-auto"
        >
          EmotionsCare n&apos;est pas un dispositif médical. Notre plateforme est conçue comme un outil de bien-être 
          et ne se substitue pas à un accompagnement médical ou psychologique.
        </motion.p>
      </motion.div>
    </div>
  </section>
));
CredibilitySection.displayName = 'CredibilitySection';

// Final CTA Section
const CTASection = memo(() => (
  <section className="py-24 bg-gradient-to-b from-background to-landing-cream">
    <div className="container px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-landing-text mb-6"
        >
          Prêt(e) à retrouver le calme ?
        </motion.h2>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-landing-text-muted mb-10"
        >
          Commence ton expérience émotionnelle maintenant. <br />
          C'est gratuit, sans engagement.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link to="/onboarding">
            <Button 
              size="xl" 
              className="bg-landing-sage hover:bg-landing-sage-dark text-white shadow-lg shadow-landing-sage/25 hover:shadow-xl hover:shadow-landing-sage/30 transition-all duration-300 rounded-full px-10 group"
            >
              Commencer mon expérience émotionnelle
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
));
CTASection.displayName = 'CTASection';

// Footer
const Footer = memo(() => (
  <footer className="py-12 bg-landing-cream border-t border-landing-beige">
    <div className="container px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <Link to="/" className="text-xl font-semibold text-landing-text hover:text-landing-sage-dark transition-colors">
            EmotionsCare
          </Link>
          <p className="text-sm text-landing-text-muted mt-1">
            Ton espace de calme intérieur
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-landing-text-muted">
          <Link to="/about" className="hover:text-landing-text transition-colors">À propos</Link>
          <Link to="/faq" className="hover:text-landing-text transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-landing-text transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-landing-text transition-colors">Confidentialité</Link>
          <Link to="/legal/terms" className="hover:text-landing-text transition-colors">CGU</Link>
        </nav>
      </div>
      <div className="mt-8 pt-6 border-t border-landing-beige/50 text-center text-xs text-landing-text-muted">
        © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
      </div>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

// Main component
const PremiumLandingPage: React.FC = () => {
  usePageSEO({
    title: 'EmotionsCare - Retrouve le calme en quelques minutes',
    description: 'Plateforme de bien-être émotionnel basée sur l\'IA et la musicothérapie. Gère le stress, l\'anxiété et la charge mentale grâce à des expériences personnalisées.',
    keywords: 'bien-être émotionnel, gestion stress, anxiété, musicothérapie, IA, relaxation, calme, méditation, respiration',
    ogType: 'website',
    ogImage: '/og-image.svg',
    canonical: 'https://emotionscare.app/',
    includeOrganization: true,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'EmotionsCare',
      url: 'https://emotionscare.app',
      applicationCategory: 'HealthApplication',
      description: 'Plateforme de bien-être émotionnel avec IA et musicothérapie personnalisée.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Essai gratuit'
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-landing-cream/80 backdrop-blur-md border-b border-landing-beige/50">
        <div className="container px-6 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-semibold text-landing-text hover:text-landing-sage-dark transition-colors"
          >
            EmotionsCare
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-landing-text-muted hover:text-landing-text">
                Se connecter
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button size="sm" className="bg-landing-sage hover:bg-landing-sage-dark text-white rounded-full">
                Commencer
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Main content */}
      <main>
        <HeroSection />
        <EmotionalStateSection />
        <HowItWorksSection />
        <BenefitsSection />
        <CredibilitySection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default PremiumLandingPage;
