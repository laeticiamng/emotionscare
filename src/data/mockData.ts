
// This file now serves as an index file to export all mock data from one place
import { mockUsers, currentUser, loginUser, logoutUser, updateUser, getCurrentUser, generateAnonymityCode } from './mockUsers';
import { mockBadges } from './mockBadges';
import { mockEmotions } from './mockEmotions';
import { mockReports } from './mockReports';
import { mockVRTemplatesData } from './mockVRTemplates';

export { 
  // Users
  mockUsers,
  currentUser,
  loginUser,
  logoutUser,
  updateUser,
  getCurrentUser,
  generateAnonymityCode,
  
  // Badges
  mockBadges,
  
  // Emotions
  mockEmotions,
  
  // Reports
  mockReports,
  
  // VR Templates
  mockVRTemplatesData as mockVRTemplates
};
