import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoodData, User } from '@/types';
import { generateMockMoodData } from '@/lib/mockDataGenerator';
import { Sparkles } from 'lucide-react';

interface UserDetailViewProps {
  user: User;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ user }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);

  useEffect(() => {
    // Generate mock mood data for the user
    const mockData = generateMockMoodData(30);
    setMoodData(mockData);
  }, []);

  const renderMoodTrend = (value: number) => {
    if (value > 70) return <Badge variant="outline">Positive</Badge>;
    if (value < 40) return <Badge variant="destructive">Negative</Badge>;
    return <Badge>Neutral</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Détails de l'utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || user.avatar || user.image} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Role:</strong> {user.role}
          </div>
          <div>
            <strong>Anonymity Code:</strong> {user.anonymity_code}
          </div>
          <div>
            <strong>Emotional Score:</strong> {user.emotional_score}
          </div>
          <div>
            <strong>Onboarded:</strong> {user.onboarded ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Joined At:</strong> {new Date(user.joined_at || user.created_at).toLocaleDateString()}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Value</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {moodData.map((data) => (
                    <tr key={data.originalDate || data.date}>
                      <td>{new Date(data.originalDate || data.date).toLocaleDateString()}</td>
                      <td>{data.value}</td>
                      <td>{renderMoodTrend(data.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default UserDetailView;
