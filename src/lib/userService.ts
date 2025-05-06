
import { User } from '@/types';
import { mockUsers } from '@/data/mockUsers';

export const updateUser = async (updatedUserData: Partial<User>): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock updating the user in a real database
  const existingUser = mockUsers.find(user => user.id === updatedUserData.id);
  
  if (!existingUser) {
    throw new Error('User not found');
  }
  
  // Merge the existing user data with the updated data
  const updatedUser = {
    ...existingUser,
    ...updatedUserData,
  };
  
  // In a real implementation, we would update the user in the database here
  console.log('User updated:', updatedUser);
  
  return updatedUser as User;
};
