import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Apple, Facebook, Mail, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Google icon SVG (inline to avoid external dependency)
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
  onMagicLinkClick?: () => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ 
  mode, 
  onMagicLinkClick 
}) => {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setIsLoading(provider);
    try {
      const redirectTo = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
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
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading !== null}
          >
            {isLoading === 'google' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Google
          </Button>
        </motion.div>
        
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button 
            variant="outline" 
            className="w-full bg-white dark:bg-slate-800" 
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading !== null}
          >
            {isLoading === 'apple' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Apple className="mr-2 h-5 w-5" />
            )}
            Apple
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button 
            variant="outline" 
            className="w-full bg-white dark:bg-slate-800" 
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading !== null}
          >
            {isLoading === 'facebook' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Facebook className="mr-2 h-5 w-5 text-blue-600" />
            )}
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
