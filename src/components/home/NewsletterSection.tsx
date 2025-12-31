/**
 * NewsletterSection - Section d'inscription à la newsletter
 * Capture d'emails avec design engageant
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Send, CheckCircle2, Sparkles, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NewsletterSectionProps {
  className?: string;
  variant?: 'full' | 'compact' | 'inline';
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  className,
  variant = 'full',
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Email invalide',
        description: 'Merci d\'entrer une adresse email valide.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simuler l'inscription
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubscribed(true);
    setEmail('');

    toast({
      title: '🎉 Inscription réussie !',
      description: 'Tu recevras nos conseils de régulation émotionnelle chaque semaine.',
    });
  };

  const benefits = [
    'Techniques de régulation exclusives',
    'Nouveaux protocoles en avant-première',
    'Conseils personnalisés selon ton profil',
    'Accès aux événements communautaires',
  ];

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('text-center p-8', className)}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Bienvenue dans la communauté !
        </h3>
        <p className="text-muted-foreground">
          Tu recevras ton premier email dans les prochaines heures.
        </p>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Send className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-col sm:flex-row items-center gap-4', className)}>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Rejoins 10 000+ soignants</span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-1 max-w-md">
          <Input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </form>
      </div>
    );
  }

  // Variant full (default)
  return (
    <section className={cn('py-16 bg-gradient-to-br from-primary/5 to-muted/30', className)}>
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="gap-2">
              <Gift className="h-3 w-3" />
              Newsletter gratuite
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Reçois des techniques de régulation chaque semaine
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Rejoins plus de 10 000 étudiants et soignants qui prennent soin d'eux.
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-xl mx-auto border-2 border-primary/20">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 py-6 text-base"
                  />
                </div>
                <Button type="submit" className="w-full py-6 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                      </motion.div>
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Rejoindre la communauté
                    </>
                  )}
                </Button>
              </form>

              {/* Benefits */}
              <div className="space-y-2 pt-4 border-t border-border/50">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Privacy note */}
              <p className="text-xs text-muted-foreground text-center">
                Pas de spam. Désabonnement en un clic. Tes données sont protégées.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
