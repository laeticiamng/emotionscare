
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User, Heart, Activity, Calendar } from 'lucide-react';

interface PersonalDataTabProps {
  className?: string;
}

const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ className }) => {
  const { user } = useAuth();
  
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Mes données personnelles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Mon bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">7.2/10</p>
            <p className="text-sm text-muted-foreground">Score moyen cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Mes activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">12</p>
            <p className="text-sm text-muted-foreground">Sessions cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-500" />
              Ma progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">85%</p>
            <p className="text-sm text-muted-foreground">Objectifs atteints</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mes dernières émotions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Seules vos données personnelles sont visibles ici. 
            Vos informations restent privées et ne sont jamais partagées individuellement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDataTab;
