
import React from 'react';
import { VRSession } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface VRHistoryListProps {
  sessions: VRSession[];
}

const VRHistoryList: React.FC<VRHistoryListProps> = ({ sessions }) => {
  // Format duration in minutes and seconds
  const formatDuration = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Format date as relative time
  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No session history yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium">
              {session.template?.title || "Unknown session"}
            </TableCell>
            <TableCell>
              {session.duration_seconds ? formatDuration(session.duration_seconds) : "N/A"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {session.start_time ? formatRelativeDate(session.start_time) : "Unknown"}
            </TableCell>
            <TableCell>
              {session.completed ? (
                <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                  Completed
                </Badge>
              ) : (
                <Badge variant="outline">In progress</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VRHistoryList;
