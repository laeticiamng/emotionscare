
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  gradient = "from-blue-500 via-blue-600 to-indigo-700",
  delay = 0
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="premium-card group cursor-pointer h-full"
    >
      <div className={`h-full bg-gradient-to-br ${gradient} text-white p-8 rounded-2xl shadow-premium relative overflow-hidden flex flex-col`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col items-center text-center h-full">
          {icon && (
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                {icon}
              </div>
            </div>
          )}
          <h3 className="font-bold text-2xl mb-6 leading-tight">{title}</h3>
          <p className="text-white/90 text-lg leading-relaxed flex-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
