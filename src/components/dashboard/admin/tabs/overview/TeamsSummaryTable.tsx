
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TeamSummary } from '@/types/dashboard';
import { ChevronRight, TrendingUp, TrendingDown, ChevronsRight } from 'lucide-react';

const mockTeams: TeamSummary[] = [
  {
    id: '1',
    teamId: 'team-1',
    name: 'Équipe Marketing',
    memberCount: 12,
    averageEmotionalScore: 78,
    leaderName: 'Marie Lambert',
    department: 'Marketing',
    activeUsers: 10,
    trendDirection: 'up',
    trendValue: 3.2
  },
  {
    id: '2',
    teamId: 'team-2',
    name: 'Équipe Technique',
    memberCount: 18,
    averageEmotionalScore: 72,
    leaderName: 'Thomas Durand',
    department: 'Technique',
    activeUsers: 15,
    trendDirection: 'down',
    trendValue: 2.1
  },
  {
    id: '3',
    teamId: 'team-3',
    name: 'Équipe Design',
    memberCount: 8,
    averageEmotionalScore: 82,
    leaderName: 'Sophie Martin',
    department: 'Design',
    activeUsers: 8,
    trendDirection: 'up',
    trendValue: 4.5
  },
  {
    id: '4',
    teamId: 'team-4',
    name: 'Équipe Finance',
    memberCount: 6,
    averageEmotionalScore: 68,
    leaderName: 'Pierre Dupont',
    department: 'Finance',
    activeUsers: 5,
    trendDirection: 'stable',
    trendValue: 0.3
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
                      (team.averageEmotionalScore || 0) > 75
                        ? 'bg-green-500'
                        : (team.averageEmotionalScore || 0) > 65
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {team.averageEmotionalScore}%
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
