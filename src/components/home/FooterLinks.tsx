
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

const FooterLinks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-muted py-12 mt-auto">
      <div className="container mx-auto px-4">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-5 gap-8"
        >
          <motion.div variants={item} className="md:col-span-2">
            <Link to="/" className="flex items-center">
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-2xl">EmotionsCare</span>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Une approche innovante pour comprendre et gérer vos émotions au quotidien.
              Notre plateforme combine technologie et psychologie pour améliorer votre bien-être émotionnel.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://twitter.com" className="hover:text-primary transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" className="hover:text-primary transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" className="hover:text-primary transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://linkedin.com" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
            
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Mon tableau de bord" : "Commencer gratuitement"}
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div variants={item}>
            <h3 className="font-bold mb-4">Notre produit</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:underline hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/scan" className="hover:underline hover:text-primary transition-colors">Scan émotionnel</Link></li>
              <li><Link to="/journal" className="hover:underline hover:text-primary transition-colors">Journal</Link></li>
              <li><Link to="/music" className="hover:underline hover:text-primary transition-colors">Musicothérapie</Link></li>
              <li><Link to="/social" className="hover:underline hover:text-primary transition-colors">Communauté</Link></li>
            </ul>
          </motion.div>
          
          <motion.div variants={item}>
            <h3 className="font-bold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/team" className="hover:underline hover:text-primary transition-colors">Notre équipe</Link></li>
              <li><Link to="/contact" className="hover:underline hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/support" className="hover:underline hover:text-primary transition-colors">Support</Link></li>
              <li><Link to="/b2b/selection" className="hover:underline hover:text-primary transition-colors">Entreprises</Link></li>
              <li><Link to="/faq" className="hover:underline hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </motion.div>
          
          <motion.div variants={item}>
            <h3 className="font-bold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:underline hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="hover:underline hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="hover:underline hover:text-primary transition-colors">Politique de cookies</Link></li>
              <li><Link to="/legal" className="hover:underline hover:text-primary transition-colors">Mentions légales</Link></li>
            </ul>
          </motion.div>
          
          <motion.div variants={item}>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span>contact@emotionscare.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span>+33 (0)1 23 45 67 89</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>10 Rue de la Paix<br />75002 Paris, France</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <div className="mt-12 pt-6 border-t text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-primary transition-colors">Conditions</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLinks;
