
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivityStats } from './types';
import { getActivityLabel } from './activityUtils';

interface StatsTableProps {
  stats: ActivityStats[];
  isLoading: boolean;
  error: string | null;
}

const StatsTable: React.FC<StatsTableProps> = ({
  stats,
  isLoading,
  error
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

  if (stats.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Aucune statistique disponible pour la période sélectionnée.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type d'activité</TableHead>
            <TableHead>Nombre total</TableHead>
            <TableHead>Pourcentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat, index) => (
            <TableRow key={index}>
              <TableCell>{getActivityLabel(stat.activity_type)}</TableCell>
              <TableCell>{stat.total_count}</TableCell>
              <TableCell>{stat.percentage.toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatsTable;
