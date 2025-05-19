
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Mail, Phone, Shield, Clock, Calendar } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

const EnhancedFooter: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyTip, setDailyTip] = useState('');

  // Tips du jour
  const dailyTips = [
    "Prenez quelques minutes pour respirer profondément et vous recentrer.",
    "Notez trois choses positives qui se sont passées aujourd'hui.",
    "Hydratez-vous régulièrement pour maintenir votre énergie.",
    "Une courte marche peut aider à clarifier vos pensées.",
    "Exprimez votre gratitude envers quelqu'un aujourd'hui.",
    "Accordez-vous un moment de silence et de méditation.",
    "Écoutez de la musique qui vous fait du bien.",
  ];

  // Mise à jour de l'horloge et du conseil du jour
  useEffect(() => {
    // Sélectionner un conseil aléatoire
    const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    setDailyTip(randomTip);

    // Mettre à jour l'horloge toutes les minutes
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Formatage de l'heure
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Formatage de la date
  const formattedDate = currentTime.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <footer className={cn(
      "border-t bg-background/80 backdrop-blur-md transition-colors duration-300",
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          {/* Interactive section with daily tips, time, and mood */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-4 rounded-xl bg-accent/20 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Daily Tip */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-medium mb-2">Conseil du jour</h3>
                <p className="text-sm text-center md:text-left text-muted-foreground">{dailyTip}</p>
              </div>
              
              {/* Clock and Date */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{formattedTime}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{formattedDate}</span>
                </div>
              </div>
              
              {/* Emotional Climate (placeholder) */}
              <div className="flex flex-col items-center md:items-end">
                <h3 className="text-sm font-medium mb-2">Climat émotionnel</h3>
                <div className="flex space-x-2">
                  {["😊", "😌", "🙂", "😐", "🤔"].map((emoji, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      className={`text-xl cursor-pointer ${index === 2 ? 'opacity-100' : 'opacity-50'}`}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main footer content */}
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
            </div>
            
            {/* Links Column */}
            <div>
              <h3 className="text-sm font-medium mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/legal" className="hover:text-foreground transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-foreground transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-foreground transition-colors">
                    Conditions d'utilisation
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

export default EnhancedFooter;
