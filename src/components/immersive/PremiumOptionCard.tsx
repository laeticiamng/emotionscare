// @ts-nocheck

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import PremiumButton from '@/components/ui/PremiumButton';

interface PremiumOptionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkTo: string;
  buttonText: string;
  buttonVariant?: "primary" | "secondary" | "accent" | "ghost";
  delay?: number;
  initialX?: number;
  gradient?: string;
}

const PremiumOptionCard: React.FC<PremiumOptionCardProps> = ({
  title,
  description,
  icon: Icon,
  linkTo,
  buttonText,
  buttonVariant = "primary",
  delay = 0,
  initialX = 0,
  gradient = "from-blue-500 via-blue-600 to-indigo-700"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="premium-card group h-full"
    >
      <div className={`h-full bg-gradient-to-br ${gradient} text-white p-8 rounded-2xl shadow-premium relative overflow-hidden flex flex-col`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm w-fit group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <Icon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          
          <p className="text-white/90 mb-8 flex-grow leading-relaxed text-lg">{description}</p>
          
          <PremiumButton asChild variant={buttonVariant} className="w-full mt-auto">
            <Link to={linkTo}>
              {buttonText}
            </Link>
          </PremiumButton>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumOptionCard;
