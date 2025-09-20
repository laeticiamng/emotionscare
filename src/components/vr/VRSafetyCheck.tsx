import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Shield, Feather, HeartPulse, XCircle, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/hooks/useAssessment';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useVRSafetyStore, VRSafetyLevel } from '@/store/vrSafety.store';

interface VRSafetyCheckProps {
  open: boolean;
  moduleContext: 'vr_breath' | 'vr_galaxy';
  onClose?: () => void;
  className?: string;
}

interface SafetyOption {
  id: 'steady' | 'uneasy' | 'grounded';
  title: string;
  description: string;
  level: VRSafetyLevel;
  icon: typeof Feather;
}

const SAFETY_OPTIONS: SafetyOption[] = [
  {
    id: 'steady',
    title: 'Je me sens stable',
    description: 'Mon corps reste serein, le voyage continue en douceur.',
    level: 'clear',
    icon: Feather,
  },
  {
    id: 'uneasy',
    title: 'Je préfère ralentir',
    description: 'Un léger vertige, besoin de calmer les lumières.',
    level: 'caution',
    icon: HeartPulse,
  },
  {
    id: 'grounded',
    title: 'Je dois faire une pause',
    description: 'Mon équilibre vacille, retour au sol conseillé.',
    level: 'alert',
    icon: Shield,
  },
];

const levelToSignal: Record<VRSafetyLevel, number> = {
  clear: 1,
  caution: 2,
  alert: 3,
};

export const VRSafetyCheck: React.FC<VRSafetyCheckProps> = ({
  open,
  moduleContext,
  onClose,
  className = '',
}) => {
  const [step, setStep] = useState<'intro' | 'options' | 'thanks'>('intro');
  const [selected, setSelected] = useState<SafetyOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggeredAssessment, setHasTriggeredAssessment] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { toast } = useToast();
  const { user } = useAuth();
  const { recordCheck, setPendingPrompt } = useVRSafetyStore();
  const assessment = useAssessment('SSQ');

  useEffect(() => {
    if (open) {
      setStep(assessment.state.hasConsent ? 'options' : 'intro');
      setSelected(null);
      setHasTriggeredAssessment(false);
      setPendingPrompt(true);
    } else {
      setPendingPrompt(false);
    }
  }, [open, assessment.state.hasConsent, setPendingPrompt]);

  useEffect(() => {
    if (!open) return;
    if (!assessment.state.hasConsent) return;
    if (hasTriggeredAssessment) return;

    const trigger = async () => {
      try {
        await assessment.triggerAssessment('SSQ');
        setHasTriggeredAssessment(true);
      } catch (error) {
        console.error('Error triggering SSQ assessment', error);
      }
    };

    trigger();
  }, [open, assessment, hasTriggeredAssessment]);

  useEffect(() => {
    if (!open) {
      setStep('intro');
      setSelected(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const introDescription = useMemo(() => {
    return assessment.state.hasConsent
      ? 'Dis-nous si ton voyage reste confortable pour ajuster l\'ambiance.'
      : 'Tu peux partager ton ressenti pour que la prochaine session épouse mieux ton rythme.';
  }, [assessment.state.hasConsent]);

  const handleOptIn = async () => {
    try {
      if (!assessment.state.hasConsent) {
        await assessment.grantConsent('SSQ');
      }
      await assessment.triggerAssessment('SSQ');
      setHasTriggeredAssessment(true);
      setStep('options');
    } catch (error) {
      console.error('Error granting SSQ consent', error);
      toast({
        variant: 'destructive',
        title: 'Impossible pour le moment',
        description: 'Le ressenti VR ne peut pas être activé tout de suite.',
      });
    }
  };

  const handleSkip = () => {
    setPendingPrompt(false);
    onClose?.();
  };

  const storeSafetySignal = async (option: SafetyOption) => {
    try {
      let userId = user?.id;

      if (!userId) {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id ?? undefined;
      }

      if (!userId) {
        return;
      }

      const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.from('clinical_signals').insert({
        user_id: userId,
        domain: 'vr_safety',
        level: levelToSignal[option.level],
        metadata: {
          label: option.title,
          description: option.description,
          selection: option.id,
          module: moduleContext,
        },
        module_context: moduleContext,
        source_instrument: 'SSQ',
        window_type: 'post_session',
        expires_at: expiresAt,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error storing VR safety signal', error);
    }
  };

  const handleSubmit = async () => {
    if (!selected) {
      toast({
        variant: 'destructive',
        title: 'Sélectionne ton ressenti',
        description: 'Choisis l\'option qui correspond à ton confort.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!assessment.state.isActive) {
        await assessment.triggerAssessment('SSQ');
      }

      await assessment.submitResponse({
        comfort_state: selected.id,
        comfort_level: selected.level,
        comfort_notes: selected.description,
      });

      await storeSafetySignal(selected);

      recordCheck(selected.level);
      setStep('thanks');
    } catch (error) {
      console.error('Error submitting SSQ comfort', error);
      toast({
        variant: 'destructive',
        title: 'Enregistrement impossible',
        description: 'Nous ne pouvons pas capter ton ressenti maintenant.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIntro = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Partage ton ressenti</h3>
        <p className="text-sm text-white/70">{introDescription}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleOptIn} size="sm" className="bg-white text-black hover:bg-white/90">
          Je participe
        </Button>
        <Button onClick={handleSkip} size="sm" variant="ghost" className="text-white/70 hover:text-white">
          Pas maintenant
        </Button>
      </div>
    </div>
  );

  const renderOptions = () => (
    <div className="space-y-4">
      <p className="text-sm text-white/70">
        Choisis la phrase qui décrit ton état juste après l\'immersion.
      </p>

      <div className="space-y-3">
        {SAFETY_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = selected?.id === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isActive
                  ? 'border-white/80 bg-white/10 text-white focus:ring-white'
                  : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 rounded-full bg-white/10 p-2">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="space-y-1">
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-white/70">{option.description}</p>
                </div>
                {isActive && <Check className="ml-auto h-5 w-5" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="sm" className="bg-white text-black hover:bg-white/90">
          Valider
        </Button>
        <Button onClick={handleSkip} size="sm" variant="ghost" className="text-white/70 hover:text-white">
          Fermer
        </Button>
      </div>
    </div>
  );

  const renderThanks = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="rounded-full bg-white/10 p-2">
          <Shield className="h-5 w-5" />
        </span>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Merci pour ton retour</h3>
          <p className="text-sm text-white/70">
            Nous ajusterons le prochain départ pour préserver ton équilibre.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSkip} size="sm" className="bg-white text-black hover:bg-white/90">
          Revenir au calme
        </Button>
      </div>
    </div>
  );

  if (!open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className={className}
      >
        <Card className="bg-slate-900/70 border-white/10 text-white">
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-white/30 text-white/80">
                Confort VR
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white"
                onClick={handleSkip}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            {step === 'intro' && renderIntro()}
            {step === 'options' && renderOptions()}
            {step === 'thanks' && renderThanks()}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
