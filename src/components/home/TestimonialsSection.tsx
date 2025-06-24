
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Marie Laurent',
    role: 'Médecin généraliste',
    content: 'EmotionsCare a révolutionné ma pratique. Je peux maintenant mieux accompagner mes patients dans leur bien-être émotionnel.',
    rating: 5
  },
  {
    name: 'Thomas Bernard',
    role: 'DRH, TechCorp',
    content: 'Depuis l\'implémentation d\'EmotionsCare, nous avons observé une réduction de 40% du stress au travail dans nos équipes.',
    rating: 5
  },
  {
    name: 'Sophie Dubois',
    role: 'Psychologue',
    content: 'Un outil formidable qui complète parfaitement mon travail thérapeutique. L\'IA est étonnamment précise.',
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-muted-foreground">
            Plus de 15,000 professionnels utilisent EmotionsCare
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
