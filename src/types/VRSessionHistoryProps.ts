// @ts-nocheck

import { VRSession } from './vr';

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}
