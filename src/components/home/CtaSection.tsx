import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Building2, ArrowRight, CheckCircle, Users, Shield, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const benefits = [
    { icon: CheckCircle, text: "Essai gratuit de 30 jours" },
    { icon: Shield, text: "Données 100% sécurisées" },
    { icon: Users, text: "Support client 24/7" },
    { icon: Award, text: "Certifié ISO 27001" }
  ];

  const testimonials = [
    {
      name: "Dr. Marie Dubois",
      role: "Psychologue clinicienne",
      content: "EmotionsCare a révolutionné ma pratique. Mes patients montrent des progrès remarquables.",
      rating: 5
    },
    {
      name: "Jean-Pierre Martin",
      role: "DRH chez TechCorp",
      content: "Le bien-être de nos équipes s'est considérablement amélioré depuis l'adoption de la plateforme.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh-gradient opacity-30" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 glass-effect border-primary/20">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            Rejoignez la révolution du bien-être
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Prêt à transformer votre vie ?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Rejoignez plus de 10 000 utilisateurs qui ont déjà choisi EmotionsCare 
            pour améliorer leur bien-être émotionnel et mental.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/20"
              >
                <benefit.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main CTA Cards */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20"
        >
          {/* Particuliers Card */}
          <Card className="group relative overflow-hidden border-2 border-pink-200/50 hover:border-pink-300/70 transition-all duration-500 hover:shadow-2xl hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/10 group-hover:from-pink-500/10 group-hover:to-purple-500/15 transition-all duration-500" />
            
            <CardContent className="relative p-8 text-center">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-glow"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Espace Particulier
              </h3>
              
              <p className="text-muted-foreground mb-8 text-lg">
                Découvrez votre potentiel émotionnel avec nos outils personnalisés 
                d'analyse, de coaching IA et de thérapies innovantes.
              </p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  'Scan émotionnel en temps réel',
                  'Coach IA personnel 24/7',
                  'Musicothérapie adaptative',
                  'Journal de bien-être intelligent',
                  'Communauté bienveillante'
                ].map((feature, index) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/b2c/login')}
                size="lg"
                className="group w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:animate-heartbeat" />
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Entreprises Card */}
          <Card className="group relative overflow-hidden border-2 border-blue-200/50 hover:border-blue-300/70 transition-all duration-500 hover:shadow-2xl hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/10 group-hover:from-blue-500/10 group-hover:to-cyan-500/15 transition-all duration-500" />
            
            <CardContent className="relative p-8 text-center">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: -5 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-glow"
              >
                <Building2 className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Solutions Entreprise
              </h3>
              
              <p className="text-muted-foreground mb-8 text-lg">
                Optimisez le bien-être de vos équipes avec nos solutions RH 
                complètes, analytics avancés et support dédié.
              </p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  'Dashboard RH complet',
                  'Analytics et rapports détaillés',
                  'Gestion multi-équipes',
                  'API et intégrations',
                  'Support premium dédié'
                ].map((feature, index) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/b2b/selection')}
                size="lg"
                className="group w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Demander une démo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-foreground">
            Ce que disent nos utilisateurs
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={shouldReduceMotion ? {} : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 glass-effect border-primary/20 hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-0">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <CheckCircle key={i} className="w-5 h-5 text-primary" />
                      ))}
                    </div>
                    
                    <p className="text-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="border-t border-border/50 pt-4">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;