
// Fix the string | object profileVisibility type conflict in this component
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Update the preferences handling to properly handle profileVisibility
const updatePrivacySettings = (preferences: any) => {
  // Ensuring profileVisibility is properly structured
  let updatedPrivacy = preferences.privacy || {};
  
  // If profileVisibility is a string, convert it to the object format
  if (typeof preferences.profileVisibility === 'string') {
    updatedPrivacy.profileVisibility = preferences.profileVisibility;
  }
  // If it's already an object with profileVisibility property, use it
  else if (typeof preferences.profileVisibility === 'object') {
    updatedPrivacy = {
      ...updatedPrivacy,
      ...preferences.profileVisibility
    };
  }
  
  return {
    ...preferences,
    privacy: updatedPrivacy,
    // Remove the direct profileVisibility if it exists to avoid conflicts
    profileVisibility: undefined
  };
};
