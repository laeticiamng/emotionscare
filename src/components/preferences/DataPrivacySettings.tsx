
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Control, Controller } from 'react-hook-form'; // Import for form control
import { UserPreferences } from '@/types/preferences';

export interface DataPrivacyProps {
  className?: string;
  onToggleDataSharing?: (enabled: boolean) => void;
  onToggleAnonymizedData?: (enabled: boolean) => void;
  isDataSharingEnabled?: boolean;
  isAnonymizedDataEnabled?: boolean;
  control?: Control<UserPreferences, any>; // Add control prop for react-hook-form
  isLoading?: boolean; // Add loading state
}

const DataPrivacySettings: React.FC<DataPrivacyProps> = ({
  className = '',
  onToggleDataSharing,
  onToggleAnonymizedData,
  isDataSharingEnabled = false,
  isAnonymizedDataEnabled = true,
  control,
  isLoading = false,
}) => {
  // If control is provided, use react-hook-form Controller
  if (control) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Data Privacy</CardTitle>
          <CardDescription>
            Manage your data privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sharing">Share data with us?</Label>
            <Controller
              name="shareData"
              control={control}
              render={({ field }) => (
                <Switch
                  id="data-sharing"
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymized-data">Use anonymized data?</Label>
            <Controller
              name="anonymizedData"
              control={control}
              render={({ field }) => (
                <Switch
                  id="anonymized-data"
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Otherwise use the standard mode with direct props
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Data Privacy</CardTitle>
        <CardDescription>
          Manage your data privacy settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="data-sharing">Share data with us?</Label>
          <Switch
            id="data-sharing"
            checked={isDataSharingEnabled}
            onCheckedChange={onToggleDataSharing}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="anonymized-data">Use anonymized data?</Label>
          <Switch
            id="anonymized-data"
            checked={isAnonymizedDataEnabled}
            onCheckedChange={onToggleAnonymizedData}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
