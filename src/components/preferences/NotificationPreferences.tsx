import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { NotificationFrequency, NotificationTone } from '@/types/notification';

const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const notificationEnabled = preferences.notifications?.enabled ?? true;
  const emailEnabled = preferences.notifications?.emailEnabled ?? true;
  const pushEnabled = preferences.notifications?.pushEnabled ?? true;
  const inAppEnabled = preferences.notifications?.inAppEnabled ?? true;
  
  const frequency = preferences.notifications?.frequency || 'immediate';
  const tone = preferences.notifications?.tone || 'friendly';
  
  // Get types from preferences, use empty object if not available
  const notificationTypes = preferences.notifications?.types || {};
  
  const handleToggleNotifications = () => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        enabled: !notificationEnabled
      }
    });
  };
  
  const handleToggleChannel = (channel: 'emailEnabled' | 'pushEnabled' | 'inAppEnabled') => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [channel]: !preferences.notifications?.[channel]
      }
    });
  };
  
  const handleFrequencyChange = (newFrequency: NotificationFrequency) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        frequency: newFrequency
      }
    });
  };
  
  const handleToneChange = (newTone: NotificationTone) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        tone: newTone
      }
    });
  };
  
  const handleTypeToggle = (type: string) => {
    // Check if types exists, use empty object if not
    const existingTypes = preferences.notifications?.types || {};
    
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        types: {
          ...existingTypes,
          [type]: !existingTypes[type]
        }
      }
    });
  };
  
  const isTypeEnabled = (type: string): boolean => {
    // Check if types exists, use empty object if not
    const existingTypes = preferences.notifications?.types || {};
    
    // Default to true if not explicitly set
    return existingTypes[type] !== false;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive updates and information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General Settings</h3>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Control whether you receive any notifications
              </p>
            </div>
            <Switch
              checked={notificationEnabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Delivery Channels</h3>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={() => handleToggleChannel('emailEnabled')}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              checked={pushEnabled}
              onCheckedChange={() => handleToggleChannel('pushEnabled')}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications within the application
              </p>
            </div>
            <Switch
              checked={inAppEnabled}
              onCheckedChange={() => handleToggleChannel('inAppEnabled')}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Frequency & Tone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(value) => handleFrequencyChange(value as NotificationFrequency)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select a frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={tone}
                onValueChange={(value) => handleToneChange(value as NotificationTone)}
              >
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="motivational">Motivational</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Example types - replace with your actual types */}
            {['system', 'emotion', 'journal', 'coach', 'community', 'achievement'].map((type) => (
              <div key={type} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive {type} related notifications
                  </p>
                </div>
                <Switch
                  checked={isTypeEnabled(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
