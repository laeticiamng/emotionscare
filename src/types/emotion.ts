
export interface LiveVoiceScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}
