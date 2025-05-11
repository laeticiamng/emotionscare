
import React from 'react';
import { ThumbsUp } from 'lucide-react';
import CallToAction from './CallToAction';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16 transform transition-all duration-500 hover:bg-primary/10 hover:shadow-lg overflow-hidden relative">
      {/* Élément décoratif animé */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/10 animate-float"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-primary/5 animate-float-delay"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="flex-1 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Améliorez votre bien-être dès aujourd'hui</h2>
          <p className="text-lg mb-6 text-gray-600">
            Rejoignez notre communauté d'utilisateurs qui ont trouvé un meilleur équilibre émotionnel grâce à EmotionsCare.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="w-full md:w-auto">
              <CallToAction type="personal" className="w-full md:w-auto" />
            </div>
            <div className="w-full md:w-auto">
              <CallToAction type="business" className="w-full md:w-auto" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="w-full max-w-md aspect-video bg-gradient-to-br from-primary/50 to-primary/30 rounded-xl flex items-center justify-center transform transition-all duration-500 hover:scale-[1.03] hover:shadow-lg">
            <ThumbsUp className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
