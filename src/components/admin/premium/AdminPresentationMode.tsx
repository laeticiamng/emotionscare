
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, DownloadCloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminPresentationModeProps {
  onExit: () => void;
  playSound?: () => void;
}

const presentationSlides = [
  {
    id: 'climate',
    title: 'Climat émotionnel',
    subtitle: 'Vision globale de l\'entreprise',
    content: 'Évolution positive sur le dernier trimestre (+4 points)',
    highlight: '76% score bien-être global',
    image: '/images/mood-chart-presentation.svg',
    color: 'from-blue-500/30 to-purple-500/30',
    quote: 'La qualité de vie au travail est devenue un indicateur stratégique majeur.'
  },
  {
    id: 'social',
    title: 'Lien social',
    subtitle: 'Interactions et engagement',
    content: 'Croissance significative des échanges collaboratifs',
    highlight: '+23% d\'interactions mensuelles',
    image: '/images/social-network-presentation.svg',
    color: 'from-purple-500/30 to-pink-500/30',
    quote: 'Le sentiment d\'appartenance se renforce par les connexions quotidiennes.'
  },
  {
    id: 'balance',
    title: 'Équilibre vie pro/perso',
    subtitle: 'Facteur clé de performance',
    content: 'Réduction du stress perçu et amélioration de la concentration',
    highlight: '-12% de fatigue chronique signalée',
    image: '/images/balance-presentation.svg',
    color: 'from-emerald-500/30 to-blue-500/30',
    quote: 'L\'équilibre n\'est pas un état à atteindre, mais une dynamique à cultiver.'
  }
];

export const AdminPresentationMode: React.FC<AdminPresentationModeProps> = ({
  onExit,
  playSound
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleNext = () => {
    if (playSound) playSound();
    setCurrentSlide((prev) => (prev + 1) % presentationSlides.length);
  };
  
  const handlePrevious = () => {
    if (playSound) playSound();
    setCurrentSlide((prev) => (prev - 1 + presentationSlides.length) % presentationSlides.length);
  };
  
  const slide = presentationSlides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/50">
        <h2 className="text-white text-lg">Mode Présentation</h2>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1 text-white border-white/20 bg-white/5 hover:bg-white/20 hover:text-white"
            onClick={() => playSound && playSound()}
          >
            <DownloadCloud size={16} />
            <span>Exporter</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 hover:text-white"
            onClick={onExit}
          >
            <X />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex">
        {/* Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white z-10"
          onClick={handlePrevious}
        >
          <ChevronLeft size={24} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white z-10"
          onClick={handleNext}
        >
          <ChevronRight size={24} />
        </Button>
        
        {/* Current slide */}
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center px-12 relative overflow-hidden"
          style={{ 
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)` 
          }}
        >
          {/* Background gradient */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-20",
              slide.color
            )} 
          />
          
          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center max-w-2xl z-10"
          >
            <h2 className="text-white text-4xl mb-3 font-light tracking-tight">
              {slide.title}
            </h2>
            <p className="text-gray-300 mb-10">{slide.subtitle}</p>
            
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left">
                  <p className="text-white text-lg mb-4">{slide.content}</p>
                  <p className="text-2xl font-semibold text-white">{slide.highlight}</p>
                </div>
                <div className="w-40 h-40 bg-white/5 rounded-lg flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.02, 1],
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {slide.image ? (
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-32 h-32 object-contain"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg" />
                    )}
                  </motion.div>
                </div>
              </div>
            </Card>
            
            <div className="mt-10">
              <p className="text-white/80 text-lg italic">"{slide.quote}"</p>
            </div>
          </motion.div>
          
          {/* Pagination dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            {presentationSlides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-6' : 'bg-white/30'
                }`}
                onClick={() => {
                  if (playSound) playSound();
                  setCurrentSlide(index);
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
