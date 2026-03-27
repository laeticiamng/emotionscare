// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, ArrowLeft, Check, RefreshCw } from 'lucide-react';
import AnimatedFormField from './AnimatedFormField';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface MagicLinkAuthProps {
  onCancel: () => void;
}

const MagicLinkAuth: React.FC<MagicLinkAuthProps> = ({ onCancel }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const sendMagicLink = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app/consumer/home`,
        },
      });

      if (supabaseError) {
        if (supabaseError.message.includes('rate limit')) {
          setError('Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.');
        } else {
          throw supabaseError;
        }
      } else {
        setSent(true);
        logger.info('Magic link envoyé', { email }, 'AUTH');
      }
    } catch (err) {
      logger.error('Erreur envoi magic link', err instanceof Error ? err : new Error(String(err)), 'AUTH');
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setSent(false);
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    await sendMagicLink();
    setSent(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    await sendMagicLink();
  };
  
  return (
    <Card className="border-none shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="text-center mb-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">Connexion par lien magique</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Recevez un email avec un lien de connexion sécurisé
                </p>
              </div>
              
              <AnimatedFormField
                id="magic-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                icon={<Mail className="h-4 w-4" />}
                error={error}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de connexion"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6 py-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold">Lien envoyé!</h2>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                Nous avons envoyé un lien de connexion à <strong>{email}</strong>. 
                Veuillez vérifier votre boîte de réception.
              </p>
              
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="w-full mb-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le lien'}
              </Button>

              <Button
                variant="ghost"
                onClick={onCancel}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        )}
      </motion.div>
    </Card>
  );
};

export default MagicLinkAuth;
