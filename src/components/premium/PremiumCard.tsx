// @ts-nocheck

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
        y: -15,
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-full bg-gradient-to-br ${gradient} text-white p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl`}>
        {/* Dynamic background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{ padding: '1px' }}>
          <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${gradient}`} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <motion.div 
              className="p-5 rounded-3xl bg-white/25 backdrop-blur-md text-white shadow-2xl group-hover:bg-white/35 group-hover:scale-110 transition-all duration-500 border border-white/20"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-8 w-8" />
            </motion.div>
            <div>
              <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-white/95 leading-relaxed text-lg font-medium mb-8">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/90 font-bold tracking-wide uppercase">Découvrir</span>
            <motion.div
              className="w-4 h-4 rounded-full bg-white shadow-lg"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
};

export default PremiumCard;
