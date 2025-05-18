import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface DataPrivacyProps {
  className?: string;
  onToggleDataSharing?: (enabled: boolean) => void;
  onToggleAnonymizedData?: (enabled: boolean) => void;
  isDataSharingEnabled?: boolean;
  isAnonymizedDataEnabled?: boolean;
}

const DataPrivacySettings: React.FC<DataPrivacyProps> = ({
  className = '',
  onToggleDataSharing,
  onToggleAnonymizedData,
  isDataSharingEnabled = false,
  isAnonymizedDataEnabled = true,
}) => {
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
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="anonymized-data">Use anonymized data?</Label>
          <Switch
            id="anonymized-data"
            checked={isAnonymizedDataEnabled}
            onCheckedChange={onToggleAnonymizedData}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
