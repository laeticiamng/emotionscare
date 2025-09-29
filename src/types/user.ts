export interface User {
  id: string;
  email: string;
  role: 'b2c' | 'b2b';
  name?: string;
}

export type Segment = 'b2c' | 'b2b';