import React from 'react';
import { UserPreferences, UserPreferencesFormProps } from '@/types/preferences';

// First section of PreferencesForm

// Define the actual interface for the component's props to match usage
const PreferencesForm: React.FC<{
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}> = ({ preferences, onSave, isLoading = false }) => {
  return <PreferencesFormImpl preferences={preferences} onSave={onSave} isLoading={isLoading} />;
};

export default PreferencesForm;
