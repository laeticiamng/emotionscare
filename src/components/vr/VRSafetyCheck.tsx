import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Feather, Monitor, Sparkles, XCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/hooks/useAssessment';
import { useToast } from '@/hooks/use-toast';
import {
  type VRPomsTone,
  type VRSafetyLevel,
  useVRSafetyStore,
} from '@/store/vrSafety.store';
import { cn } from '@/lib/utils';

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
}

interface POMSTensionOption {
  id: 'soothed' | 'balanced' | 'tense';
  title: string;
  description: string;
  tone: VRPomsTone;
}

const SAFETY_OPTIONS: SafetyOption[] = [
  {
    id: 'steady',
    title: 'Je me sens stable',
    description: 'Mon corps reste serein, le voyage continue en douceur.',
    level: 'clear',
  },
  {
    id: 'uneasy',
    title: 'Je préfère ralentir',
    description: 'Un léger vertige, besoin de calmer les lumières.',
    level: 'caution',
  },
  {
    id: 'grounded',
    title: 'Je dois faire une pause',
    description: 'Mon équilibre vacille, retour au sol conseillé.',
    level: 'alert',
  },
];

const SAFETY_SUMMARY: Record<SafetyOption['id'], string> = {
  steady: 'Voyage stable, ambiance actuelle conservée.',
  uneasy: 'Inconfort léger détecté, ambiance adoucie pour la suite.',
  grounded: 'Vertige perçu, prochaine session en version douce 2D.',
};

const SSQ_ANSWER_TEMPLATES: Record<SafetyOption['id'], Record<string, number>> = {
  steady: { '1': 3, '2': 0, '3': 0, '4': 0 },
  uneasy: { '1': 1, '2': 2, '3': 1, '4': 1 },
  grounded: { '1': 0, '2': 3, '3': 3, '4': 3 },
};

const POMS_OPTIONS: POMSTensionOption[] = [
  {
    id: 'tense',
    title: 'Encore un peu contracté·e',
    description: 'La tension reste présente, besoin de ralentir davantage.',
    tone: 'tense',
  },
  {
    id: 'balanced',
    title: 'Plutôt neutre',
    description: 'Je me sens centré·e, prêt·e pour un rythme doux.',
    tone: 'neutral',
  },
  {
    id: 'soothed',
    title: 'Apaisé·e',
    description: 'Le corps s’aligne, je peux prolonger légèrement le voyage.',
    tone: 'soothed',
  },
];

const POMS_SUMMARY: Record<POMSTensionOption['id'], string> = {
  tense: 'Tension présente, prochaine immersion plus courte et progressive.',
  balanced: 'Tension neutre, on garde un rythme calme et enveloppant.',
  soothed: 'Apaisement net, possibilité d’ajouter une minute de douceur.',
};

const buildPOMSAnswers = (
  tone: VRPomsTone,
  catalogItems: { id: string; min?: number; max?: number }[] | undefined,
) => {
  if (!catalogItems || !catalogItems.length) {
    return {
      '1': tone === 'tense' ? 4 : tone === 'soothed' ? 1 : 2,
    };
  }

  return catalogItems.reduce<Record<string, number>>((acc, item) => {
    const min = item.min ?? 0;
    const max = item.max ?? 4;
    const mid = Math.round((min + max) / 2);
    acc[item.id] = tone === 'tense' ? max : tone === 'soothed' ? min : mid;
    return acc;
  }, {});
};

