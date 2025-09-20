import type { UIHint } from './types';

interface ScreenSilkInput {
  cvsqLevel?: number;
  prm: boolean;
}

export function screenSilkOrchestrator({ cvsqLevel, prm }: ScreenSilkInput): UIHint[] {
  const hints: UIHint[] = [];

  if ((cvsqLevel ?? 0) >= 2) {
    hints.push({ action: 'set_blink_reminder', key: 'gentle' });
    hints.push({ action: 'set_blur_opacity', key: 'low' });
    hints.push({ action: 'post_cta', key: 'screen_silk' });
  }

  if (prm) {
    hints.push({ action: 'set_blur_opacity', key: 'very_low' });
  }

  return hints.length ? hints : [{ action: 'none' }];
}
