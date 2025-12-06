// @ts-nocheck
// Types for innovation experiments

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed';
  createdAt?: string;
  [key: string]: any;
}
