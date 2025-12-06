// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/theme';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Mail, 
  Phone, 
  Shield, 
  Clock, 
  Calendar,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';

const EnhancedFooter: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  
  // Obtenir l'heure locale au format hh:mm
  const getLocalTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Obtenir la date au format localisé
  const getLocalDate = () => {
    const now = new Date();
    return now.toLocaleDateString([], { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  return (
    <footer className={cn(
      "border-t transition-colors duration-300 mt-auto",
      isDarkMode 
        ? "bg-background/90 text-foreground" 
        : "bg-background/80 text-foreground"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo & About Column */}
          <div className="space-y-4">
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
            
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre compagnon pour l'équilibre émotionnel et le bien-être mental au quotidien.
            </p>
            
            {/* Date & Time - Interactive Element */}
            <div className="pt-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{getLocalTime()}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{getLocalDate()}</span>
              </div>
            </div>
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
                <Link to={routes.public.services()} className="hover:text-foreground transition-colors">
                  Nos services
                </Link>
              </li>
              <li>
                <Link to={routes.public.testimonials()} className="hover:text-foreground transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link to={routes.public.blog()} className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to={routes.public.contact()} className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-medium mb-4">Mentions légales</h3>
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
              <li>
                <div className="flex items-center text-xs mt-4">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Données sécurisées & RGPD</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-medium mb-4">Nous contacter</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
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
            </ul>
            
            {/* Social Media */}
            <div className="mt-4">
              <h4 className="text-xs font-medium mb-2">Suivez-nous</h4>
              <div className="flex space-x-3">
                <motion.a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </motion.a>
                <motion.a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </motion.a>
                <motion.a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </motion.a>
                <motion.a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright & Credits - Bottom Section */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {currentYear} EmotionsCare. Tous droits réservés.
          </p>
          
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground flex items-center">
              Fait avec <Heart className="h-3 w-3 mx-1 text-red-500" /> en France
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
