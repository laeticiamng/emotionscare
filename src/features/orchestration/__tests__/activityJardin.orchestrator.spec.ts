import { describe, expect, it } from 'vitest';

import { activityJardinOrchestrator } from '../activityJardin.orchestrator';

describe('activityJardinOrchestrator', () => {
  it('always proposes the supportive highlights', () => {
    const hints = activityJardinOrchestrator({ who5Level: 2 });
    expect(hints).toHaveLength(1);
    expect(hints[0]).toEqual({
      action: 'show_highlights',
      items: ['Respirer doucement 1 min', 'Journal court (2 phrases)', 'Nyvée en silence'],
    });
  });
});
