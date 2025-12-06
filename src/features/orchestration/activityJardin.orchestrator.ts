import type { UIHint } from './types';

export interface ActivityJardinOrchestratorInput {
  who5Level?: number;
}

export const activityJardinOrchestrator = ({ who5Level }: ActivityJardinOrchestratorInput): UIHint[] => {
  void who5Level;
  const items = ['Respirer doucement 1 min', 'Journal court (2 phrases)', 'Nyvée en silence'];
  return [{ action: 'show_highlights', items }];
};

export default activityJardinOrchestrator;
