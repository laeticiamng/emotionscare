
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPreferences } from '@/types';
import PreferencesForm from './PreferencesForm';

const UserPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications_enabled: true,
    font_size: 'medium',
    language: 'en',
  });

  useEffect(() => {
    if (user && user.preferences) {
      setUserPreferences(user.preferences);
    }
  }, [user]);

  const handleSavePreferences = async (preferences: UserPreferences) => {
    if (user && updateUser) {
      await updateUser({ ...user, preferences });
      setUserPreferences(preferences);
      navigate('/dashboard');
    } else {
      console.error("User or updateUser not available");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <PreferencesForm 
            preferences={userPreferences} 
            onSave={handleSavePreferences} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferencesPage;
