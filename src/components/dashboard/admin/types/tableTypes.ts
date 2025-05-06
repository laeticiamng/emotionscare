
export type SortableField = "name" | "email" | "role" | "emotional_score" | "anonymity_code";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  emotional_score?: number;
  anonymity_code?: string;
}
