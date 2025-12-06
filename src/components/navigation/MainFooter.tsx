
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Mail, Phone, Shield } from 'lucide-react';

interface MainFooterProps {
  className?: string;
}

const MainFooter: React.FC<MainFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn("border-t bg-background/80 backdrop-blur-md", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            </div>
            
            {/* Links Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to={routes.public.about()} className="hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/legal/mentions" className="hover:text-foreground transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/legal/privacy" className="hover:text-foreground transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="hover:text-foreground transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="hover:text-foreground transition-colors">
                    Cookies
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

export default MainFooter;
