
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CtaButton {
  label: string;
  link: string;
  text: string;
  variant?: 'default' | 'outline';
  icon?: boolean;
}

interface WelcomeHeroProps {
  title: string;
  subtitle: string;
  ctaButtons: CtaButton[];
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ 
  title, 
  subtitle, 
  ctaButtons, 
  imageUrl,
  backgroundColor = "bg-muted/30", 
  textColor = "text-foreground" 
}) => {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 py-12 md:py-20 px-4 rounded-xl ${backgroundColor}`}>
      <motion.div 
        className="flex-1 text-center md:text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${textColor}`}>{title}</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          {ctaButtons.map((button, index) => (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Button 
                asChild
                variant={button.variant || 'default'}
                size="lg"
                className="w-full sm:w-auto group"
              >
                <Link to={button.link} className="flex items-center gap-2">
                  {button.text}
                  {button.icon && 
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  }
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {imageUrl && (
        <motion.div 
          className="flex-1 mt-8 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <img 
            src={imageUrl} 
            alt="Welcome illustration" 
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </motion.div>
      )}
    </div>
  );
};

export default WelcomeHero;
