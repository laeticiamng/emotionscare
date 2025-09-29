
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnonymousActivity } from "./types";
import { getActivityLabel } from "./activityUtils";

interface DailyActivityTableProps {
  activities: AnonymousActivity[];
  isLoading: boolean;
  error: string | null;
}

const DailyActivityTable: React.FC<DailyActivityTableProps> = ({ 
  activities,
  isLoading,
  error
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">Erreur: {error}</div>;
  }

  if (activities.length === 0) {
    return <div className="text-center py-4">Aucune activité trouvée</div>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type d'activité</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Nombre</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{getActivityLabel(activity.activity_type)}</TableCell>
              <TableCell>{activity.category}</TableCell>
              <TableCell className="text-right">{activity.count}</TableCell>
              <TableCell className="text-right">
                {new Date(activity.timestamp_day).toLocaleDateString('fr-FR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DailyActivityTable;
