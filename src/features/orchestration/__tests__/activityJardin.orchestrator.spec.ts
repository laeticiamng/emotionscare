import { describe, expect, it } from 'vitest';

import { activityJardinOrchestrator } from '../activityJardin.orchestrator';

describe('activityJardinOrchestrator', () => {
  it('always returns the highlight list', () => {
    const hints = activityJardinOrchestrator({ who5Level: 2 });
    expect(hints).toEqual([
      {
        action: 'show_highlights',
        items: ['Respirer doucement une minute', 'Journal court deux phrases', 'Nyvée en silence'],
      },
    ]);
  });
});
