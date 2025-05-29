
import { VRSessionTemplate, VRSession } from './index';

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart: (template: VRSessionTemplate) => void;
  onBack: () => void;
  heartRate?: number;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
  onSessionSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  showHeader?: boolean;
  className?: string;
}

export { VRSessionTemplate, VRSession };
