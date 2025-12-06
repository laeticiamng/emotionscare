// @ts-nocheck

export interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  members_count: number;
  topic: string;
  is_private?: boolean;
  admin_id?: string;
  category?: string;
  tags?: string[];
  activity_level?: number;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  status: 'active' | 'inactive' | 'banned';
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface GroupPost {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  comments_count: number;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments?: {
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
  }[];
}
