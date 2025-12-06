
// Fix the UserRole comparison error in this file
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/types';

// Update the type check for userRole
const checkUserAccess = (userRole: UserRole, allowedRoles: UserRole[]) => {
  // Converting 'personal' to a valid UserRole type - if it's a custom value
  // If personal is a valid value in UserRole, then use this condition
  if (allowedRoles.includes(userRole)) {
    return true;
  }
  return false;
};
