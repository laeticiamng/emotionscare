
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PremiumButton from '@/components/ui/PremiumButton';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  statIcon?: React.ReactNode;
  statText?: string;
  statValue?: string | number;
  to: string;
  gradient?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  icon,
  title,
  description,
  statIcon,
  statText,
  statValue,
  to,
  gradient = "from-blue-500 via-blue-600 to-indigo-700"
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="premium-card group cursor-pointer h-full"
    >
      <div className={`h-full bg-gradient-to-br ${gradient} text-white p-8 rounded-2xl shadow-premium relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Statistique en haut si présente */}
          {statIcon && statText && (
            <div className="flex items-center gap-3 mb-6 text-white/90">
              <span className="text-white" aria-hidden="true">{statIcon}</span>
              <span className="text-sm font-medium">
                {statText}: <strong className="text-white">{statValue}</strong>
              </span>
            </div>
          )}
          
          {/* Icône et titre */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm text-white group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300" aria-hidden="true">
              {icon}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-white/90 mb-8 flex-grow leading-relaxed text-lg">{description}</p>
          
          {/* Bouton d'action */}
          <Link to={to} className="mt-auto" aria-label={`Accéder au module ${title}`}>
            <PremiumButton 
              variant="ghost" 
              className="w-full justify-between group-hover:bg-white/10 border-white/20 text-white hover:text-white"
            >
              <span>Accéder</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </PremiumButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;
