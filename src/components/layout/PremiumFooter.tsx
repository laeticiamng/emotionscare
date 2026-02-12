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
                <a href="https://twitter.com/emotionscare" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://linkedin.com/company/emotionscare" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://instagram.com/emotionscare" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
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
