
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
        y: -12, 
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
      className="group cursor-pointer h-full"
    >
      <div className={`h-full bg-gradient-to-br ${gradient} text-white p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden flex flex-col backdrop-blur-xl`}>
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center h-full">
          {icon && (
            <motion.div 
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-5 bg-white/25 rounded-3xl backdrop-blur-md group-hover:bg-white/35 group-hover:scale-110 transition-all duration-500 shadow-xl border border-white/20">
                {icon}
              </div>
            </motion.div>
          )}
          <h3 className="font-bold text-2xl mb-6 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text">{title}</h3>
          <p className="text-white/95 text-lg leading-relaxed flex-1 font-medium">{description}</p>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
};

export default FeatureCard;
