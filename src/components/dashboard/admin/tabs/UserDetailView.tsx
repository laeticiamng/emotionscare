import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMockMoodData } from '@/lib/mockDataGenerator';
import MoodLineChart from '@/components/charts/MoodLineChart';
import { MoodData } from '@/types';

interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
}

// The issue is with MoodData being passed to MoodLineChart
// Let's update the component to handle the string originalDate

const UserDetailView: React.FC<UserDetailViewProps> = ({ userId, onBack }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user details and mood data here
    // For now, we'll use mock data
    const mockData = generateMockMoodData(30);
    setMoodData(mockData);
  }, [userId]);

  // Convert MoodData to format expected by MoodLineChart
  const convertMoodDataForChart = (data: MoodData[]) => {
    return data.map(item => ({
      ...item,
      // Make sure originalDate is compatible with both string and Date
      originalDate: item.originalDate || item.date
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Détails de l'utilisateur</h2>
        <p className="text-muted-foreground">Informations détaillées sur l'utilisateur sélectionné</p>
      </div>
      
      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Détails de base de l'utilisateur</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">ID Utilisateur</p>
            <p className="text-sm text-muted-foreground">{userId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Nom</p>
            <p className="text-sm text-muted-foreground">John Doe</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Email</p>
            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
          </div>
        </CardContent>
      </Card>
      
      {/* MoodChart with converted data */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution émotionnelle</CardTitle>
          <CardDescription>Visualisation de l'évolution de l'humeur</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass converted data to ensure compatibility */}
          <MoodLineChart data={convertMoodDataForChart(moodData)} />
        </CardContent>
      </Card>
      
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Effectuer des actions sur cet utilisateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" onClick={() => toast({
            title: "Supprimer l'utilisateur",
            description: "Cette action est irréversible",
            variant: "destructive"
          })}>Supprimer l'utilisateur</Button>
          <Button variant="outline" onClick={() => toast({
            title: "Réinitialiser le mot de passe",
            description: "Un email sera envoyé à l'utilisateur"
          })}>Réinitialiser le mot de passe</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailView;
