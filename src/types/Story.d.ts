
export interface Story {
  id: string;
  title: string;
  content: string;
  author?: string;
  emotion?: string;
  created_at: string;
  tags?: string[];
  image?: string;
  date?: string;
  cta?: {
    label: string;
    link: string;
  };
}
