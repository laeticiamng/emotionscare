
import React from 'react';
import { motion } from 'framer-motion';
import AuthBackdrop from '@/components/auth/AuthBackdrop';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Building, ShieldCheck } from 'lucide-react';

interface B2BPremiumAuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isAdmin?: boolean;
  backgroundPattern?: string;
}

const B2BPremiumAuthLayout: React.FC<B2BPremiumAuthLayoutProps> = ({
  title,
  subtitle,
  children,
  isAdmin = false,
  backgroundPattern,
}) => {
  // Colors based on role
  const gradientFrom = isAdmin ? 'from-purple-50' : 'from-green-50';
  const gradientTo = isAdmin ? 'to-purple-100' : 'to-blue-100';
  const darkGradientFrom = isAdmin ? 'dark:from-purple-950' : 'dark:from-green-950';
  const darkGradientTo = isAdmin ? 'dark:to-purple-900' : 'dark:to-blue-900';
  const accentColor = isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400';
  const bgAccent = isAdmin ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30';
  
  const Icon = isAdmin ? ShieldCheck : Building;
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-background">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto"
            >
              <div className={`h-16 w-16 rounded-full ${bgAccent} flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`h-8 w-8 ${accentColor}`} />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold mb-2"
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Right side - Graphics */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`hidden md:flex md:w-1/2 bg-gradient-to-br ${gradientFrom} ${gradientTo} ${darkGradientFrom} ${darkGradientTo} relative overflow-hidden`}
      >
        <AuthBackdrop imageUrl={backgroundPattern} variant={isAdmin ? 'admin' : 'business'} />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-center"
          >
            <div className={`h-24 w-24 rounded-full ${bgAccent} flex items-center justify-center mx-auto mb-6`}>
              <Icon className={`h-12 w-12 ${accentColor}`} />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              {isAdmin ? 'Espace Administrateur' : 'Espace Collaborateur'}
            </h2>
            
            <p className="text-muted-foreground max-w-md mx-auto">
              {isAdmin 
                ? 'Accédez aux outils de gestion, aux données analytiques et aux paramètres de votre organisation.'
                : 'Accédez à vos outils de bien-être, suivez vos émotions et découvrez des ressources personnalisées.'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BPremiumAuthLayout;
