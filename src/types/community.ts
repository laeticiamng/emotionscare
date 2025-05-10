
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags?: string[];
  likes: number;
  comments_count: number;
  created_at: string | Date;
  updated_at: string | Date;
  author?: {
    name: string;
    avatar: string;
  };
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string | Date;
  updated_at: string | Date;
  author?: {
    name: string;
    avatar: string;
  };
}
