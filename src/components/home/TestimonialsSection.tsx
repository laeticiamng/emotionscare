
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Dr. Marie Dubois",
      role: "Médecin généraliste",
      content: "EmotionsCare m'a aidée à mieux gérer le stress quotidien de ma pratique. Le coach IA est remarquablement pertinent.",
      rating: 5,
      avatar: "MD"
    },
    {
      name: "Thomas Martin",
      role: "Infirmier en réanimation",
      content: "Les sessions de méditation guidée sont parfaites pour décompresser après des journées difficiles. Je recommande vivement.",
      rating: 5,
      avatar: "TM"
    },
    {
      name: "Dr. Sophie Leroux",
      role: "Psychiatre",
      content: "Une plateforme innovante qui comprend vraiment les défis du secteur médical. Les outils d'analyse sont très utiles.",
      rating: 5,
      avatar: "SL"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les témoignages de professionnels de santé qui utilisent EmotionsCare
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
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
