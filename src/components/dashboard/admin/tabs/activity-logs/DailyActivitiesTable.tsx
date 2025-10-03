
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/ui/data-table/Pagination";
import { AnonymousActivity } from './types';
import { getActivityLabel } from './activityUtils';

interface DailyActivitiesTableProps {
  activities: AnonymousActivity[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const DailyActivitiesTable: React.FC<DailyActivitiesTableProps> = ({
  activities,
  isLoading,
  error,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 text-center">
        Erreur: {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Aucune activité ne correspond aux critères de recherche.
      </div>
    );
  }

  return (
    <>
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
                <TableCell>
                  {format(new Date(activity.timestamp_day), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            totalItems={activities.length}
          />
        </div>
      )}
    </>
  );
};

export default DailyActivitiesTable;
