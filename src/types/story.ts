export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen?: boolean;
  image?: string;
  emotion?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

export interface StorytellingConfig {
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
}
