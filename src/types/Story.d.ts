
export interface Story {
  id: string;
  title: string;
  content: string;
  author?: string;
  emotion?: string;
  created_at: string;
  tags?: string[];
  date?: string;
  cta?: {
    text: string;
    link: string;
  };
}
