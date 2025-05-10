
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

export interface Group {
  id: string;
  name: string;
  description: string;
  members_count: number;
  image?: string;
  tags?: string[];
  is_private: boolean;
  created_at: string | Date;
  owner_id: string;
}
