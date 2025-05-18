
import React from 'react';
import { UserPreferences } from '@/types/preferences';
import PreferencesFormImpl from './PreferencesFormImpl';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (values: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = (props) => {
  return <PreferencesFormImpl {...props} />;
};

export default PreferencesForm;
