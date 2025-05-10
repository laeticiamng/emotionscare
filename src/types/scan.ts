
// Types for scan-related components
export * from './index';

export interface ScanOptions {
  text?: string;
  audio?: string;
  emojis?: string;
  isConfidential?: boolean;
  shareWithCoach?: boolean;
}
