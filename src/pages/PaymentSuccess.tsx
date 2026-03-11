/**
 * Page de succès après paiement Stripe
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription, plan } = useSubscription();
  const [isVerifying, setIsVerifying] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      // Attendre un peu pour que Stripe traite le paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      await checkSubscription();
      setIsVerifying(false);
    };

    verifyPayment();
  }, [checkSubscription]);

  const getPlanName = () => {
    switch (plan) {
      case 'pro': return 'Pro';
      case 'business': return 'Business';
      default: return 'Premium';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Paiement r\u00e9ussi | EmotionsCare</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center space-y-6">
          {/* Icône de succès animée */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-accent-foreground" />
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Paiement réussi ! 🎉
            </h1>
            <p className="text-muted-foreground">
              Bienvenue dans EmotionsCare {getPlanName()}
            </p>
          </motion.div>

          {/* Avantages débloqués */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/5 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Fonctionnalités débloquées</span>
            </div>
            <ul className="text-sm text-left space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Accès illimité aux modules wellness
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Coaching IA personnalisé
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Évaluations avancées
              </li>
              {plan === 'business' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Analytics équipe B2B
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Support prioritaire
                  </li>
                </>
              )}
            </ul>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Button 
              onClick={() => navigate('/app/home')}
              className="w-full"
              size="lg"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/app/settings')}
              className="w-full"
            >
              Gérer mon abonnement
            </Button>
          </motion.div>

          {/* Note de reçu */}
          <p className="text-xs text-muted-foreground">
            Un reçu a été envoyé à votre adresse email.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
