
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useTheme } from '@/hooks/use-theme';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * This component is for testing purposes only.
 * It displays all the context values to verify they are accessible and valid.
 */
const TestContextAccess: React.FC = () => {
  // Access all contexts
  const auth = useAuth();
  const { userMode } = useUserMode();
  const theme = useTheme();
  const userPreferences = useUserPreferences();
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Context Access Test</h1>
      <p className="text-muted-foreground">This component displays all context values for debugging purposes.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Authentication Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>User:</strong> {auth.user ? 'Authenticated' : 'Not Authenticated'}
              {auth.user && (
                <Badge className="ml-2">{auth.user.role || 'No Role'}</Badge>
              )}
            </div>
            {auth.user && (
              <div className="text-sm space-y-1">
                <div><strong>ID:</strong> {auth.user.id}</div>
                <div><strong>Name:</strong> {auth.user.name}</div>
                <div><strong>Email:</strong> {auth.user.email}</div>
                <div><strong>Created:</strong> {auth.user.created_at}</div>
              </div>
            )}
            <div>
              <strong>Is Loading:</strong> {auth.isLoading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Has Error:</strong> {auth.error ? 'Yes' : 'No'}
              {auth.error && <div className="text-destructive">{auth.error.message}</div>}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Mode Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Current Mode:</strong> <Badge>{userMode}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Theme Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Current Theme:</strong> <Badge>{theme.theme}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Preferences Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPreferences.preferences ? (
              <>
                <div>
                  <strong>Theme:</strong> {userPreferences.preferences.theme}
                </div>
                {userPreferences.preferences.fontSize && (
                  <div>
                    <strong>Font Size:</strong> {userPreferences.preferences.fontSize}
                  </div>
                )}
                {userPreferences.preferences.fontFamily && (
                  <div>
                    <strong>Font Family:</strong> {userPreferences.preferences.fontFamily}
                  </div>
                )}
                <Separator />
                <div>
                  <strong>Notifications Enabled:</strong> {userPreferences.preferences.notifications?.enabled ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Dashboard Layout:</strong> {typeof userPreferences.preferences.dashboardLayout === 'string' ? 
                    userPreferences.preferences.dashboardLayout : 'Custom Object'}
                </div>
                <div>
                  <strong>Onboarding Completed:</strong> {userPreferences.preferences.onboardingCompleted ? 'Yes' : 'No'}
                </div>
              </>
            ) : (
              <div>No preferences available</div>
            )}
            
            <Separator />
            <div className="text-xs">
              <details>
                <summary>Raw Preferences Data</summary>
                <pre className="bg-muted p-2 rounded-md overflow-auto max-h-60 text-xs mt-2">
                  {JSON.stringify(userPreferences.preferences, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestContextAccess;
