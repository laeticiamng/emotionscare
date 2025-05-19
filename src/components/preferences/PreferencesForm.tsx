
import React from 'react';
import { UserPreferences, UserPreferencesFormProps } from '@/types/preferences';
import PreferencesFormImpl from './PreferencesFormImpl';

const PreferencesForm: React.FC<UserPreferencesFormProps> = ({ preferences, onSave, isLoading }) => {
  return <PreferencesFormImpl preferences={preferences} onSave={onSave} isLoading={isLoading} />;
};

export default PreferencesForm;
