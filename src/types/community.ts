
import { Post as BasePost, Comment as BaseComment, Group as BaseGroup } from './index';

export interface Post extends Partial<BasePost> {
  id: string;
  user_id: string;
  date: string;
  content: string;
  media_url?: string;
  image_url?: string;
  reactions: number;
  comments?: Comment[];
}

export interface Comment extends Partial<BaseComment> {
  id: string;
  post_id: string;
  user_id: string;
  date: string;
  content: string;
}

export interface Group extends Partial<BaseGroup> {
  id: string;
  name: string;
  topic: string;
  description?: string;
  members: string[];
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_user_id: string;
  matched_on: string;
  date: string;
}
