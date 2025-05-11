
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMode } from '@/contexts/UserModeContext';

interface UserSidePanelProps {
  collapsed: boolean;
  onToggle: () => void;
  userId: string;
  userMode?: UserMode;
}

const UserSidePanel: React.FC<UserSidePanelProps> = ({
  collapsed,
  onToggle,
  userId,
  userMode = 'b2c'
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Mon profil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Statistiques</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Card className="p-3">
                <div className="text-sm font-medium">Sessions</div>
                <div className="text-2xl">12</div>
              </Card>
              <Card className="p-3">
                <div className="text-sm font-medium">Minutes</div>
                <div className="text-2xl">187</div>
              </Card>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium">Badges récents</h3>
            <div className="mt-2 flex gap-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                🔥
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                🌊
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                🌱
              </div>
            </div>
          </div>
          
          {userMode === 'b2c' && (
            <div>
              <h3 className="font-medium">Objectifs</h3>
              <div className="mt-2 space-y-2">
                <Card className="p-3">
                  <div className="text-sm">Séances de méditation</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-muted-foreground">3 sur 5</div>
                    <div className="text-xs text-muted-foreground">60%</div>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSidePanel;
