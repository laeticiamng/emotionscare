import type { UIHint } from './types';

interface ActivityJardinInput {
  who5Level?: number;
}

const HIGHLIGHTS = ['Respirer doucement une minute', 'Journal court deux phrases', 'Nyvée en silence'];

export function activityJardinOrchestrator({ who5Level }: ActivityJardinInput): UIHint[] {
  void who5Level;
  return [{ action: 'show_highlights', items: HIGHLIGHTS }];
}
