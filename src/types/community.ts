
// Community related types

import { User } from './index';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  comments_count: number;
  tags?: string[];
  is_anonymous?: boolean;
  author?: User;
  is_featured?: boolean;
  image_url?: string;
  visibility: 'public' | 'team' | 'private';
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  parent_id?: string;
  author?: User;
  is_edited?: boolean;
  is_anonymous?: boolean;
}

export interface CommunityTag {
  id: string;
  name: string;
  count: number;
  color?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  member_count: number;
  created_at: string;
  updated_at?: string;
  is_private?: boolean;
  cover_image?: string;
  owner_id: string;
  tags?: string[];
}
