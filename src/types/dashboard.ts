
import { ReactNode } from 'react';

export interface EmotionalTeamViewProps {
  period?: string;
  anonymized?: boolean;
  dateRange?: { from: Date; to: Date };
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
