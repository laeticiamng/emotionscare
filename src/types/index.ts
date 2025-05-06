
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  onboarded: boolean;
  anonymity_code: string;
  emotional_score?: number;
}
