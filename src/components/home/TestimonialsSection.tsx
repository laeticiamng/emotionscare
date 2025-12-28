/**
 * TestimonialsSection - Témoignages utilisateurs
 * Social proof avec framing interventionnel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, GraduationCap, Stethoscope, Heart } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  category: 'student' | 'nurse' | 'doctor';
  highlight?: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Camille D.",
      role: "Étudiante en médecine, 4ème année",
      content: "Les veilles d'examen, je ne dormais plus. Maintenant j'ai un réflexe : je lance la session \"Arrêt mental\" et en 5 minutes mon cerveau accepte de se poser.",
      rating: 5,
      avatar: "👩‍🎓",
      category: 'student',
      highlight: 'Sommeil retrouvé',
    },
    {
      name: "Thomas R.",
      role: "Interne en chirurgie",
      content: "Entre deux gardes, je n'arrivais pas à récupérer. Le protocole Reset me permet de repartir sans être complètement vidé. C'est devenu mon rituel.",
      rating: 5,
      avatar: "👨‍⚕️",
      category: 'doctor',
      highlight: 'Récupération',
    },
    {
      name: "Marine L.",
      role: "Infirmière en réanimation",
      content: "Après des situations difficiles, je restais bloquée des heures. La session Stop m'aide à sortir de la boucle de pensées.",
      rating: 5,
      avatar: "👩‍⚕️",
      category: 'nurse',
      highlight: 'Gestion du stress',
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'student': return <GraduationCap className="h-3 w-3" />;
      case 'nurse': return <Heart className="h-3 w-3" />;
      case 'doctor': return <Stethoscope className="h-3 w-3" />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="outline">
              <Quote className="h-3 w-3 mr-2" />
              Ce qu'ils en disent
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Ils ont repris le contrôle
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Des étudiants et soignants qui utilisent EmotionsCare au quotidien.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                  <CardContent className="p-6 space-y-4">
                    {/* Rating */}
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-foreground/90 italic leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Highlight Badge */}
                    {testimonial.highlight && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        ✨ {testimonial.highlight}
                      </Badge>
                    )}
                    
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {getCategoryIcon(testimonial.category)}
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
