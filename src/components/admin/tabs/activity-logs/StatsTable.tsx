import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ActivityStats } from "./types";
import { getActivityLabel } from "./activityUtils";

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
    return <div className="text-center py-4">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">Erreur: {error}</div>;
  }

  if (stats.length === 0) {
    return <div className="text-center py-4">Aucune statistique disponible</div>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type d'activité</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Distribution</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow key={stat.activity_type}>
              <TableCell className="font-medium">{getActivityLabel(stat.activity_type)}</TableCell>
              <TableCell>{stat.total_count}</TableCell>
              <TableCell className="w-[30%]">
                <Progress value={stat.percentage} className="h-2" />
              </TableCell>
              <TableCell className="text-right">{stat.percentage.toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatsTable;
