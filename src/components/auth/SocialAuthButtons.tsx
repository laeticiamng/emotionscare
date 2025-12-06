
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Apple, Facebook, Github, Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from '@/hooks/use-toast';

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
  onMagicLinkClick?: () => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ 
  mode, 
  onMagicLinkClick 
}) => {
  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Authentification sociale",
      description: `La connexion via ${provider} sera bientôt disponible!`,
    });
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  };

  return (
    <div className="space-y-3">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou {mode === 'login' ? 'se connecter' : 's\'inscrire'} avec
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button 
            variant="outline" 
            className="w-full bg-white dark:bg-slate-800" 
            onClick={() => handleSocialLogin('Google')}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Google
          </Button>
        </motion.div>
        
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button 
            variant="outline" 
            className="w-full bg-white dark:bg-slate-800" 
            onClick={() => handleSocialLogin('Apple')}
          >
            <Apple className="mr-2 h-5 w-5" />
            Apple
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button 
            variant="outline" 
            className="w-full bg-white dark:bg-slate-800" 
            onClick={() => handleSocialLogin('Facebook')}
          >
            <Facebook className="mr-2 h-5 w-5 text-blue-600" />
            Facebook
          </Button>
        </motion.div>
        
        {onMagicLinkClick && (
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button 
              variant="outline" 
              className="w-full bg-white dark:bg-slate-800" 
              onClick={onMagicLinkClick}
            >
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Magic Link
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SocialAuthButtons;
