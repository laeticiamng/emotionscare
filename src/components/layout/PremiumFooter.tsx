// @ts-nocheck

import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Mail, Phone, Shield, Info, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumFooterProps {
  className?: string;
}

const PremiumFooter: React.FC<PremiumFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "border-t bg-background/80 backdrop-blur-md",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Interactive Footer Banner */}
        <div className="py-8 px-4 sm:px-6 my-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Découvrez votre équilibre émotionnel</h3>
              <p className="text-muted-foreground">Accédez à tous les outils pour votre bien-être mental.</p>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link to={routes.public.about()}>
                  Fonctionnalités
                  <Info className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild>
                <Link to={routes.consumer.dashboard()}>
                  Essayer maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div>
              <Link to={routes.public.home()} className="flex items-center space-x-2">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">EC</span>
                </motion.div>
                <span className="text-xl font-semibold">EmotionsCare</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Votre compagnon pour l'équilibre émotionnel et le bien-être mental au quotidien.
              </p>
              
              {/* Daily Mood */}
              <div className="mt-6 p-3 rounded-lg bg-background border">
                <p className="text-xs font-medium text-muted-foreground">Climat émotionnel</p>
                <div className="flex items-center mt-1">
                  <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">Enthousiaste & positif</span>
                </div>
              </div>
            </div>
            
            {/* Links Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">À propos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to={routes.public.about()} className="hover:text-foreground transition-colors">
                    Notre mission
                  </Link>
                </li>
                <li>
                  <Link to={routes.public.contact()} className="hover:text-foreground transition-colors">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link to={routes.public.about()} className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to={routes.public.contact()} className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">Informations légales</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/legal/mentions" className="hover:text-foreground transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="hover:text-foreground transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link to="/legal/sales" className="hover:text-foreground transition-colors">
                    Conditions de vente
                  </Link>
                </li>
                <li>
                  <Link to="/legal/privacy" className="hover:text-foreground transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="hover:text-foreground transition-colors">
                    Politique cookies
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:contact@emotionscare.com" className="hover:text-foreground transition-colors">
                    contact@emotionscare.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Données sécurisées & RGPD</span>
                </li>
              </ul>
              
              {/* Social links */}
              <div className="mt-4 flex space-x-3">
                <span className="text-xs text-muted-foreground italic">Réseaux sociaux — bientôt disponible</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} EmotionsCare. Tous droits réservés.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-xs text-muted-foreground flex items-center">
                Fait avec <Heart className="h-3 w-3 mx-1 text-red-500" /> en France
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
