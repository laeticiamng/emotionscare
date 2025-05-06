
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AnonymousActivity } from './types';
import { getActivityLabel } from './activityUtils';

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
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Erreur: {error}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune activité pour la période sélectionnée.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type d'activité</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Nombre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                {format(
                  new Date(activity.timestamp_day), 
                  'dd MMM yyyy', 
                  { locale: fr }
                )}
              </TableCell>
              <TableCell>{getActivityLabel(activity.activity_type)}</TableCell>
              <TableCell>
                <span className="capitalize">{activity.category}</span>
              </TableCell>
              <TableCell className="text-right font-medium">
                {activity.count}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DailyActivityTable;
