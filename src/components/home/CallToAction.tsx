
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { UserIcon, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CallToActionProps {
  type: 'personal' | 'business';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ type, className = '' }) => {
  const navigate = useNavigate();
  
  const content = type === 'personal' 
    ? {
        title: 'Espace Particulier',
        description: 'Accédez à des outils personnalisés pour améliorer votre bien-être émotionnel au quotidien.',
        buttonText: 'Découvrir',
        path: '/b2c/login',
        icon: <UserIcon className="h-5 w-5" />,
        color: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
      }
    : {
        title: 'Espace Entreprise',
        description: 'Améliorez le bien-être de vos équipes avec des solutions spécifiquement conçues pour les organisations.',
        buttonText: 'En savoir plus',
        path: '/b2b/selection',
        icon: <Building className="h-5 w-5" />,
        color: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
      };

  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`${content.color} rounded-xl p-6 shadow-sm ${className}`}
    >
      <div className={`inline-flex p-3 rounded-full ${content.color} mb-4`}>
        <div className={content.iconColor}>
          {content.icon}
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">{content.title}</h3>
      <p className="text-muted-foreground mb-4">{content.description}</p>
      <Button onClick={() => navigate(content.path)} className="group">
        {content.buttonText}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default CallToAction;
