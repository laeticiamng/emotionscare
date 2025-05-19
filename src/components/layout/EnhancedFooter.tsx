
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Mail, Phone, Shield, Clock, ExternalLink, Lightbulb } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EnhancedFooterProps {
  className?: string;
}

const EnhancedFooter: React.FC<EnhancedFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyTip, setDailyTip] = useState('');
  
  // Format time as HH:MM
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Daily tips for emotional wellbeing
  const tips = [
    "Prendre 5 minutes pour respirer profondément peut réduire votre niveau de stress.",
    "Exprimer votre gratitude envers quelqu'un peut améliorer votre moral et le sien.",
    "Faites une courte marche pour éclaircir vos pensées et regagner de l'énergie.",
    "La musique peut changer votre humeur en quelques secondes, essayez-la !",
    "Prenez un moment pour vous étirer, cela libère les tensions.",
    "Partagez ce que vous ressentez avec un proche ou dans votre journal.",
    "Prenez une pause des écrans et observez la nature.",
  ];
  
  // Set a daily tip based on the date
  useEffect(() => {
    const dayOfYear = Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setDailyTip(tips[dayOfYear % tips.length]);
  }, [currentTime]);

  return (
    <footer className={cn("border-t bg-background/80 backdrop-blur-md", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Column */}
            <div>
              <Link to="/" className="flex items-center space-x-2">
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
              
              {/* Daily Tip */}
              <div className="mt-6 p-3 bg-primary/10 rounded-lg border border-primary/20 flex items-start">
                <Lightbulb className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-primary mb-1">Conseil du jour</p>
                  <p className="text-sm text-muted-foreground">{dailyTip}</p>
                </div>
              </div>
            </div>
            
            {/* Links Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground transition-colors flex items-center">
                    <span className="mr-2">•</span>
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/legal" className="hover:text-foreground transition-colors flex items-center">
                    <span className="mr-2">•</span>
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-foreground transition-colors flex items-center">
                    <span className="mr-2">•</span>
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-foreground transition-colors flex items-center">
                    <span className="mr-2">•</span>
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-foreground transition-colors flex items-center">
                    <span className="mr-2">•</span>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-foreground transition-colors flex items-center">
                    <span className="mr-2">•</span>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <TooltipProvider>
                  <li className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href="mailto:contact@emotions-care.com" className="hover:text-foreground transition-colors">
                          contact@emotions-care.com
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nous répondons sous 24h</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                  
                  <li className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href="tel:+33123456789" className="hover:text-foreground transition-colors">
                          +33 1 23 45 67 89
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lun-Ven, 9h-18h</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                  
                  <li className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <span>Données sécurisées & RGPD</span>
                  </li>
                  
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{formattedTime}</span>
                  </li>
                </TooltipProvider>
              </ul>
              
              {/* Social Mood Board Preview */}
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium">Ambiance Sociale</h4>
                  <Link to="/community" className="text-xs text-primary flex items-center">
                    Voir plus
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                <div className="flex space-x-1">
                  {["😊", "🙂", "😌", "🤔", "😢"].map((emoji, index) => (
                    <motion.div 
                      key={index}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-lg",
                        index === 0 ? "bg-green-100 dark:bg-green-900/30" :
                        index === 1 ? "bg-green-50 dark:bg-green-900/20" :
                        index === 2 ? "bg-blue-50 dark:bg-blue-900/20" :
                        index === 3 ? "bg-amber-50 dark:bg-amber-900/20" :
                        "bg-red-50 dark:bg-red-900/20"
                      )}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
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

export default EnhancedFooter;
