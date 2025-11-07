// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDSAR } from '@/hooks/useDSAR';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const DSARManager = () => {
  const { requests, isLoading, generatePackage } = useDSAR();

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{request.request_type}</CardTitle>
              <Badge>{request.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Deadline: {format(new Date(request.legal_deadline), 'P', { locale: fr })}
            </p>
            {request.status === 'approved' && (
              <Button size="sm" onClick={() => generatePackage(request.id)}>
                <FileText className="h-4 w-4 mr-2" />
                Générer package
              </Button>
            )}
            {request.package_url && (
              <Button size="sm" variant="outline" asChild>
                <a href={request.package_url} download>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
