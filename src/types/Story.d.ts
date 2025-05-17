
export interface Story {
  id: string;
  title: string;
  content: string;
  author?: string;
  emotion?: string;
  created_at: string;
  tags?: string[];
  image?: string;
  date?: Date | string;
  cta?: {
    label: string;
    route?: string;
    action?: () => void;
  };
}
