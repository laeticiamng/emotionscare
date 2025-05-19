
// Export individually from source instead of using star export
import { User, UserProfile, UserPreference, UserRole } from '../src/types/user';

export type { 
  User, 
  UserProfile, 
  UserPreference, 
  UserRole 
};

// If there's a default export in the original file:
// import UserDefault from '../src/types/user';
// export default UserDefault;
