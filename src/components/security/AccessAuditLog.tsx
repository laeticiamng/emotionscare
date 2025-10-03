
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessAttempt {
  id: string;
  page: string;
  timestamp: string;
  success: boolean;
  userRole: string;
  requiredRole?: string;
  reason?: string;
  location: string;
}

interface AccessAuditLogProps {
  attempts?: AccessAttempt[];
}

const AccessAuditLog: React.FC<AccessAuditLogProps> = ({ attempts = [] }) => {
  const mockAttempts: AccessAttempt[] = [
    {
      id: '1',
      page: '/b2b/admin/dashboard',
      timestamp: '2024-01-20T10:30:00Z',
      success: true,
      userRole: 'b2b_admin',
      location: 'Paris, France'
    },
    {
      id: '2',
      page: '/teams',
      timestamp: '2024-01-20T10:25:00Z',
      success: false,
      userRole: 'b2c',
      requiredRole: 'b2b_admin',
      reason: 'Rôle insuffisant',
      location: 'Paris, France'
    },
    {
      id: '3',
      page: '/scan',
      timestamp: '2024-01-20T10:20:00Z',
      success: true,
      userRole: 'b2c',
      location: 'Paris, France'
    },
    {
      id: '4',
      page: '/reports',
      timestamp: '2024-01-20T10:15:00Z',
      success: false,
      userRole: 'b2b_user',
      requiredRole: 'b2b_admin',
      reason: 'Accès administrateur requis',
      location: 'Lyon, France'
    }
  ];

  const accessAttempts = attempts.length > 0 ? attempts : mockAttempts;

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Autorisé
      </Badge>
    ) : (
      <Badge variant="destructive">
        Refusé
      </Badge>
    );
  };

  const stats = {
    total: accessAttempts.length,
    successful: accessAttempts.filter(a => a.success).length,
    failed: accessAttempts.filter(a => !a.success).length,
    successRate: Math.round((accessAttempts.filter(a => a.success).length / accessAttempts.length) * 100)
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total des accès</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                <div className="text-xs text-muted-foreground">Autorisés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-xs text-muted-foreground">Refusés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
                <div className="text-xs text-muted-foreground">Taux de réussite</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Journal des accès récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {accessAttempts.map((attempt) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border ${
                    attempt.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(attempt.success)}
                      <div className="flex-1">
                        <div className="font-medium">{attempt.page}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(attempt.timestamp).toLocaleString('fr-FR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {attempt.location}
                        </div>
                        {attempt.reason && (
                          <div className="text-xs text-red-600 mt-1">
                            {attempt.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(attempt.success)}
                      <div className="text-xs text-muted-foreground">
                        Rôle: {attempt.userRole}
                      </div>
                      {attempt.requiredRole && (
                        <div className="text-xs text-orange-600">
                          Requis: {attempt.requiredRole}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessAuditLog;
