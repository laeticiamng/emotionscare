import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Calendar } from 'lucide-react';

const EnhancedFooter: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <motion.footer 
      className="border-t bg-background/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="text-center md:text-left"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-semibold mb-2 flex items-center justify-center md:justify-start gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              EmotionsCare
            </h3>
            <p className="text-sm text-muted-foreground">
              Votre bien-être émotionnel, notre priorité
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-mono text-sm">
                {currentTime.toLocaleTimeString('fr-FR')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {currentTime.toLocaleDateString('fr-FR')}
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center md:text-right"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground">
              © 2024 EmotionsCare. Tous droits réservés.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Conçu avec ❤️ pour votre bien-être
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default EnhancedFooter;
