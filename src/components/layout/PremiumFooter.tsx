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
                  <a href="mailto:contact@emotions-care.com" className="hover:text-foreground transition-colors">
                    contact@emotions-care.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href="tel:+33123456789" className="hover:text-foreground transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Données sécurisées & RGPD</span>
                </li>
              </ul>
              
              {/* Social links */}
              <div className="mt-4 flex space-x-3">
                <a href="https://twitter.com" className="rounded-full bg-background border p-2 hover:bg-primary/10 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="https://facebook.com" className="rounded-full bg-background border p-2 hover:bg-primary/10 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="https://instagram.com" className="rounded-full bg-background border p-2 hover:bg-primary/10 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
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
