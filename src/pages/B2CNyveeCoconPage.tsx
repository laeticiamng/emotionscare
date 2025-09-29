import type { FC } from 'react';
import { useMemo } from 'react';

import ZeroNumberBoundary from '@/components/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import useStai6Orchestration from '@/features/orchestration/useStai6Orchestration';
import NyveeFlowController from '@/features/nyvee/NyveeFlowController';
import { PostCheck } from '@/features/nyvee/components/PostCheck';
import { PreCheck } from '@/features/nyvee/components/PreCheck';
import { useMediaQuery } from '@/hooks/use-media-query';

const groundingPrompts = [
  'Observe les nuances de lumière autour de toi.',
  'Pose une main sur ta cage thoracique, sens le mouvement du souffle.',
  'Laisse les épaules tomber délicatement.',
  'Imagine une vague qui vient apaiser la poitrine.',
];

const breathingPrompts = [
  'Inspire calmement par le nez.',
  'Suspend le souffle un instant sans forcer.',
  'Expire plus longuement que l’inspiration.',
  'Accueille la sensation de relâchement qui suit.',
];

const B2CNyveeCoconPage: FC = () => {
  const { has } = useFlags();
  const zeroNumbersActive = has('FF_ZERO_NUMBERS');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const orchestration = useStai6Orchestration();

  const activePrompts = useMemo(() => {
    if (orchestration.guidance === 'grounding_soft') {
      return groundingPrompts;
    }
    return breathingPrompts;
  }, [orchestration.guidance]);

  return (
    <ConsentGate>
      <ZeroNumberBoundary
        enabled={zeroNumbersActive}
        className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
        <PreCheck
          visible={orchestration.preDue}
          summaryLabel={orchestration.summaryLabel}
          onStart={orchestration.startPre}
          prefersReducedMotion={prefersReducedMotion}
        />

        <NyveeFlowController
          sceneProfile={orchestration.sceneProfile}
          guidance={orchestration.guidance}
          prefersReducedMotion={prefersReducedMotion}
          summaryLabel={orchestration.summaryLabel}
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-indigo-100/80" aria-live="polite">
                La scène ajuste discrètement les textures sonores et la densité visuelle selon ton état présent.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-indigo-50">Rituel de souffle</p>
              <ul className="mt-3 space-y-2 text-sm text-indigo-100/90">
                {activePrompts.map((prompt) => (
                  <li key={prompt} className="leading-relaxed">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="ghost"
                className="border border-white/20 bg-white/10 text-indigo-50 hover:bg-white/20"
                aria-label="Activer un souffle plus long"
              >
                Allonger mon souffle
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="border border-white/20 bg-white/10 text-indigo-50 hover:bg-white/20"
                aria-label="Reposer l’esprit"
              >
                Relâcher la nuque
              </Button>
            </div>
          </div>
        </NyveeFlowController>

        <PostCheck
          visible={orchestration.postDue}
          summaryLabel={orchestration.summaryLabel}
          onStart={orchestration.startPost}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
      </ZeroNumberBoundary>
    </ConsentGate>
  );
};

export default B2CNyveeCoconPage;
