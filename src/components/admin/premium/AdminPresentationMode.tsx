import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPresentationModeProps {
  onExit: () => void;
  playSound?: () => void;
}

export const AdminPresentationMode: React.FC<AdminPresentationModeProps> = ({
  onExit,
  playSound
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Vue d'ensemble du climat émotionnel",
      content: "Les tendances émotionnelles montrent une amélioration constante ce mois-ci"
    },
    {
      title: "Engagement social et collaboration",
      content: "L'interaction entre équipes a augmenté de 27% grâce aux initiatives bien-être"
    },
    {
      title: "Impact de la gamification",
      content: "68% des employés participent activement aux défis hebdomadaires"
    },
    {
      title: "Conclusions et recommandations",
      content: "Les micro-pauses s'avèrent particulièrement efficaces pour maintenir l'équilibre émotionnel"
    }
  ];
  
  const nextSlide = () => {
    if (playSound) playSound();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  const prevSlide = () => {
    if (playSound) playSound();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-background/95 z-50">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            if (playSound) playSound();
            onExit();
          }}
          aria-label="Retour"
        >
          <ArrowLeft />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h1 className="text-4xl font-light mb-6">{slides[currentSlide].title}</h1>
          <p className="text-xl text-muted-foreground">{slides[currentSlide].content}</p>
          
          <div className="mt-32">
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                aria-label="Diapositive précédente"
              >
                <ChevronLeft />
              </Button>
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentSlide 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                aria-label="Diapositive suivante"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
