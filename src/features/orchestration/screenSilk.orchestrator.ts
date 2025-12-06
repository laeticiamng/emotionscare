import type { UIHint } from './types';

export interface ScreenSilkOrchestratorInput {
  cvsqLevel?: number;
  prm: boolean;
}

export const screenSilkOrchestrator = ({ cvsqLevel, prm }: ScreenSilkOrchestratorInput): UIHint[] => {
  const hints: UIHint[] = [];

  if ((cvsqLevel ?? 0) >= 2) {
    hints.push({ action: 'set_blink_reminder', key: 'gentle' });
    hints.push({ action: 'set_blur_opacity', key: 'low' });
    hints.push({ action: 'post_cta', key: 'screen_silk' });
  }

  if (prm) {
    hints.push({ action: 'set_blur_opacity', key: 'very_low' });
  }

  if (hints.length === 0) {
    return [{ action: 'none' }];
  }

  return hints;
};

export default screenSilkOrchestrator;
