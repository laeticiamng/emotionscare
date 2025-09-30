// @ts-nocheck
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TeamSummary } from '@types/dashboard';
import { ChevronRight, TrendingUp, TrendingDown, ChevronsRight } from 'lucide-react';

const mockTeams: TeamSummary[] = [
  {
    id: '1',
    teamId: '1',
    name: 'Équipe Marketing',
    memberCount: 12,
    activeUsers: 10,
    averageScore: 78,
    trend: 3.2,
    trendDirection: 'up',
    trendValue: 3.2,
    department: 'Marketing',
  },
  {
    id: '2',
    teamId: '2',
    name: 'Équipe Technique',
    memberCount: 18,
    activeUsers: 15,
    averageScore: 72,
    trend: -2.1,
    trendDirection: 'down',
    trendValue: 2.1,
    department: 'Technique',
  },
  {
    id: '3',
    teamId: '3',
    name: 'Équipe Design',
    memberCount: 8,
    activeUsers: 8,
    averageScore: 82,
    trend: 4.5,
    trendDirection: 'up',
    trendValue: 4.5,
    department: 'Design',
  },
  {
    id: '4',
    teamId: '4',
    name: 'Équipe Finance',
    memberCount: 6,
    activeUsers: 5,
    averageScore: 68,
    trend: 0.3,
    trendDirection: 'stable',
    trendValue: 0.3,
    department: 'Finance',
  }
];

const TeamsSummaryTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Équipe</TableHead>
            <TableHead className="text-center">Membres</TableHead>
            <TableHead className="text-center">Score Émotionnel</TableHead>
            <TableHead className="text-center hidden md:table-cell">Actifs</TableHead>
            <TableHead className="text-center hidden md:table-cell">Tendance</TableHead>
            <TableHead className="text-center hidden sm:table-cell">Département</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell className="text-center">{team.memberCount}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div
                    className={`inline-block h-2 w-2 rounded-full mr-2 ${
                      (team.averageScore || 0) > 75
                        ? 'bg-green-500'
                        : (team.averageScore || 0) > 65
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {team.averageScore}%
                </div>
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                {team.activeUsers}/{team.memberCount}
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <div className="flex items-center justify-center">
                  {team.trendDirection === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : team.trendDirection === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <ChevronsRight className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  {team.trendValue}%
                </div>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">{team.department}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamsSummaryTable;
