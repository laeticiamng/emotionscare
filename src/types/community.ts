
// Types for community-related components
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
  likes: number;
  comments: number;
  tags?: string[];
}
