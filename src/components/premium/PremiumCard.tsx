
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PremiumCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  onClick?: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="premium-card group cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-full bg-gradient-to-br ${gradient} text-white p-8 rounded-2xl shadow-premium relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-2xl mb-2">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-white/90 leading-relaxed text-lg">
            {description}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-white/80 font-semibold">Découvrir</span>
            <motion.div
              className="w-3 h-3 rounded-full bg-white/80"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumCard;
