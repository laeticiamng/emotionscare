
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="relative py-20 px-4 rounded-3xl bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background/80 dark:to-primary/5 mb-16 overflow-hidden transform transition-all duration-700 hover:shadow-xl">
      <div 
        className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"
        style={{ opacity: "0.4", mixBlendMode: "overlay" }}
      />
      
      {/* Cercles d'ambiance animés */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-100/30 to-blue-100/30 dark:from-purple-900/20 dark:to-blue-900/20 blur-[70px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-rose-100/30 to-amber-100/30 dark:from-rose-900/20 dark:to-amber-900/20 blur-[70px] animate-pulse-slow animation-delay-2000"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Prenez soin de votre <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/70">état émotionnel</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Votre journal, votre musique, votre calme. Trouvez l'équilibre dont vous avez besoin.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isAuthenticated ? (
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <Link to="/dashboard">
                Accéder à mon espace
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <Link to="/login" className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Espace Personnel
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <Link to="/business" className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Espace Entreprise
                </Link>
              </Button>
            </>
          )}
          
          {isAuthenticated && (
            <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:-translate-y-1">
              <Link to="/scan">
                Faire un scan émotionnel
                <Heart className="h-4 w-4 ml-2 transition-all group-hover:scale-110 group-hover:text-rose-500" />
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
