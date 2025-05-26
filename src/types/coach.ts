
export interface CoachChatProps {
  initialMessage?: string;
  showCharacter?: boolean;
  characterSize?: 'sm' | 'md' | 'lg';
  className?: string;
  showControls?: boolean;
  showHeader?: boolean;
  showInput?: boolean;
  embedded?: boolean;
}

export interface CoachCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export interface CoachMessageProps {
  message: any;
  isLast?: boolean;
  className?: string;
}
