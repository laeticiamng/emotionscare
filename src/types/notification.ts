
export interface NotificationFilter {
  type?: string[];
  read?: boolean;
  recent?: boolean;
  priority?: string[];
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  value?: number;
  max?: number;
  showLabel?: boolean;
  variant?: string;
}
