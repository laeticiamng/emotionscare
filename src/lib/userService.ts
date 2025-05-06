
import { mockUsers } from '@/data/mockUsers';

// Generate more mock users for testing
const generateMockUsers = (count: number) => {
  const users = [...mockUsers];
  const baseLength = users.length;
  
  for (let i = 0; i < count - baseLength; i++) {
    const id = `generated-${i+1}`;
    const index = i % mockUsers.length; // Cycle through the original users for data
    const baseUser = mockUsers[index];
    
    users.push({
      ...baseUser,
      id,
      name: `${baseUser.name} ${Math.floor(i / mockUsers.length) + 1}`,
      email: `user${i+baseLength+1}@example.com`,
      anonymity_code: `AC${100000 + i}`,
      emotional_score: Math.floor(Math.random() * 100),
    });
  }
  
  return users;
};

// Generate 100 users for demo
const DEMO_USERS = generateMockUsers(100);

interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Simulate a paginated API call
export const fetchUsers = async (
  { page, limit }: PaginationParams
): Promise<PaginatedResponse<typeof mockUsers[0]>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedUsers = DEMO_USERS.slice(startIndex, endIndex);
  const totalItems = DEMO_USERS.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    data: paginatedUsers,
    totalItems,
    totalPages,
    currentPage: page
  };
};
