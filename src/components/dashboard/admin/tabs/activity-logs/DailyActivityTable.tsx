
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getActivityLabel } from "./activityUtils";
import { format } from 'date-fns';
import { AnonymousActivity } from './types';

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
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Aucune donnée disponible.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type d'activité</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{getActivityLabel(activity.activity_type)}</TableCell>
              <TableCell>{activity.category}</TableCell>
              <TableCell>{activity.count}</TableCell>
              <TableCell>{format(new Date(activity.timestamp_day), 'dd/MM/yyyy')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DailyActivityTable;
