/**
 * PricingPageWorking - Page tarifs style Apple
 * Cohérente avec homepage, prix alignés sur Stripe, checkout intégré
 */

import React, { memo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Check,
  ArrowRight,
  Heart,
  Shield,
  Sparkles,
  Users,
  Building2,
  Lock,
  Clock,
} from 'lucide-react';

/** Plans aligned with Stripe create-checkout PLANS config */
const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: '',
    description: 'Pour découvrir EmotionsCare',
    features: [
      'Accès basique à la plateforme',
      '3 protocoles par jour (Stop, Reset, Respirez)',
      'Scanner émotionnel de base',
      'Journal émotionnel',
      'Accès communauté',
    ],
    cta: 'Commencer gratuitement',
    popular: false,
    stripePlan: null,
    gradient: 'from-muted to-muted',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.90,
    period: '/mois',
    description: 'L\'accompagnement complet pour les soignants',
    features: [
      'Tout le plan Gratuit',
      'Accès illimité à tous les protocoles',
      'Coach IA Nyvée personnalisé',
      'Musicothérapie intégrale',
      'Scanner émotionnel avancé',
      'Gamification XP et badges',
      'Analyses détaillées & tendances',
      'Support prioritaire',
    ],
    cta: 'Passer à Premium',
    popular: true,
    stripePlan: 'premium',
    gradient: 'from-primary to-accent',
  },
  {
    id: 'etablissement',
    name: 'Établissement',
    price: 'Sur devis',
    period: '',
    description: 'Pour les hôpitaux, cliniques et établissements de santé',
    features: [
      'Tout le plan Premium pour chaque utilisateur',
      'Dashboard B2B RH anonymisé',
      'Analytics bien-être des équipes',
      'Rapports hebdomadaires automatisés',
      'Alertes préventives collectives',
      'Déploiement et onboarding dédié',
      'Interlocuteur et support dédiés',
      'Facturation centralisée',
    ],
    cta: 'Demander un devis',
    popular: false,
    stripePlan: null,
    gradient: 'from-accent to-primary',
  },
];

const PricingPageWorking: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  usePageSEO({
    title: 'Tarifs - EmotionsCare | Plans pour soignants',
    description:
      'Découvrez les tarifs EmotionsCare : gratuit pour commencer, Pro à 14,90€/mois pour un accompagnement complet. Droit de rétractation 14 jours.',
    keywords: 'tarifs, prix, abonnement, premium, soignants, bien-être',
  });

  const handleCTA = async (plan: typeof PLANS[number]) => {
    if (plan.id === 'free') {
      navigate('/signup');
      return;
    }

    if (plan.id === 'etablissement') {
      navigate('/contact');
      return;
    }

    // Premium plan → Stripe checkout
    if (!isAuthenticated) {
      toast.info('Créez un compte pour accéder à l\'abonnement Premium');
      navigate('/signup');
      return;
    }

    try {
      setLoadingPlan(plan.id);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: plan.stripePlan },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      toast.error('Erreur lors de la création du checkout. Réessayez.');
      console.error('[Pricing] Checkout error:', err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
        </div>

        <div ref={heroRef} className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[0.95]"
            >
              Un plan pour chaque{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                soignant.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 font-light"
            >
              Commencez gratuitement. Passez à Pro quand vous êtes prêt.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm text-muted-foreground/70"
            >
              Sans engagement · Droit de rétractation 14 jours · Annulez quand vous voulez
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PLANS ═══════════════════ */}
      <section className="pb-28 md:pb-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan, index) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const isCardInView = useInView(cardRef, { once: true, amount: 0.3 });
              const isLoading = loadingPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  ref={cardRef}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isCardInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    'group relative rounded-3xl border transition-all duration-500',
                    plan.popular
                      ? 'border-primary shadow-2xl shadow-primary/10 scale-[1.02]'
                      : 'border-border/50 hover:border-border hover:shadow-xl hover:shadow-primary/5'
                  )}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                        <Sparkles className="h-3.5 w-3.5" />
                        Populaire
                      </span>
                    </div>
                  )}

                  <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>

                      <div className="mt-6">
                        {plan.price === 0 ? (
                          <span className="text-5xl font-bold">Gratuit</span>
                        ) : typeof plan.price === 'number' ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold">{plan.price}€</span>
                            <span className="text-muted-foreground">{plan.period}</span>
                          </div>
                        ) : (
                          <span className="text-3xl font-bold">{plan.price}</span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      size="lg"
                      className={cn(
                        'w-full rounded-full py-6 text-base font-semibold transition-all duration-300',
                        plan.popular
                          ? 'bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:scale-[1.02]'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      )}
                      onClick={() => handleCTA(plan)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          Chargement...
                        </div>
                      ) : (
                        <span className="flex items-center gap-2">
                          {plan.cta}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    {/* Features */}
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRUST ═══════════════════ */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { icon: Shield, label: 'Conforme RGPD' },
              { icon: Lock, label: 'Paiement sécurisé Stripe' },
              { icon: Clock, label: 'Droit de rétractation 14j' },
              { icon: Heart, label: 'Made in France' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <badge.icon className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="py-28 md:py-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center mb-16"
            >
              Questions{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                fréquentes
              </span>
            </motion.h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Puis-je annuler à tout moment ?',
                  a: 'Oui. Aucun engagement. Vous pouvez annuler votre abonnement Pro à tout moment depuis votre espace. Vous conservez l\'accès jusqu\'à la fin de la période en cours.',
                },
                {
                  q: 'Le plan Gratuit est-il vraiment gratuit ?',
                  a: 'Oui, 100% gratuit, sans carte bancaire. Vous accédez aux exercices de base, au journal émotionnel et à la communauté sans limite de temps.',
                },
                {
                  q: 'Qu\'est-ce que le droit de rétractation ?',
                  a: 'Conformément à la loi française, vous disposez de 14 jours après votre souscription pour vous rétracter et obtenir un remboursement intégral, sans justification.',
                },
                {
                  q: 'Comment fonctionne le plan Business ?',
                  a: 'Le plan Business est conçu pour les organisations (hôpitaux, cliniques, EHPAD). Il inclut un dashboard RH anonymisé et des rapports d\'équipe. Contactez-nous pour un devis personnalisé.',
                },
                {
                  q: 'Mes données sont-elles protégées ?',
                  a: 'Oui. EmotionsCare est conforme RGPD, hébergé en France, et aucune donnée n\'est vendue ou partagée avec des tiers. Vos données émotionnelles restent strictement confidentielles.',
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="border border-border/50 rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(PricingPageWorking);
