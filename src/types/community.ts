// @ts-nocheck

export interface Post {
  id: string;
  user_id: string;
  userId?: string;
  date: string | Date;
  content: string;
  image_url?: string;
  imageUrl?: string;
  reactions: number;
  tags?: string[];
  title?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  postId?: string;
  user_id: string;
  userId?: string;
  date: string | Date;
  content: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  topic?: string;
  members?: string[];
  owner_id?: string;
  ownerId?: string;
  created_at?: string | Date;
  createdAt?: string | Date;
  image_url?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface TagSelectorProps {
  selectedTags: string[];
  maxTags?: number;
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  recommendedTags?: string[];
}
