
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useUserPreferences } from '@/contexts/PreferencesContext';
import { useMusic } from '@/contexts/music';
import { normalizeUserMode } from '@/utils/userModeHelpers';

/**
 * Component for testing context access and values
 * Useful for debugging context-related issues
 */
const TestContextAccess: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const { preferences, isLoading: preferencesLoading } = useUserPreferences();
  const { isInitialized: musicInitialized } = useMusic();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Context Access Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Context */}
        <Card>
          <CardHeader>
            <CardTitle>Auth Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user ? (
                <div className="space-y-2">
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                </div>
              ) : (
                <p className="italic text-muted-foreground">No user data</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* UserMode Context */}
        <Card>
          <CardHeader>
            <CardTitle>UserMode Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {userModeLoading ? 'Yes' : 'No'}</p>
              <p><strong>Current Mode:</strong> {userMode || 'None'}</p>
              <p><strong>Normalized Mode:</strong> {normalizeUserMode(userMode)}</p>
              
              {user?.role && userMode && (
                <div className="mt-4 p-3 rounded-md bg-muted">
                  <p><strong>Role/Mode Match Check:</strong></p>
                  <p>User Role: {user.role}</p>
                  <p>User Mode: {userMode}</p>
                  <p>Normalized Role: {normalizeUserMode(user.role)}</p>
                  <p>Normalized Mode: {normalizeUserMode(userMode)}</p>
                  <p className={normalizeUserMode(user.role) === normalizeUserMode(userMode) ? 'text-green-500' : 'text-red-500'}>
                    <strong>
                      {normalizeUserMode(user.role) === normalizeUserMode(userMode) ? '✓ MATCH' : '✗ MISMATCH'}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Preferences Context */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {preferencesLoading ? 'Yes' : 'No'}</p>
              
              {preferences ? (
                <div>
                  <p><strong>Theme:</strong> {preferences.theme}</p>
                  <p><strong>Language:</strong> {preferences.language}</p>
                  <p><strong>Notifications:</strong> {preferences.notifications_enabled ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Email Notifications:</strong> {preferences.email_notifications ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Font Family:</strong> {preferences.fontFamily || 'Default'}</p>
                  <p><strong>Font Size:</strong> {preferences.fontSize || 'Default'}</p>
                  <p><strong>Reduce Motion:</strong> {preferences.reduceMotion ? 'Yes' : 'No'}</p>
                  <p><strong>Sound Enabled:</strong> {preferences.soundEnabled ? 'Yes' : 'No'}</p>
                  <p><strong>Ambient Sound:</strong> {preferences.ambientSound || 'None'}</p>
                </div>
              ) : (
                <p className="italic text-muted-foreground">No preferences data</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Music Context */}
        <Card>
          <CardHeader>
            <CardTitle>Music Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Initialized:</strong> {musicInitialized ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestContextAccess;
