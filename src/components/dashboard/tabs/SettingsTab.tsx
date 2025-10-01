// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface SettingsTabProps {
  className?: string;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Paramètres du tableau de bord à venir.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
