
import React from 'react';
import { motion } from 'framer-motion';

interface PremiumLayoutProps {
  children: React.ReactNode;
  backgroundPattern?: boolean;
}

const PremiumLayout: React.FC<PremiumLayoutProps> = ({
  children,
  backgroundPattern = true
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Animated Background */}
      {backgroundPattern && (
        <>
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
          
          {/* Floating orbs */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl"
              animate={{
                x: [0, 50, -30, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-yellow-400/30 rounded-full mix-blend-multiply filter blur-3xl"
              animate={{
                x: [0, -40, 30, 0],
                y: [0, 40, -20, 0],
                scale: [1, 0.9, 1.1, 1]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            />
            <motion.div 
              className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"
              animate={{
                x: [0, 60, -40, 0],
                y: [0, -50, 30, 0],
                scale: [1, 1.2, 0.8, 1]
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 10 }}
            />
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: `radial-gradient(circle, #667eea 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Premium Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#a8edea', '#fed6e3'][i % 6]}, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Premium glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default PremiumLayout;