export const VRSafetyCheck: React.FC<VRSafetyCheckProps> = ({
  open,
  moduleContext,
  onClose,
  className = '',
}) => {
  const [ssqSelected, setSSQSelected] = useState<SafetyOption | null>(null);
  const [pomsSelected, setPomsSelected] = useState<POMSTensionOption | null>(null);
  const [ssqSubmitting, setSsqSubmitting] = useState(false);
  const [pomsSubmitting, setPomsSubmitting] = useState(false);
  const [ssqCompleted, setSsqCompleted] = useState(false);
  const [pomsCompleted, setPomsCompleted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { toast } = useToast();
  const ssqAssessment = useAssessment('SSQ');
  const pomsAssessment = useAssessment('POMS_TENSION');

  const setPendingPrompt = useVRSafetyStore((state) => state.setPendingPrompt);
  const recordCheck = useVRSafetyStore((state) => state.recordCheck);
  const recordSSQFeedback = useVRSafetyStore((state) => state.recordSSQFeedback);
  const recordPOMSTensionFeedback = useVRSafetyStore((state) => state.recordPOMSTensionFeedback);
  const planAutoMode = useVRSafetyStore((state) => state.planAutoMode);
  const shouldPromptSSQFn = useVRSafetyStore((state) => state.shouldPromptSSQ);
  const shouldPromptPOMSFN = useVRSafetyStore((state) => state.shouldPromptPOMSTension);

  const shouldShowSSQ = useMemo(() => shouldPromptSSQFn(), [shouldPromptSSQFn]);
  const shouldShowPOMS = useMemo(() => shouldPromptPOMSFN(), [shouldPromptPOMSFN]);

  const showSSQCard = open && shouldShowSSQ && ssqAssessment.state.isFlagEnabled;
  const showPOMSCard = open && shouldShowPOMS && pomsAssessment.state.isFlagEnabled;

  useEffect(() => {
    if (open) {
      setPendingPrompt(true);
    } else {
      setPendingPrompt(false);
      setSSQSelected(null);
      setPomsSelected(null);
      setSsqCompleted(false);
      setPomsCompleted(false);
      setSsqSubmitting(false);
      setPomsSubmitting(false);
    }
  }, [open, setPendingPrompt]);

  useEffect(() => {
    if (!open) return;
    if (showSSQCard && ssqAssessment.state.hasConsent && !ssqAssessment.state.isActive) {
      void ssqAssessment.triggerAssessment('SSQ');
    }
  }, [open, showSSQCard, ssqAssessment]);

  useEffect(() => {
    if (!open) return;
    if (showPOMSCard && pomsAssessment.state.hasConsent && !pomsAssessment.state.isActive) {
      void pomsAssessment.triggerAssessment('POMS_TENSION');
    }
  }, [open, showPOMSCard, pomsAssessment]);

  const closeReview = () => {
    setPendingPrompt(false);
    onClose?.();
  };

  const handleSsqConsent = async () => {
    try {
      await ssqAssessment.grantConsent();
      await ssqAssessment.triggerAssessment('SSQ');
    } catch (error) {
      console.error('Error granting SSQ consent', error);
      toast({
        variant: 'destructive',
        title: 'Impossible pour le moment',
        description: 'Le ressenti VR ne peut pas être activé tout de suite.',
      });
    }
  };

  const handlePomsConsent = async () => {
    try {
      await pomsAssessment.grantConsent();
      await pomsAssessment.triggerAssessment('POMS_TENSION');
    } catch (error) {
      console.error('Error granting POMS consent', error);
      toast({
        variant: 'destructive',
        title: 'Questionnaire indisponible',
        description: 'Réessaie plus tard pour partager ta tension ressentie.',
      });
    }
  };

  const handleSsqSubmit = async () => {
    if (!ssqSelected) {
      toast({
        variant: 'destructive',
        title: 'Sélectionne ton ressenti',
        description: "Choisis l'option qui correspond à ton confort.",
      });
      return;
    }

    setSsqSubmitting(true);
    try {
      if (!ssqAssessment.state.isActive) {
        await ssqAssessment.triggerAssessment('SSQ');
      }

      const answers = SSQ_ANSWER_TEMPLATES[ssqSelected.id];
      await ssqAssessment.submitResponse(answers);

      recordCheck(ssqSelected.level);
      recordSSQFeedback({
        level: ssqSelected.level,
        summary: SAFETY_SUMMARY[ssqSelected.id],
      });
      planAutoMode(ssqSelected.level === 'alert' ? '2d' : ssqSelected.level === 'caution' ? 'vr_soft' : 'vr');
      setSsqCompleted(true);
    } catch (error) {
      console.error('Error submitting SSQ comfort', error);
      toast({
        variant: 'destructive',
        title: 'Enregistrement impossible',
        description: 'Nous ne pouvons pas capter ton ressenti maintenant.',
      });
    } finally {
      setSsqSubmitting(false);
    }
  };

  const handlePomsSubmit = async () => {
    if (!pomsSelected) {
      toast({
        variant: 'destructive',
        title: 'Choisis ton niveau de tension',
        description: 'Sélectionne la phrase qui décrit le mieux ton ressenti.',
      });
      return;
    }

    setPomsSubmitting(true);
    try {
      if (!pomsAssessment.state.isActive) {
        await pomsAssessment.triggerAssessment('POMS_TENSION');
      }

      const answers = buildPOMSAnswers(
        pomsSelected.tone,
        pomsAssessment.state.catalog?.items,
      );
      await pomsAssessment.submitResponse(answers);

      recordPOMSTensionFeedback({
        tone: pomsSelected.tone,
        summary: POMS_SUMMARY[pomsSelected.id],
      });
      if (pomsSelected.tone === 'tense') {
        planAutoMode('vr_soft', 'poms_tension');
      }
      setPomsCompleted(true);
    } catch (error) {
      console.error('Error submitting POMS tension', error);
      toast({
        variant: 'destructive',
        title: 'Enregistrement interrompu',
        description: 'Impossible de sauvegarder le ressenti de tension.',
      });
    } finally {
      setPomsSubmitting(false);
    }
  };

  const allCompleted = (!showSSQCard || ssqCompleted) && (!showPOMSCard || pomsCompleted);

  if (!open) {
    return null;
  }

  const renderSSQSection = () => {
    if (!showSSQCard) {
      return null;
    }

    if (!ssqAssessment.state.hasConsent) {
      return (
        <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-white">
            <Feather className="h-4 w-4" />
            <p className="font-medium">Comment ça va ?</p>
          </div>
          <p className="text-sm text-white/70">
            Partage ton ressenti après le voyage : cela adoucit automatiquement les prochaines immersions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleSsqConsent}>
              Je participe
            </Button>
            <Button size="sm" variant="ghost" className="text-white/70" onClick={closeReview}>
              Plus tard
            </Button>
          </div>
        </div>
      );
    }

    if (ssqCompleted) {
      return (
        <div className="space-y-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-100">
          <p className="font-semibold">Merci pour ton retour.</p>
          {ssqSelected && <p className="text-sm opacity-80">{SAFETY_SUMMARY[ssqSelected.id]}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Feather className="h-4 w-4" />
          <p className="font-medium">Comment ça va ?</p>
        </div>
        <p className="text-sm text-white/70">
          Choisis la phrase qui décrit ton état juste après l'immersion.
        </p>
        <div className="space-y-3">
          {SAFETY_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSSQSelected(option)}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-white/60',
                ssqSelected?.id === option.id
                  ? 'border-white/80 bg-white/10 text-white'
                  : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40',
              )}
            >
              <p className="font-medium">{option.title}</p>
              <p className="text-sm text-white/70">{option.description}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleSsqSubmit} disabled={ssqSubmitting}>
            Valider
          </Button>
          <Button size="sm" variant="ghost" className="text-white/70" onClick={closeReview}>
            Passer
          </Button>
        </div>
      </div>
    );
  };

  const renderPomsSection = () => {
    if (!showPOMSCard) {
      return null;
    }

    if (!pomsAssessment.state.hasConsent) {
      return (
        <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-4 w-4" />
            <p className="font-medium">Tension ressentie ?</p>
          </div>
          <p className="text-sm text-white/70">
            Quelques mots sur la tension perçue nous aident à calibrer la durée et la densité visuelle.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handlePomsConsent}>
              Je partage
            </Button>
            <Button size="sm" variant="ghost" className="text-white/70" onClick={closeReview}>
              Pas maintenant
            </Button>
          </div>
        </div>
      );
    }

    if (pomsCompleted) {
      return (
        <div className="space-y-2 rounded-lg border border-blue-400/30 bg-blue-500/10 p-4 text-blue-100">
          <p className="font-semibold">Merci, tension enregistrée.</p>
          {pomsSelected && <p className="text-sm opacity-80">{POMS_SUMMARY[pomsSelected.id]}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Monitor className="h-4 w-4" />
          <p className="font-medium">Tension ressentie ?</p>
        </div>
        <p className="text-sm text-white/70">
          Ton ressenti oriente la densité visuelle et la durée de la prochaine session.
        </p>
        <div className="space-y-3">
          {POMS_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPomsSelected(option)}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-white/60',
                pomsSelected?.id === option.id
                  ? 'border-white/80 bg-white/10 text-white'
                  : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40',
              )}
            >
              <p className="font-medium">{option.title}</p>
              <p className="text-sm text-white/70">{option.description}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handlePomsSubmit} disabled={pomsSubmitting}>
            Enregistrer
          </Button>
          <Button size="sm" variant="ghost" className="text-white/70" onClick={closeReview}>
            Passer
          </Button>
        </div>
      </div>
    );
  };

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
          <div className="space-y-5 p-5">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-white/30 text-white/80">
                Après le voyage
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white"
                onClick={closeReview}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            {renderSSQSection()}
            {renderPomsSection()}

            {allCompleted && (
              <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p>Merci pour ces indications, nous ajustons automatiquement la prochaine session.</p>
              </div>
            )}

            {!allCompleted && !showSSQCard && !showPOMSCard && (
              <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p>Aucun retour nécessaire pour l’instant. Tu peux poursuivre en douceur.</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default VRSafetyCheck;
