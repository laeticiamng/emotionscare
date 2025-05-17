
export interface Challenge {
  id: string;
  title: string;
  name: string;
  description: string;
  progress: number;
  completed: boolean;
  status: string;
  points: number;
  difficulty: string;
  category: string;
  tags: string[];
  goal: number | string;
}
