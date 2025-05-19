
import React from 'react';
import { UserPreferences, UserPreferencesFormProps } from '@/types/preferences';
import PreferencesFormImpl from './PreferencesFormImpl';

const PreferencesForm: React.FC<UserPreferencesFormProps> = (props) => {
  return <PreferencesFormImpl {...props} />;
};

export default PreferencesForm;
