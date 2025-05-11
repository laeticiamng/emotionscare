
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="relative py-20 px-4 rounded-3xl bg-gradient-to-br from-white to-[#F0F9FF] mb-16 overflow-hidden transform transition-all duration-700 hover:shadow-xl">
      <div 
        className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"
        style={{ opacity: "0.4", mixBlendMode: "overlay" }}
      />
      
      {/* Cercles d'ambiance animés */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-100/30 to-blue-100/30 blur-[70px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-rose-100/30 to-amber-100/30 blur-[70px] animate-pulse-slow animation-delay-2000"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-gray-900 animate-fade-in">
          Prenez soin de votre <span className="text-primary animate-gradient-text">état émotionnel</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
          Votre journal, votre musique, votre calme. Trouvez l'équilibre dont vous avez besoin.
        </p>
        
        {isAuthenticated && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <Link to="/dashboard">
                Accéder à mon espace
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:-translate-y-1">
              <Link to="/scan">
                Faire un scan émotionnel
                <Heart className="h-4 w-4 ml-2 transition-all group-hover:scale-110 group-hover:text-rose-500" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
